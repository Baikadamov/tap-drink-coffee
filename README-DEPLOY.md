# 🚀 Быстрый старт деплоя

## Минимальная инструкция для запуска на VPS

### 1️⃣ Подготовка сервера

```bash
# Установите Docker и Docker Compose (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Перелогиньтесь для применения изменений
exit
```

### 2️⃣ Клонирование и настройка

```bash
# Клонируйте репозиторий
git clone <URL_репозитория> top-drink-coffee
cd top-drink-coffee

# Создайте .env файл
cp .env.example .env

# Сгенерируйте секретный ключ
openssl rand -base64 32

# Отредактируйте .env и вставьте сгенерированный ключ
nano .env
```

### 3️⃣ Запуск

```bash
# Сделайте скрипт исполняемым
chmod +x deploy.sh

# Запустите деплой
./deploy.sh
```

**Готово!** Приложение доступно по `http://ваш-ip-адрес`

### 4️⃣ Настройка домена и HTTPS (опционально)

1. Направьте A-запись вашего домена на IP сервера
2. Следуйте инструкциям в [DEPLOYMENT.md](DEPLOYMENT.md) (Шаг 3)

---

## 📋 Структура файлов для деплоя

```
top-drink-coffee/
├── Dockerfile                    # ✅ Docker образ Next.js
├── docker-compose.yml           # ✅ Конфигурация сервисов
├── .env                         # ✅ Переменные окружения (создать!)
├── .env.example                 # ✅ Пример переменных
├── deploy.sh                    # ✅ Скрипт быстрого деплоя
├── nginx/
│   ├── nginx.conf              # ✅ Основная конфигурация Nginx
│   ├── conf.d/
│   │   └── default.conf        # ✅ Конфигурация виртуального хоста
│   ├── ssl/                    # 📁 SSL сертификаты (добавите позже)
│   └── logs/                   # 📁 Логи Nginx
├── data/                        # 📁 База данных (создастся автоматически)
└── DEPLOYMENT.md               # 📖 Подробная инструкция
```

---

## 🔑 Доступ к админ-панели

- **URL**: `http://ваш-ip-адрес/admin`
- **Логин**: `admin`
- **Пароль**: `admin123`

⚠️ **ВАЖНО**: Смените пароль после первого входа!

---

## 📝 Полезные команды

```bash
# Просмотр логов
docker compose logs -f

# Перезапуск
docker compose restart

# Остановка
docker compose down

# Обновление приложения
git pull && docker compose up -d --build
```

---

## 🆘 Нужна помощь?

Смотрите подробную инструкцию в [DEPLOYMENT.md](DEPLOYMENT.md)

