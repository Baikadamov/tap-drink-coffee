# ⚡ Быстрый старт - Деплой за 5 минут

Самый простой способ развернуть TapDrink на сервере без SSL и домена.

## 🎯 Один скрипт для всего

```bash
# 1. Клонируем репозиторий
git clone <your-repository-url> tap-drink-coffee
cd tap-drink-coffee

# 2. Запускаем скрипт деплоя
chmod +x deploy-simple.sh
./deploy-simple.sh
```

Готово! 🎉

## 📋 Что делает скрипт?

1. ✅ Проверяет наличие Docker и Docker Compose
2. ✅ Создает файл `.env` с случайным JWT_SECRET
3. ✅ Создает необходимые директории
4. ✅ Собирает Docker образ
5. ✅ Запускает контейнеры
6. ✅ Показывает статус и адрес приложения

## 🌐 После деплоя

Приложение будет доступно по адресу:
- **Сайт:** `http://YOUR_SERVER_IP`
- **Админка:** `http://YOUR_SERVER_IP/admin`

**Логин:** `admin`  
**Пароль:** `admin123`

⚠️ **Сразу смените пароль!**

## 🔧 Если Docker не установлен

```bash
# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo apt install docker-compose-plugin -y

# Перезагрузка сессии
newgrp docker
```

## 📊 Полезные команды

```bash
# Просмотр логов
docker compose logs -f

# Перезапуск
docker compose restart

# Остановка
docker compose down

# Статус
docker compose ps
```

## 📖 Подробная документация

- **Без SSL:** `DEPLOY-NO-SSL.md`
- **С SSL и доменом:** `DEPLOYMENT.md`
- **Все команды:** `COMMANDS.md`

## 🆘 Проблемы?

### Ошибка при сборке

```bash
# Очистите Docker кеш
docker system prune -a

# Пересоберите
docker compose build --no-cache
docker compose up -d
```

### Приложение не отвечает

```bash
# Проверьте логи
docker compose logs app

# Перезапустите
docker compose restart
```

### База данных не создается

```bash
# Проверьте права
ls -la data/

# Пересоздайте директорию
rm -rf data
mkdir -p data
chmod 755 data
docker compose restart app
```

## 🎯 Следующие шаги

1. ✅ Смените пароль администратора
2. ✅ Настройте резервное копирование
3. ✅ Получите домен и настройте SSL (опционально)

---

**Нужна помощь?** Смотрите `DEPLOY-NO-SSL.md` для подробных инструкций.

