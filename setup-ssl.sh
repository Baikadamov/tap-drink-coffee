#!/bin/bash

# Скрипт для настройки SSL сертификата с Let's Encrypt
# Использование: ./setup-ssl.sh your-domain.com

set -e

# Проверка аргументов
if [ -z "$1" ]; then
    echo "❌ Ошибка: Не указан домен"
    echo "Использование: ./setup-ssl.sh your-domain.com"
    exit 1
fi

DOMAIN=$1
EMAIL=${2:-admin@$DOMAIN}

echo "🔒 Настройка SSL для домена: $DOMAIN"
echo "📧 Email для уведомлений: $EMAIL"
echo ""

# Проверка наличия certbot
if ! command -v certbot &> /dev/null; then
    echo "📦 Certbot не установлен. Устанавливаем..."
    
    if command -v snap &> /dev/null; then
        sudo snap install --classic certbot
        sudo ln -sf /snap/bin/certbot /usr/bin/certbot
    else
        sudo apt update
        sudo apt install -y certbot
    fi
    
    echo "✅ Certbot установлен"
fi

# Проверка DNS
echo "🔍 Проверяем DNS записи..."
DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)
SERVER_IP=$(curl -s ifconfig.me)

if [ "$DOMAIN_IP" != "$SERVER_IP" ]; then
    echo "⚠️  ВНИМАНИЕ: DNS запись домена ($DOMAIN_IP) не совпадает с IP сервера ($SERVER_IP)"
    echo "   Убедитесь, что A-запись домена указывает на IP сервера"
    read -p "Продолжить? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Остановка Nginx для получения сертификата
echo "🛑 Останавливаем Nginx..."
docker compose stop nginx

# Получение сертификата
echo "📜 Получаем SSL сертификат..."
sudo certbot certonly --standalone \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --preferred-challenges http

# Проверка успешности
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "❌ Ошибка: Не удалось получить сертификат"
    docker compose start nginx
    exit 1
fi

# Копирование сертификатов
echo "📋 Копируем сертификаты..."
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ./nginx/ssl/

# Установка прав
sudo chown $USER:$USER ./nginx/ssl/*.pem
chmod 644 ./nginx/ssl/fullchain.pem
chmod 600 ./nginx/ssl/privkey.pem

echo "✅ Сертификаты скопированы"

# Обновление конфигурации Nginx
echo "⚙️  Обновляем конфигурацию Nginx..."

# Создаем резервную копию
cp nginx/conf.d/default.conf nginx/conf.d/default.conf.backup

# Заменяем домен в конфигурации
sed -i "s/your-domain.com/$DOMAIN/g" nginx/conf.d/default.conf

# Раскомментируем HTTPS блоки
sed -i '/# server {/,/# }/s/^# //' nginx/conf.d/default.conf

echo "✅ Конфигурация обновлена"

# Перезапуск Nginx
echo "🔄 Перезапускаем Nginx..."
docker compose up -d nginx

# Проверка конфигурации
echo "🔍 Проверяем конфигурацию Nginx..."
sleep 3
docker compose exec nginx nginx -t

# Настройка автоматического обновления
echo "⏰ Настраиваем автоматическое обновление сертификатов..."

RENEW_SCRIPT="/etc/cron.monthly/renew-ssl-$DOMAIN.sh"
sudo tee $RENEW_SCRIPT > /dev/null <<EOF
#!/bin/bash
certbot renew --quiet
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $(pwd)/nginx/ssl/
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $(pwd)/nginx/ssl/
cd $(pwd) && docker compose restart nginx
EOF

sudo chmod +x $RENEW_SCRIPT

echo "✅ Автоматическое обновление настроено"

# Вывод информации
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ SSL успешно настроен!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Ваше приложение доступно по адресу:"
echo "   HTTPS: https://$DOMAIN"
echo "   HTTPS: https://www.$DOMAIN"
echo ""
echo "🔒 Сертификат действителен 90 дней"
echo "   Автоматическое обновление: $RENEW_SCRIPT"
echo ""
echo "📝 Резервная копия конфигурации:"
echo "   nginx/conf.d/default.conf.backup"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

