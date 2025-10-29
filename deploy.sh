#!/bin/bash

# Скрипт для быстрого деплоя приложения
# Использование: ./deploy.sh

set -e

echo "🚀 Начинаем деплой Top Drink Coffee..."

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и попробуйте снова."
    exit 1
fi

# Проверка наличия Docker Compose
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose и попробуйте снова."
    exit 1
fi

# Проверка наличия .env файла
if [ ! -f .env ]; then
    echo "⚠️  Файл .env не найден. Создаем из .env.example..."
    cp .env.example .env
    echo "✅ Файл .env создан. ВАЖНО: Отредактируйте .env и измените JWT_SECRET!"
    echo "   Для генерации секретного ключа используйте: openssl rand -base64 32"
    read -p "Нажмите Enter после редактирования .env файла..."
fi

# Создание необходимых директорий
echo "📁 Создаем необходимые директории..."
mkdir -p data nginx/logs nginx/ssl
chmod 755 data nginx/logs

# Остановка старых контейнеров (если есть)
echo "🛑 Останавливаем старые контейнеры..."
docker compose down 2>/dev/null || true

# Сборка и запуск
echo "🔨 Собираем и запускаем контейнеры..."
docker compose up -d --build

# Ожидание запуска
echo "⏳ Ожидаем запуск приложения..."
sleep 10

# Проверка статуса
echo "📊 Проверяем статус контейнеров..."
docker compose ps

# Проверка health check
echo "🏥 Проверяем health check..."
if curl -f http://localhost/health &> /dev/null; then
    echo "✅ Приложение успешно запущено!"
else
    echo "⚠️  Health check не прошел. Проверьте логи: docker compose logs"
fi

# Вывод информации
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Деплой завершен!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Приложение доступно по адресу:"
echo "   HTTP: http://localhost"
echo "   или http://$(hostname -I | awk '{print $1}')"
echo ""
echo "👤 Админ-панель:"
echo "   URL: http://localhost/admin"
echo "   Логин: admin"
echo "   Пароль: admin123"
echo "   ⚠️  ВАЖНО: Смените пароль после первого входа!"
echo ""
echo "📝 Полезные команды:"
echo "   Логи:           docker compose logs -f"
echo "   Перезапуск:     docker compose restart"
echo "   Остановка:      docker compose down"
echo "   Обновление:     git pull && docker compose up -d --build"
echo ""
echo "🔒 Для настройки HTTPS смотрите DEPLOYMENT.md (Шаг 3)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

