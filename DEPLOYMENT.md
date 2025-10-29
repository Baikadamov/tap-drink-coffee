# 🚀 Инструкция по деплою на VPS

## 📋 Необходимые файлы для деплоя

Убедитесь, что на сервере присутствуют следующие файлы и директории:

```
top-drink-coffee/
├── app/                          # Исходный код приложения
├── components/                   # React компоненты
├── lib/                          # Утилиты и библиотеки
├── public/                       # Статические файлы
├── styles/                       # Стили
├── data/                         # База данных SQLite (создастся автоматически)
├── nginx/                        # Конфигурация Nginx
│   ├── nginx.conf               # Основная конфигурация Nginx
│   ├── conf.d/
│   │   └── default.conf         # Конфигурация виртуального хоста
│   ├── ssl/                     # SSL сертификаты (добавите позже)
│   └── logs/                    # Логи Nginx
├── Dockerfile                    # Docker образ для Next.js
├── docker-compose.yml           # Конфигурация Docker Compose
├── .env                         # Переменные окружения (создайте из .env.example)
├── .env.example                 # Пример переменных окружения
├── package.json                 # Зависимости Node.js
├── pnpm-lock.yaml              # Lock файл pnpm
├── next.config.mjs             # Конфигурация Next.js
└── tsconfig.json               # Конфигурация TypeScript
```

## 🔧 Предварительные требования

На VPS сервере должны быть установлены:
- **Docker** (версия 20.10+)
- **Docker Compose** (версия 2.0+)
- **Git** (для клонирования репозитория)

### Установка Docker на Ubuntu/Debian

```bash
# Обновление пакетов
sudo apt update && sudo apt upgrade -y

# Установка зависимостей
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Добавление GPG ключа Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Добавление репозитория Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установка Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Добавление пользователя в группу docker
sudo usermod -aG docker $USER

# Перелогиньтесь для применения изменений
```

## 📦 Шаг 1: Подготовка проекта на сервере

### 1.1 Клонирование репозитория

```bash
# Перейдите в домашнюю директорию
cd ~

# Клонируйте репозиторий
git clone <URL_вашего_репозитория> top-drink-coffee

# Перейдите в директорию проекта
cd top-drink-coffee
```

### 1.2 Настройка переменных окружения

```bash
# Создайте .env файл из примера
cp .env.example .env

# Отредактируйте .env файл
nano .env
```

**Важно!** Измените `JWT_SECRET` на случайную строку:

```env
JWT_SECRET=ваш-супер-секретный-ключ-минимум-32-символа
NODE_ENV=production
```

Для генерации безопасного ключа можно использовать:
```bash
openssl rand -base64 32
```

### 1.3 Создание необходимых директорий

```bash
# Создайте директории для данных и логов
mkdir -p data nginx/logs nginx/ssl

# Установите правильные права
chmod 755 data nginx/logs
```

## 🐳 Шаг 2: Запуск приложения

### 2.1 Запуск без SSL (для первоначального тестирования)

```bash
# Запустите Docker Compose
docker compose up -d

# Проверьте статус контейнеров
docker compose ps

# Посмотрите логи
docker compose logs -f
```

Приложение будет доступно по адресу: `http://ваш-ip-адрес`

### 2.2 Проверка работоспособности

```bash
# Проверьте, что контейнеры запущены
docker compose ps

# Проверьте логи приложения
docker compose logs app

# Проверьте логи Nginx
docker compose logs nginx

# Проверьте health check
curl http://localhost/health
```

## 🔒 Шаг 3: Настройка SSL сертификата (HTTPS)

### 3.1 Установка Certbot

```bash
# Установите Certbot
sudo apt install -y certbot

# Или используйте snap (рекомендуется)
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### 3.2 Получение SSL сертификата

**Важно!** Перед этим шагом убедитесь, что:
- Ваш домен указывает на IP адрес сервера (A-запись в DNS)
- Порт 80 открыт в файрволе

```bash
# Остановите Nginx временно
docker compose stop nginx

# Получите сертификат
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Сертификаты будут сохранены в /etc/letsencrypt/live/your-domain.com/
```

### 3.3 Копирование сертификатов

```bash
# Скопируйте сертификаты в директорию проекта
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ~/top-drink-coffee/nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ~/top-drink-coffee/nginx/ssl/

# Установите правильные права
sudo chown $USER:$USER ~/top-drink-coffee/nginx/ssl/*.pem
chmod 644 ~/top-drink-coffee/nginx/ssl/fullchain.pem
chmod 600 ~/top-drink-coffee/nginx/ssl/privkey.pem
```

### 3.4 Настройка Nginx для HTTPS

Отредактируйте файл `nginx/conf.d/default.conf`:

```bash
nano nginx/conf.d/default.conf
```

1. **Раскомментируйте** блок HTTP редиректа (строки 6-20)
2. **Раскомментируйте** блок HTTPS сервера (строки 73-141)
3. **Замените** `your-domain.com` на ваш реальный домен

### 3.5 Перезапуск с SSL

```bash
# Перезапустите контейнеры
docker compose restart nginx

# Проверьте логи
docker compose logs nginx
```

Теперь ваше приложение доступно по HTTPS: `https://your-domain.com`

### 3.6 Автоматическое обновление сертификатов

```bash
# Создайте скрипт для обновления
sudo nano /etc/cron.monthly/renew-ssl.sh
```

Добавьте в файл:

```bash
#!/bin/bash
certbot renew --quiet
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /home/your-user/top-drink-coffee/nginx/ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem /home/your-user/top-drink-coffee/nginx/ssl/
cd /home/your-user/top-drink-coffee && docker compose restart nginx
```

```bash
# Сделайте скрипт исполняемым
sudo chmod +x /etc/cron.monthly/renew-ssl.sh
```

## 🔥 Настройка Firewall

```bash
# Установите UFW (если не установлен)
sudo apt install -y ufw

# Разрешите SSH (ВАЖНО! Сделайте это первым)
sudo ufw allow 22/tcp

# Разрешите HTTP и HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Включите firewall
sudo ufw enable

# Проверьте статус
sudo ufw status
```

## 📊 Полезные команды

### Управление контейнерами

```bash
# Запуск
docker compose up -d

# Остановка
docker compose down

# Перезапуск
docker compose restart

# Пересборка и запуск
docker compose up -d --build

# Просмотр логов
docker compose logs -f

# Просмотр логов конкретного сервиса
docker compose logs -f app
docker compose logs -f nginx
```

### Обновление приложения

```bash
# Перейдите в директорию проекта
cd ~/top-drink-coffee

# Получите последние изменения
git pull

# Пересоберите и перезапустите
docker compose up -d --build

# Проверьте логи
docker compose logs -f
```

### Резервное копирование базы данных

```bash
# Создайте backup
cp data/applications.db data/applications.db.backup-$(date +%Y%m%d)

# Или настройте автоматический backup
echo "0 2 * * * cp ~/top-drink-coffee/data/applications.db ~/top-drink-coffee/data/applications.db.backup-\$(date +\%Y\%m\%d)" | crontab -
```

### Очистка Docker

```bash
# Удалить неиспользуемые образы
docker image prune -a

# Удалить неиспользуемые volumes
docker volume prune

# Полная очистка
docker system prune -a --volumes
```

## 🐛 Решение проблем

### Приложение не запускается

```bash
# Проверьте логи
docker compose logs app

# Проверьте, что порты не заняты
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :80
```

### Nginx не может подключиться к приложению

```bash
# Проверьте, что контейнеры в одной сети
docker network ls
docker network inspect top-drink-coffee_top-drink-network

# Проверьте DNS внутри контейнера
docker compose exec nginx ping app
```

### SSL сертификат не работает

```bash
# Проверьте, что файлы существуют
ls -la nginx/ssl/

# Проверьте права доступа
ls -la nginx/ssl/*.pem

# Проверьте конфигурацию Nginx
docker compose exec nginx nginx -t
```

## 📝 Доступ к админ-панели

После запуска приложения:

- **URL**: `https://your-domain.com/admin`
- **Логин**: `admin`
- **Пароль**: `admin123`

**⚠️ ВАЖНО!** Смените пароль администратора сразу после первого входа!

## 🎉 Готово!

Ваше приложение успешно развернуто и доступно по адресу:
- HTTP: `http://your-domain.com` (будет редиректить на HTTPS)
- HTTPS: `https://your-domain.com`

Админ-панель: `https://your-domain.com/admin`

