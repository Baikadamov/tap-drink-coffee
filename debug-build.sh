#!/bin/bash

# Скрипт для отладки сборки Docker образа

set -e

echo "==================================="
echo "🔍 Отладка сборки Docker образа"
echo "==================================="
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Остановить контейнеры
echo -e "${YELLOW}1. Остановка контейнеров...${NC}"
docker compose down

# Очистить старые образы
echo -e "${YELLOW}2. Очистка старых образов...${NC}"
docker compose down --rmi all

# Собрать с выводом всех логов
echo -e "${YELLOW}3. Сборка образа с отладкой...${NC}"
docker compose build --no-cache --progress=plain 2>&1 | tee build.log

# Проверить что образ создан
echo ""
echo -e "${YELLOW}4. Проверка образа...${NC}"
if docker images | grep -q "tap-drink-coffee-app"; then
    echo -e "${GREEN}✓ Образ создан успешно${NC}"
else
    echo -e "${RED}✗ Образ не создан${NC}"
    exit 1
fi

# Запустить контейнер для проверки
echo ""
echo -e "${YELLOW}5. Запуск контейнера...${NC}"
docker compose up -d

# Подождать запуска
echo -e "${YELLOW}6. Ожидание запуска (5 секунд)...${NC}"
sleep 5

# Проверить что контейнер запущен
echo ""
echo -e "${YELLOW}7. Проверка статуса контейнеров...${NC}"
docker compose ps

# Проверить логи
echo ""
echo -e "${YELLOW}8. Проверка логов...${NC}"
docker compose logs app | tail -30

# Проверить наличие better_sqlite3.node в контейнере
echo ""
echo -e "${YELLOW}9. Проверка better_sqlite3.node в контейнере...${NC}"
docker compose exec -T app sh -c "find /app/node_modules -name 'better_sqlite3.node' -type f" || echo "Файл не найден!"

# Проверить структуру node_modules
echo ""
echo -e "${YELLOW}10. Структура node_modules/.pnpm/better-sqlite3*...${NC}"
docker compose exec -T app sh -c "ls -la /app/node_modules/.pnpm/ | grep better-sqlite3" || echo "Директория не найдена!"

# Проверить build директорию
echo ""
echo -e "${YELLOW}11. Содержимое build директории...${NC}"
docker compose exec -T app sh -c "ls -la /app/node_modules/.pnpm/better-sqlite3*/node_modules/better-sqlite3/build/ 2>/dev/null" || echo "Build директория не найдена!"

# Проверить симлинк
echo ""
echo -e "${YELLOW}12. Проверка симлинка better-sqlite3...${NC}"
docker compose exec -T app sh -c "ls -la /app/node_modules/better-sqlite3" || echo "Симлинк не найден!"

echo ""
echo "==================================="
echo -e "${GREEN}✓ Отладка завершена${NC}"
echo "==================================="
echo ""
echo "Логи сборки сохранены в: build.log"
echo ""
echo "Для просмотра логов в реальном времени:"
echo "  docker compose logs -f app"
echo ""
echo "Для проверки работы приложения:"
echo "  curl http://localhost"
echo ""

