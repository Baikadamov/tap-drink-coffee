# 📁 Структура проекта для деплоя

## 🎯 Обязательные файлы для деплоя

### Основные файлы конфигурации

```
top-drink-coffee/
│
├── 🐳 Docker конфигурация
│   ├── Dockerfile                      # Docker образ для Next.js приложения
│   ├── docker-compose.yml             # Основная конфигурация Docker Compose
│   ├── docker-compose.prod.yml        # Production конфигурация с healthchecks
│   └── .dockerignore                  # Исключения для Docker build
│
├── 🌐 Nginx конфигурация
│   ├── nginx/
│   │   ├── nginx.conf                 # Основная конфигурация Nginx
│   │   ├── conf.d/
│   │   │   └── default.conf           # Виртуальный хост и proxy настройки
│   │   ├── ssl/                       # SSL сертификаты (создается при деплое)
│   │   │   └── .gitkeep
│   │   └── logs/                      # Логи Nginx (создается при деплое)
│   │       └── .gitkeep
│
├── ⚙️ Переменные окружения
│   ├── .env.example                   # Пример переменных окружения
│   └── .env                           # Реальные переменные (создать на сервере!)
│
├── 📜 Скрипты деплоя
│   ├── deploy.sh                      # Скрипт быстрого деплоя
│   └── setup-ssl.sh                   # Скрипт настройки SSL
│
├── 📖 Документация
│   ├── README-DEPLOY.md               # Быстрый старт
│   ├── DEPLOYMENT.md                  # Подробная инструкция
│   ├── COMMANDS.md                    # Шпаргалка команд
│   ├── CHECKLIST.md                   # Чеклист деплоя
│   └── PROJECT-STRUCTURE.md           # Этот файл
│
└── 💾 Данные (создается автоматически)
    └── data/                          # База данных SQLite
        └── applications.db
```

## 📦 Исходный код приложения

```
top-drink-coffee/
│
├── 📱 Next.js приложение
│   ├── app/                           # App Router Next.js
│   │   ├── layout.tsx                 # Основной layout
│   │   ├── page.tsx                   # Главная страница
│   │   ├── globals.css                # Глобальные стили
│   │   ├── admin/                     # Админ-панель
│   │   └── api/                       # API routes
│   │       ├── applications/          # API для заявок
│   │       └── auth/                  # API для аутентификации
│   │
│   ├── components/                    # React компоненты
│   │   ├── ui/                        # UI компоненты (shadcn/ui)
│   │   ├── admin/                     # Компоненты админ-панели
│   │   ├── application-form.tsx       # Форма заявки
│   │   ├── countdown-timer.tsx        # Таймер обратного отсчета
│   │   └── navigation-menu.tsx        # Навигационное меню
│   │
│   ├── lib/                           # Утилиты и библиотеки
│   │   ├── db.ts                      # Работа с базой данных
│   │   ├── auth.ts                    # Аутентификация JWT
│   │   └── utils.ts                   # Вспомогательные функции
│   │
│   ├── hooks/                         # React hooks
│   │   ├── use-mobile.ts              # Определение мобильного устройства
│   │   └── use-toast.ts               # Toast уведомления
│   │
│   ├── public/                        # Статические файлы
│   │   ├── *.jpg                      # Изображения
│   │   └── *.svg                      # SVG иконки
│   │
│   └── styles/                        # Стили
│       └── globals.css                # Дополнительные стили
│
├── ⚙️ Конфигурация
│   ├── next.config.mjs                # Конфигурация Next.js
│   ├── tsconfig.json                  # Конфигурация TypeScript
│   ├── postcss.config.mjs             # Конфигурация PostCSS
│   ├── components.json                # Конфигурация shadcn/ui
│   ├── package.json                   # Зависимости Node.js
│   └── pnpm-lock.yaml                 # Lock файл pnpm
│
└── 🔒 Безопасность
    └── .gitignore                     # Исключения для Git
```

## 🔑 Ключевые файлы

### 1. Dockerfile
**Назначение:** Создание Docker образа для Next.js приложения

**Особенности:**
- Multi-stage build для оптимизации размера
- Использует pnpm для управления зависимостями
- Standalone режим Next.js для минимального размера
- Создает непривилегированного пользователя для безопасности

### 2. docker-compose.yml
**Назначение:** Оркестрация контейнеров

**Сервисы:**
- `app` - Next.js приложение (порт 3000)
- `nginx` - Reverse proxy (порты 80, 443)

**Volumes:**
- `./data:/app/data` - База данных SQLite
- `./nginx/conf.d:/etc/nginx/conf.d` - Конфигурация Nginx
- `./nginx/ssl:/etc/nginx/ssl` - SSL сертификаты
- `./nginx/logs:/var/log/nginx` - Логи Nginx

### 3. nginx/conf.d/default.conf
**Назначение:** Конфигурация reverse proxy

**Функции:**
- Проксирование запросов на Next.js
- Настройка SSL/TLS
- Редирект HTTP → HTTPS
- Кеширование статических файлов
- Gzip сжатие

### 4. .env
**Назначение:** Переменные окружения

**Переменные:**
- `JWT_SECRET` - Секретный ключ для JWT токенов
- `NODE_ENV` - Окружение (production)

### 5. lib/db.ts
**Назначение:** Работа с базой данных SQLite

**Функции:**
- Инициализация базы данных
- CRUD операции для заявок
- Управление администраторами
- Хеширование паролей

### 6. lib/auth.ts
**Назначение:** Аутентификация и авторизация

**Функции:**
- Создание JWT токенов
- Проверка токенов
- Управление сессиями
- Middleware для защищенных роутов

## 📊 Размеры и требования

### Минимальные требования сервера

- **CPU:** 1 core
- **RAM:** 1 GB (рекомендуется 2 GB)
- **Диск:** 10 GB свободного места
- **ОС:** Ubuntu 20.04+ / Debian 11+
- **Docker:** 20.10+
- **Docker Compose:** 2.0+

### Размеры файлов

- **Docker образ:** ~200-300 MB
- **База данных:** ~100 KB (растет с данными)
- **Логи:** ~1-10 MB/день (зависит от трафика)
- **Исходный код:** ~50 MB

## 🔄 Процесс сборки

### 1. Build процесс (Dockerfile)

```
1. deps stage:
   - Копирование package.json и pnpm-lock.yaml
   - Установка зависимостей

2. builder stage:
   - Копирование исходного кода
   - Сборка Next.js приложения (pnpm build)
   - Создание standalone версии

3. runner stage:
   - Копирование только необходимых файлов
   - Настройка прав доступа
   - Запуск приложения
```

### 2. Runtime процесс (docker-compose)

```
1. Запуск app контейнера:
   - Инициализация базы данных
   - Создание дефолтного администратора
   - Запуск Next.js сервера на порту 3000

2. Запуск nginx контейнера:
   - Загрузка конфигурации
   - Проксирование на app:3000
   - Обслуживание HTTP/HTTPS запросов
```

## 🗂️ Файлы, которые НЕ нужно коммитить

Эти файлы создаются автоматически или содержат секретные данные:

```
❌ НЕ коммитить:
├── .env                               # Секретные переменные
├── data/                              # База данных
│   └── *.db
├── nginx/logs/                        # Логи
│   └── *.log
├── nginx/ssl/                         # SSL сертификаты
│   ├── *.pem
│   ├── *.key
│   └── *.crt
├── node_modules/                      # Зависимости
└── .next/                             # Build артефакты
```

## ✅ Файлы, которые НУЖНО коммитить

```
✅ Коммитить:
├── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
├── .dockerignore
├── .gitignore
├── .env.example                       # Пример, без реальных данных
├── nginx/
│   ├── nginx.conf
│   ├── conf.d/default.conf
│   ├── ssl/.gitkeep
│   └── logs/.gitkeep
├── deploy.sh
├── setup-ssl.sh
├── app/                               # Весь исходный код
├── components/
├── lib/
├── hooks/
├── public/
├── styles/
├── package.json
├── pnpm-lock.yaml
├── next.config.mjs
├── tsconfig.json
└── *.md                               # Документация
```

## 🔐 Безопасность файлов

### Права доступа

```bash
# Переменные окружения
chmod 600 .env

# SSL сертификаты
chmod 600 nginx/ssl/privkey.pem
chmod 644 nginx/ssl/fullchain.pem

# База данных
chmod 755 data/
chmod 644 data/applications.db

# Скрипты
chmod +x deploy.sh
chmod +x setup-ssl.sh
```

## 📝 Резюме

**Для успешного деплоя необходимо:**

1. ✅ Все файлы из репозитория
2. ✅ Создать `.env` из `.env.example`
3. ✅ Создать директории `data/`, `nginx/logs/`, `nginx/ssl/`
4. ✅ Установить Docker и Docker Compose
5. ✅ Запустить `./deploy.sh`

**Опционально для production:**

6. 🔒 Настроить SSL с помощью `./setup-ssl.sh`
7. 🔥 Настроить firewall
8. 💾 Настроить резервное копирование
9. 📊 Настроить мониторинг

---

Подробные инструкции смотрите в:
- **Быстрый старт:** `README-DEPLOY.md`
- **Полная инструкция:** `DEPLOYMENT.md`
- **Чеклист:** `CHECKLIST.md`
- **Команды:** `COMMANDS.md`

