# 🚀 Деплой без SSL и домена

Быстрая инструкция для деплоя приложения на сервер без SSL сертификата и доменного имени.

## 📋 Требования

- Ubuntu 20.04+ / Debian 11+
- Docker 20.10+
- Docker Compose 2.0+
- Минимум 1 GB RAM (рекомендуется 2 GB)
- Открытый порт 80

## 🔧 Установка Docker (если не установлен)

```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Добавляем текущего пользователя в группу docker
sudo usermod -aG docker $USER

# Устанавливаем Docker Compose
sudo apt install docker-compose-plugin -y

# Перезагружаем сессию или выходим и заходим снова
newgrp docker
```

## 📦 Деплой приложения

### 1. Клонируем репозиторий

```bash
cd ~
git clone <your-repository-url> tap-drink-coffee
cd tap-drink-coffee
```

### 2. Создаем файл .env

```bash
# Копируем пример
cp .env.example .env

# Генерируем случайный JWT_SECRET
JWT_SECRET=$(openssl rand -base64 32)

# Записываем в .env
cat > .env << EOF
JWT_SECRET=$JWT_SECRET
NODE_ENV=production
EOF

echo "✅ Файл .env создан"
```

### 3. Создаем необходимые директории

```bash
mkdir -p data nginx/logs nginx/ssl
chmod 755 data nginx/logs
```

### 4. Собираем и запускаем приложение

```bash
# Собираем образ
docker compose build --no-cache

# Запускаем контейнеры
docker compose up -d

# Проверяем статус
docker compose ps
```

### 5. Проверяем работу

```bash
# Проверяем логи приложения
docker compose logs app

# Проверяем логи nginx
docker compose logs nginx

# Проверяем доступность
curl http://localhost
```

## 🌐 Доступ к приложению

После успешного запуска приложение будет доступно по:

- **Публичный IP:** `http://YOUR_SERVER_IP`
- **Локально:** `http://localhost`

Замените `YOUR_SERVER_IP` на реальный IP-адрес вашего сервера.

## 🔐 Доступ к админ-панели

- **URL:** `http://YOUR_SERVER_IP/admin`
- **Логин:** `admin`
- **Пароль:** `admin123`

⚠️ **ВАЖНО:** Сразу после первого входа смените пароль администратора!

## 🔥 Настройка Firewall (опционально)

```bash
# Устанавливаем UFW
sudo apt install ufw -y

# Разрешаем SSH
sudo ufw allow 22/tcp

# Разрешаем HTTP
sudo ufw allow 80/tcp

# Включаем firewall
sudo ufw enable

# Проверяем статус
sudo ufw status
```

## 📊 Полезные команды

### Просмотр логов

```bash
# Все логи
docker compose logs -f

# Только приложение
docker compose logs -f app

# Только nginx
docker compose logs -f nginx

# Последние 100 строк
docker compose logs --tail=100
```

### Перезапуск

```bash
# Перезапустить все контейнеры
docker compose restart

# Перезапустить только приложение
docker compose restart app

# Перезапустить только nginx
docker compose restart nginx
```

### Остановка и удаление

```bash
# Остановить контейнеры
docker compose stop

# Остановить и удалить контейнеры
docker compose down

# Удалить контейнеры и образы
docker compose down --rmi all

# Удалить всё включая volumes (⚠️ удалит базу данных!)
docker compose down -v --rmi all
```

### Обновление приложения

```bash
# Получаем последние изменения
git pull

# Пересобираем и перезапускаем
docker compose down
docker compose build --no-cache
docker compose up -d

# Проверяем логи
docker compose logs -f
```

### Резервное копирование базы данных

```bash
# Создаем резервную копию
cp data/applications.db data/applications.db.backup-$(date +%Y%m%d-%H%M%S)

# Или копируем на локальную машину
scp user@server:/path/to/tap-drink-coffee/data/applications.db ./backup/
```

## 🐛 Решение проблем

### Приложение не запускается

```bash
# Проверяем логи
docker compose logs app

# Проверяем, что порт 3000 не занят
docker compose exec app netstat -tulpn | grep 3000

# Пересобираем с нуля
docker compose down
docker system prune -a
docker compose build --no-cache
docker compose up -d
```

### Nginx не работает

```bash
# Проверяем конфигурацию
docker compose exec nginx nginx -t

# Проверяем логи
docker compose logs nginx
cat nginx/logs/error.log

# Перезапускаем nginx
docker compose restart nginx
```

### База данных не создается

```bash
# Проверяем права доступа
ls -la data/

# Создаем директорию заново
sudo rm -rf data
mkdir -p data
chmod 755 data

# Перезапускаем приложение
docker compose restart app
```

### Ошибка "better-sqlite3" при сборке

Это исправлено в текущей версии Dockerfile. Если ошибка всё ещё возникает:

```bash
# Убедитесь, что используете последнюю версию файлов
git pull

# Очистите Docker кеш
docker system prune -a

# Пересоберите с нуля
docker compose build --no-cache
```

## 📈 Мониторинг

### Использование ресурсов

```bash
# Статистика контейнеров
docker stats

# Использование диска
df -h
du -sh data/
```

### Проверка работоспособности

```bash
# Health check
curl http://localhost/health

# Проверка главной страницы
curl -I http://localhost
```

## 🔄 Автоматический перезапуск

Контейнеры настроены на автоматический перезапуск (`restart: unless-stopped`), поэтому они будут автоматически запускаться после перезагрузки сервера.

## 📝 Следующие шаги

После успешного деплоя рекомендуется:

1. ✅ Сменить пароль администратора
2. ✅ Настроить регулярное резервное копирование
3. ✅ Настроить мониторинг (опционально)
4. ✅ Получить доменное имя и настроить SSL (см. `DEPLOYMENT.md`)

## 🆘 Поддержка

Если возникли проблемы:

1. Проверьте логи: `docker compose logs -f`
2. Проверьте статус: `docker compose ps`
3. Проверьте конфигурацию: `docker compose config`
4. Обратитесь к полной документации: `DEPLOYMENT.md`

