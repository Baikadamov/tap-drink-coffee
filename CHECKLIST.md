# ✅ Чеклист деплоя на VPS

## 📋 Перед деплоем

### На локальной машине

- [ ] Все изменения закоммичены в git
- [ ] Проект собирается без ошибок (`npm run build`)
- [ ] Все тесты проходят (если есть)
- [ ] Обновлен `.env.example` с актуальными переменными
- [ ] Код запушен в репозиторий

### На VPS сервере

- [ ] Установлен Docker (версия 20.10+)
- [ ] Установлен Docker Compose (версия 2.0+)
- [ ] Установлен Git
- [ ] Открыты порты 22, 80, 443 в firewall
- [ ] Настроен SSH доступ
- [ ] Есть sudo права

## 🚀 Процесс деплоя

### 1. Подготовка сервера

- [ ] Подключиться к серверу по SSH
  ```bash
  ssh user@your-server-ip
  ```

- [ ] Обновить систему
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```

- [ ] Установить Docker и Docker Compose
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker $USER
  ```

- [ ] Перелогиниться для применения изменений
  ```bash
  exit
  ssh user@your-server-ip
  ```

### 2. Клонирование проекта

- [ ] Клонировать репозиторий
  ```bash
  git clone <URL_репозитория> top-drink-coffee
  cd top-drink-coffee
  ```

- [ ] Проверить наличие всех файлов
  ```bash
  ls -la
  ```

### 3. Настройка переменных окружения

- [ ] Создать `.env` файл
  ```bash
  cp .env.example .env
  ```

- [ ] Сгенерировать JWT_SECRET
  ```bash
  openssl rand -base64 32
  ```

- [ ] Отредактировать `.env` и вставить сгенерированный ключ
  ```bash
  nano .env
  ```

- [ ] Проверить содержимое `.env`
  ```bash
  cat .env
  ```

### 4. Создание директорий

- [ ] Создать необходимые директории
  ```bash
  mkdir -p data nginx/logs nginx/ssl
  chmod 755 data nginx/logs
  ```

### 5. Запуск приложения

- [ ] Сделать скрипт деплоя исполняемым
  ```bash
  chmod +x deploy.sh
  ```

- [ ] Запустить деплой
  ```bash
  ./deploy.sh
  ```

- [ ] Проверить статус контейнеров
  ```bash
  docker compose ps
  ```

- [ ] Проверить логи
  ```bash
  docker compose logs -f
  ```

### 6. Проверка работоспособности

- [ ] Проверить health check
  ```bash
  curl http://localhost/health
  ```

- [ ] Открыть в браузере `http://your-server-ip`

- [ ] Проверить главную страницу

- [ ] Проверить админ-панель `http://your-server-ip/admin`
  - Логин: `admin`
  - Пароль: `admin123`

- [ ] Проверить форму заявки

### 7. Настройка firewall

- [ ] Установить UFW (если не установлен)
  ```bash
  sudo apt install -y ufw
  ```

- [ ] Разрешить SSH (ВАЖНО!)
  ```bash
  sudo ufw allow 22/tcp
  ```

- [ ] Разрешить HTTP и HTTPS
  ```bash
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  ```

- [ ] Включить firewall
  ```bash
  sudo ufw enable
  ```

- [ ] Проверить статус
  ```bash
  sudo ufw status
  ```

## 🔒 Настройка HTTPS (опционально, но рекомендуется)

### 1. Подготовка домена

- [ ] Купить/зарегистрировать домен

- [ ] Настроить A-запись домена на IP сервера
  - Домен: `your-domain.com` → IP сервера
  - Поддомен: `www.your-domain.com` → IP сервера

- [ ] Дождаться распространения DNS (может занять до 24 часов)
  ```bash
  dig +short your-domain.com
  ```

### 2. Получение SSL сертификата

- [ ] Сделать скрипт SSL исполняемым
  ```bash
  chmod +x setup-ssl.sh
  ```

- [ ] Запустить настройку SSL
  ```bash
  ./setup-ssl.sh your-domain.com
  ```

- [ ] Проверить, что сертификаты скопированы
  ```bash
  ls -la nginx/ssl/
  ```

### 3. Проверка HTTPS

- [ ] Открыть в браузере `https://your-domain.com`

- [ ] Проверить, что сертификат валидный (замок в адресной строке)

- [ ] Проверить редирект с HTTP на HTTPS
  ```bash
  curl -I http://your-domain.com
  ```

## 🔐 Безопасность

- [ ] Изменить пароль администратора в админ-панели

- [ ] Проверить права доступа к файлам
  ```bash
  chmod 600 .env
  chmod 600 nginx/ssl/*.pem
  ```

- [ ] Настроить автоматическое обновление сертификатов (уже настроено скриптом)

- [ ] Настроить резервное копирование базы данных
  ```bash
  echo "0 2 * * * cp ~/top-drink-coffee/data/applications.db ~/top-drink-coffee/data/applications.db.backup-\$(date +\%Y\%m\%d)" | crontab -
  ```

## 📊 Мониторинг

- [ ] Настроить мониторинг логов
  ```bash
  docker compose logs -f
  ```

- [ ] Проверить использование ресурсов
  ```bash
  docker stats
  ```

- [ ] Настроить алерты (опционально)

## 🎉 Финальная проверка

- [ ] Приложение доступно по HTTP/HTTPS
- [ ] Админ-панель работает
- [ ] Форма заявки отправляется
- [ ] Заявки сохраняются в базе данных
- [ ] Логи пишутся корректно
- [ ] SSL сертификат валидный (если настроен)
- [ ] Firewall настроен
- [ ] Пароль администратора изменен
- [ ] Резервное копирование настроено

## 📝 После деплоя

- [ ] Записать учетные данные в безопасное место
  - IP сервера
  - SSH логин/пароль
  - Админ логин/пароль
  - JWT_SECRET

- [ ] Настроить мониторинг uptime (опционально)
  - UptimeRobot
  - Pingdom
  - StatusCake

- [ ] Настроить автоматическое обновление (опционально)
  ```bash
  crontab -e
  # Добавить:
  # 0 3 * * 0 cd ~/top-drink-coffee && git pull && docker compose up -d --build
  ```

- [ ] Создать документацию для команды

## 🆘 Контакты для поддержки

- Документация: `DEPLOYMENT.md`
- Команды: `COMMANDS.md`
- Быстрый старт: `README-DEPLOY.md`

---

## ✅ Деплой завершен!

Поздравляем! Ваше приложение успешно развернуто на VPS сервере.

**Адреса:**
- Приложение: `https://your-domain.com` (или `http://your-server-ip`)
- Админ-панель: `https://your-domain.com/admin`

**Полезные команды:**
```bash
# Просмотр логов
docker compose logs -f

# Перезапуск
docker compose restart

# Обновление
git pull && docker compose up -d --build
```

