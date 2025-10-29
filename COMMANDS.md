# 📝 Шпаргалка команд

## 🚀 Деплой и запуск

```bash
# Быстрый деплой (первый запуск)
chmod +x deploy.sh
./deploy.sh

# Запуск контейнеров
docker compose up -d

# Запуск с пересборкой
docker compose up -d --build

# Использование production конфигурации
docker compose -f docker-compose.prod.yml up -d
```

## 🔒 Настройка SSL

```bash
# Автоматическая настройка SSL
chmod +x setup-ssl.sh
./setup-ssl.sh your-domain.com

# Ручная настройка SSL
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./nginx/ssl/
docker compose restart nginx

# Обновление сертификата
sudo certbot renew
docker compose restart nginx
```

## 📊 Мониторинг и логи

```bash
# Просмотр статуса контейнеров
docker compose ps

# Просмотр всех логов
docker compose logs -f

# Логи конкретного сервиса
docker compose logs -f app
docker compose logs -f nginx

# Последние 100 строк логов
docker compose logs --tail=100 app

# Логи Nginx напрямую
tail -f nginx/logs/access.log
tail -f nginx/logs/error.log
```

## 🔄 Управление контейнерами

```bash
# Перезапуск всех сервисов
docker compose restart

# Перезапуск конкретного сервиса
docker compose restart app
docker compose restart nginx

# Остановка
docker compose stop

# Остановка и удаление контейнеров
docker compose down

# Остановка с удалением volumes
docker compose down -v
```

## 🔧 Обновление приложения

```bash
# Получить последние изменения
git pull

# Пересобрать и перезапустить
docker compose up -d --build

# Полное обновление (с очисткой)
docker compose down
git pull
docker compose up -d --build
```

## 🗄️ Работа с базой данных

```bash
# Создать backup
cp data/applications.db data/applications.db.backup-$(date +%Y%m%d-%H%M%S)

# Восстановить из backup
cp data/applications.db.backup-YYYYMMDD-HHMMSS data/applications.db
docker compose restart app

# Просмотр базы данных
docker compose exec app sh
cd data
sqlite3 applications.db
# В sqlite3:
# .tables
# SELECT * FROM applications;
# .quit
```

## 🧹 Очистка Docker

```bash
# Удалить неиспользуемые образы
docker image prune -a

# Удалить неиспользуемые volumes
docker volume prune

# Удалить неиспользуемые сети
docker network prune

# Полная очистка системы
docker system prune -a --volumes

# Посмотреть использование диска
docker system df
```

## 🔍 Диагностика

```bash
# Проверить конфигурацию Nginx
docker compose exec nginx nginx -t

# Перезагрузить конфигурацию Nginx без перезапуска
docker compose exec nginx nginx -s reload

# Зайти внутрь контейнера
docker compose exec app sh
docker compose exec nginx sh

# Проверить сеть между контейнерами
docker compose exec nginx ping app

# Проверить порты
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
sudo netstat -tulpn | grep :3000

# Health check
curl http://localhost/health
curl https://your-domain.com/health
```

## 🔐 Безопасность

```bash
# Сгенерировать новый JWT_SECRET
openssl rand -base64 32

# Изменить права на файлы
chmod 600 .env
chmod 600 nginx/ssl/*.pem
chmod 755 data

# Просмотр открытых портов
sudo ufw status
sudo netstat -tulpn
```

## 📦 Резервное копирование

```bash
# Создать полный backup проекта
tar -czf backup-$(date +%Y%m%d).tar.gz \
  data/ \
  nginx/ssl/ \
  .env

# Восстановить из backup
tar -xzf backup-YYYYMMDD.tar.gz

# Автоматический backup (добавить в crontab)
crontab -e
# Добавить строку:
# 0 2 * * * cd /path/to/project && tar -czf backup-$(date +\%Y\%m\%d).tar.gz data/ nginx/ssl/ .env
```

## 🌐 Firewall (UFW)

```bash
# Установить UFW
sudo apt install ufw

# Разрешить SSH (ВАЖНО!)
sudo ufw allow 22/tcp

# Разрешить HTTP и HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Включить firewall
sudo ufw enable

# Проверить статус
sudo ufw status verbose

# Удалить правило
sudo ufw delete allow 80/tcp
```

## 📈 Мониторинг ресурсов

```bash
# Использование ресурсов контейнерами
docker stats

# Использование диска
df -h
du -sh data/
du -sh nginx/logs/

# Использование памяти
free -h

# Процессы
top
htop
```

## 🔄 Автоматизация

```bash
# Настроить автоматический перезапуск при сбое
# (уже настроено в docker-compose.yml через restart: unless-stopped)

# Автоматическое обновление приложения (crontab)
crontab -e
# Добавить:
# 0 3 * * 0 cd /path/to/project && git pull && docker compose up -d --build

# Автоматическая очистка логов (crontab)
# 0 0 * * * find /path/to/project/nginx/logs -name "*.log" -mtime +30 -delete
```

## 🆘 Решение проблем

```bash
# Контейнер не запускается
docker compose logs app
docker compose up app  # Запуск в foreground для отладки

# Nginx не может подключиться к app
docker network inspect top-drink-coffee_top-drink-network
docker compose exec nginx ping app

# Порт уже занят
sudo lsof -i :80
sudo lsof -i :443
# Остановить процесс:
sudo kill -9 <PID>

# Проблемы с правами доступа
sudo chown -R $USER:$USER data/
sudo chown -R $USER:$USER nginx/

# Пересоздать контейнеры с нуля
docker compose down -v
docker compose up -d --build --force-recreate
```

## 📱 Быстрые команды

```bash
# Алиасы для удобства (добавить в ~/.bashrc)
alias dc='docker compose'
alias dcl='docker compose logs -f'
alias dcp='docker compose ps'
alias dcr='docker compose restart'
alias dcu='docker compose up -d'
alias dcd='docker compose down'

# После добавления:
source ~/.bashrc
```

