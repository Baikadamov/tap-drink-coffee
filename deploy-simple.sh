#!/bin/bash

# Скрипт быстрого деплоя без SSL
# Использование: ./deploy-simple.sh

set -e

echo "🚀 Начинаем деплой TapDrink..."
echo ""

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен!"
    echo "Установите Docker: curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh"
    exit 1
fi

# Проверка Docker Compose
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose не установлен!"
    echo "Установите Docker Compose: sudo apt install docker-compose-plugin -y"
    exit 1
fi

echo "✅ Docker и Docker Compose установлены"
echo ""

# Создание .env если не существует
if [ ! -f .env ]; then
    echo "📝 Создаем файл .env..."
    
    # Генерируем случайный JWT_SECRET
    JWT_SECRET=$(openssl rand -base64 32)
    
    cat > .env << EOF
JWT_SECRET=$JWT_SECRET
NODE_ENV=production
EOF
    
    echo "✅ Файл .env создан"
else
    echo "✅ Файл .env уже существует"
fi

echo ""

# Создание необходимых директорий
echo "📁 Создаем необходимые директории..."
mkdir -p data nginx/logs nginx/ssl
chmod 755 data nginx/logs

echo "✅ Директории созданы"
echo ""

# Остановка старых контейнеров
echo "🛑 Останавливаем старые контейнеры (если есть)..."
docker compose down 2>/dev/null || true
echo ""

# Сборка образа
echo "🔨 Собираем Docker образ..."
echo "⏳ Это может занять несколько минут..."
docker compose build --no-cache

echo ""
echo "✅ Образ собран"
echo ""

# Запуск контейнеров
echo "🚀 Запускаем контейнеры..."
docker compose up -d

echo ""
echo "✅ Контейнеры запущены"
echo ""

# Ожидание запуска
echo "⏳ Ожидаем запуска приложения..."
sleep 10

# Проверка статуса
echo ""
echo "📊 Статус контейнеров:"
docker compose ps

echo ""
echo "📋 Логи приложения:"
docker compose logs --tail=20 app

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Деплой завершен!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Приложение доступно по адресу:"
echo "   http://$(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_SERVER_IP')"
echo ""
echo "🔐 Админ-панель:"
echo "   URL: http://$(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_SERVER_IP')/admin"
echo "   Логин: admin"
echo "   Пароль: admin123"
echo ""
echo "⚠️  ВАЖНО: Сразу смените пароль администратора!"
echo ""
echo "📊 Полезные команды:"
echo "   docker compose logs -f          # Просмотр логов"
echo "   docker compose restart          # Перезапуск"
echo "   docker compose down             # Остановка"
echo "   docker compose ps               # Статус контейнеров"
echo ""
echo "📖 Подробная документация: DEPLOY-NO-SSL.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

