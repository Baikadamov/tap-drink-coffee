# ☕ TapDrink - Кофе на вынос без очередей

TapDrink - это веб-приложение для предзаказа кофе, позволяющее клиентам заказывать напитки заранее и забирать их без ожидания в очереди.

## 🚀 Быстрый старт

### Деплой на сервер (без SSL)

```bash
# 1. Клонируем репозиторий
git clone <your-repository-url> tap-drink-coffee
cd tap-drink-coffee

# 2. Запускаем автоматический деплой
chmod +x deploy-simple.sh
./deploy-simple.sh
```

**Готово!** Приложение будет доступно по адресу `http://YOUR_SERVER_IP`

📖 **Подробная инструкция:** [QUICK-START.md](QUICK-START.md)

### Локальная разработка

```bash
# Установка зависимостей
pnpm install

# Запуск в режиме разработки
pnpm dev

# Открыть http://localhost:3000
```

## 📋 Требования

- **Node.js** 20+
- **Docker** 20.10+ (для деплоя)
- **Docker Compose** 2.0+ (для деплоя)
- **pnpm** (для разработки)

## 🏗️ Технологии

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS, Radix UI
- **Backend:** Next.js API Routes
- **Database:** SQLite (better-sqlite3)
- **Auth:** JWT (jose), bcryptjs
- **Deployment:** Docker, Nginx

## 📚 Документация

### Деплой
- 📖 [QUICK-START.md](QUICK-START.md) - Быстрый старт за 5 минут
- 📖 [DEPLOY-NO-SSL.md](DEPLOY-NO-SSL.md) - Деплой без SSL и домена
- 📖 [DEPLOYMENT.md](DEPLOYMENT.md) - Полная инструкция с SSL
- 📖 [COMMANDS.md](COMMANDS.md) - Шпаргалка команд

### Структура проекта
- 📖 [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md) - Структура файлов
- 📖 [FILES-SUMMARY.md](FILES-SUMMARY.md) - Описание файлов
- 📖 [CHANGELOG-DEPLOY-FIX.md](CHANGELOG-DEPLOY-FIX.md) - Исправления деплоя

## 🎯 Основные функции

### Для клиентов
- 🗺️ Поиск кофеен на карте
- ☕ Предзаказ напитков
- 💳 Онлайн оплата
- ⏱️ Забор без очереди

### Для кофеен
- 📊 Админ-панель для управления заказами
- 📈 Статистика продаж
- 🔔 Уведомления о новых заказах
- 💰 Прозрачная комиссия 13%

### Для администраторов
- 👥 Управление заявками кофеен
- 📊 Статистика по всем кофейням
- 🔐 Безопасная аутентификация

## 🔐 Доступ к админ-панели

После деплоя:
- **URL:** `http://YOUR_SERVER_IP/admin`
- **Логин:** `admin`
- **Пароль:** `admin123`

⚠️ **ВАЖНО:** Сразу смените пароль после первого входа!

## 🛠️ Разработка

### Структура проекта

```
tap-drink-coffee/
├── app/                    # Next.js App Router
│   ├── admin/             # Админ-панель
│   ├── api/               # API routes
│   └── page.tsx           # Главная страница
├── components/            # React компоненты
│   ├── ui/               # UI компоненты (shadcn/ui)
│   └── admin/            # Компоненты админки
├── lib/                   # Утилиты
│   ├── db.ts             # База данных
│   ├── auth.ts           # Аутентификация
│   └── utils.ts          # Вспомогательные функции
├── public/               # Статические файлы
└── nginx/                # Конфигурация Nginx
```

### Доступные команды

```bash
# Разработка
pnpm dev          # Запуск dev сервера
pnpm build        # Сборка для production
pnpm start        # Запуск production сервера
pnpm lint         # Проверка кода

# Docker
docker compose up -d              # Запуск
docker compose down               # Остановка
docker compose logs -f            # Логи
docker compose restart            # Перезапуск
```

## 🐛 Решение проблем

### Ошибка "better-sqlite3" при сборке

Это исправлено в текущей версии. Если ошибка возникает:

```bash
docker system prune -a
docker compose build --no-cache
docker compose up -d
```

### База данных не создается

```bash
mkdir -p data
chmod 755 data
docker compose restart app
```

### Приложение не отвечает

```bash
docker compose logs app
docker compose restart
```

📖 **Подробнее:** [DEPLOY-NO-SSL.md](DEPLOY-NO-SSL.md#-решение-проблем)

## 📊 Мониторинг

```bash
# Статистика контейнеров
docker stats

# Логи в реальном времени
docker compose logs -f

# Проверка работоспособности
curl http://localhost/health
```

## 🔄 Обновление

```bash
# Получить последние изменения
git pull

# Пересобрать и перезапустить
docker compose down
docker compose build --no-cache
docker compose up -d
```

## 💾 Резервное копирование

```bash
# Создать резервную копию БД
cp data/applications.db data/applications.db.backup-$(date +%Y%m%d-%H%M%S)

# Скопировать на локальную машину
scp user@server:/path/to/tap-drink-coffee/data/applications.db ./backup/
```

## 🌐 Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```env
# JWT Secret для аутентификации
JWT_SECRET=your-secret-key-here

# Окружение
NODE_ENV=production
```

Сгенерировать случайный JWT_SECRET:
```bash
openssl rand -base64 32
```

## 📈 Производительность

- **Размер Docker образа:** ~200-300 MB
- **Использование RAM:** ~100-200 MB
- **Время сборки:** 5-10 минут
- **Время запуска:** 10-20 секунд

## 🔒 Безопасность

- ✅ JWT аутентификация
- ✅ Хеширование паролей (bcrypt)
- ✅ Защита API routes
- ✅ Валидация данных
- ✅ HTTPS ready (с SSL)

## 📝 Лицензия

© 2025 Tap Drink. Все права защищены.

## 🆘 Поддержка

- 📧 Email: hello@tapdrink.app
- 📱 WhatsApp: +7 XXX XXX XX XX
- 📍 Адрес: Алматы, Казахстан

## 🤝 Вклад в проект

Проект находится в активной разработке. Если вы нашли баг или хотите предложить улучшение, создайте issue или pull request.

---

**Сделано с ❤️ в Казахстане**

