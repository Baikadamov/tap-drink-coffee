# 🚀 Деплой на VPS - Начало работы

## 📦 Что уже готово

✅ Все файлы для деплоя созданы и настроены!

Проект готов к деплою на VPS сервер с использованием Docker Compose и Nginx.

## 🎯 Три простых шага

### 1️⃣ На VPS сервере установите Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

Перелогиньтесь после установки.

### 2️⃣ Клонируйте проект и настройте

```bash
git clone <URL_вашего_репозитория> top-drink-coffee
cd top-drink-coffee
cp .env.example .env
nano .env  # Измените JWT_SECRET на случайную строку
```

Для генерации секретного ключа:
```bash
openssl rand -base64 32
```

### 3️⃣ Запустите деплой

```bash
chmod +x deploy.sh
./deploy.sh
```

**Готово!** Приложение доступно по `http://ваш-ip-адрес`

## 🔒 Настройка HTTPS (опционально)

После настройки DNS (A-запись домена → IP сервера):

```bash
chmod +x setup-ssl.sh
./setup-ssl.sh your-domain.com
```

## 📚 Документация

| Файл | Описание |
|------|----------|
| **README-DEPLOY.md** | 📖 Быстрый старт (начните отсюда!) |
| **DEPLOYMENT.md** | 📘 Подробная инструкция по деплою |
| **CHECKLIST.md** | ✅ Чеклист для проверки всех шагов |
| **COMMANDS.md** | 💻 Шпаргалка полезных команд |
| **PROJECT-STRUCTURE.md** | 📁 Структура проекта |
| **FILES-SUMMARY.md** | 📋 Список всех файлов |

## 🔑 Доступ к админ-панели

После запуска:
- **URL**: `http://ваш-ip/admin`
- **Логин**: `admin`
- **Пароль**: `admin123`

⚠️ **Смените пароль после первого входа!**

## 💡 Полезные команды

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

## 🆘 Нужна помощь?

1. Смотрите **README-DEPLOY.md** для быстрого старта
2. Смотрите **DEPLOYMENT.md** для подробной инструкции
3. Используйте **COMMANDS.md** для справки по командам
4. Проверьте **CHECKLIST.md** для пошаговой проверки

## 📋 Созданные файлы для деплоя

```
✅ Dockerfile                    - Docker образ Next.js
✅ docker-compose.yml           - Конфигурация сервисов
✅ docker-compose.prod.yml      - Production конфигурация
✅ nginx/nginx.conf             - Конфигурация Nginx
✅ nginx/conf.d/default.conf    - Виртуальный хост
✅ .env.example                 - Пример переменных окружения
✅ deploy.sh                    - Скрипт быстрого деплоя
✅ setup-ssl.sh                 - Скрипт настройки SSL
✅ Документация (6 файлов)      - Инструкции и справка
```

## 🎉 Начните с README-DEPLOY.md

Откройте **README-DEPLOY.md** для пошаговой инструкции!

---

**Удачного деплоя! 🚀**

