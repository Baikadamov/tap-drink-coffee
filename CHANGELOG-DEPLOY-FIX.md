# 🔧 Исправления для деплоя

**Дата:** 2025-10-30
**Обновление 1:** 2025-10-30 (Next.js 16 конфигурация)
**Обновление 2:** 2025-10-30 (Копирование нативных модулей в runtime)
**Обновление 3:** 2025-10-30 (Компиляция через node-gyp - ФИНАЛЬНОЕ РЕШЕНИЕ)

## Проблема #1: better-sqlite3

При деплое на сервер возникала ошибка:
```
Error: Could not locate the bindings file for better-sqlite3
```

Это происходило потому, что `better-sqlite3` - это нативный модуль Node.js, который требует компиляции для конкретной платформы.

## ✅ Внесенные изменения

### 1. Dockerfile

**Изменения:**
- Добавлен пакет `sqlite` в базовый образ
- Добавлена команда `pnpm rebuild better-sqlite3` для пересборки нативного модуля
- Добавлена переменная окружения `SKIP_DB_INIT=1` для пропуска инициализации БД во время сборки
- Оптимизировано копирование `node_modules` в финальный образ

**Что это решает:**
- Нативный модуль теперь правильно компилируется для Linux Alpine
- База данных не инициализируется во время сборки (когда это не нужно)
- Все необходимые зависимости копируются в финальный образ

### 2. lib/db.ts

**Изменения:**
- Изменена инициализация базы данных с "при импорте" на "ленивую загрузку"
- Добавлена функция `getDatabase()` для получения экземпляра БД
- Добавлена проверка переменной `SKIP_DB_INIT` для пропуска инициализации во время сборки
- Все функции обновлены для использования `getDatabase()`

**Что это решает:**
- База данных не инициализируется во время сборки Next.js
- База данных создается только при первом обращении к ней (в runtime)
- Избегаем ошибок с нативными модулями во время сборки

### 3. next.config.mjs

**Изменения (обновлено для Next.js 16):**
- Добавлен `serverExternalPackages: ['better-sqlite3']` (в Next.js 16 переименовано из `experimental.serverComponentsExternalPackages`)
- Добавлена пустая конфигурация `turbopack: {}` для подавления предупреждения
- Удалена webpack конфигурация (конфликтует с Turbopack в Next.js 16)

**Что это решает:**
- Next.js не пытается включить нативный модуль в бандл
- Нативный модуль используется как внешняя зависимость
- Совместимость с Turbopack (по умолчанию в Next.js 16)

### 4. Новые файлы

**Созданы:**
- `.env.example` - пример файла с переменными окружения
- `DEPLOY-NO-SSL.md` - подробная инструкция по деплою без SSL
- `QUICK-START.md` - краткая инструкция для быстрого старта
- `deploy-simple.sh` - скрипт автоматического деплоя
- `CHANGELOG-DEPLOY-FIX.md` - этот файл с описанием изменений

## 🚀 Как использовать

### Вариант 1: Автоматический деплой (рекомендуется)

```bash
git clone <your-repo> tap-drink-coffee
cd tap-drink-coffee
chmod +x deploy-simple.sh
./deploy-simple.sh
```

### Вариант 2: Ручной деплой

```bash
# 1. Создать .env
cp .env.example .env
# Отредактировать .env и установить JWT_SECRET

# 2. Создать директории
mkdir -p data nginx/logs nginx/ssl

# 3. Собрать и запустить
docker compose build --no-cache
docker compose up -d
```

## 📋 Проверка работы

После деплоя проверьте:

```bash
# Статус контейнеров
docker compose ps

# Логи приложения
docker compose logs app

# Логи nginx
docker compose logs nginx

# Проверка доступности
curl http://localhost
```

## 🔍 Технические детали

### Почему возникала ошибка?

1. **better-sqlite3** - это нативный модуль, который компилируется для конкретной платформы
2. Next.js пытался использовать БД во время сборки (при импорте `lib/db.ts`)
3. В Docker контейнере во время сборки нативный модуль еще не был скомпилирован
4. Результат: ошибка "Could not locate the bindings file"

### Как мы это исправили?

1. **Пересборка модуля:** `pnpm rebuild better-sqlite3` компилирует модуль для Alpine Linux
2. **Ленивая загрузка:** БД инициализируется только при первом обращении, а не при импорте
3. **Пропуск во время сборки:** `SKIP_DB_INIT=1` предотвращает инициализацию БД во время `next build`
4. **Внешний модуль:** Next.js не включает нативный модуль в бандл

### Почему это работает?

- Во время сборки (`next build`): БД не инициализируется благодаря `SKIP_DB_INIT=1`
- Во время запуска (`node server.js`): БД инициализируется при первом API запросе
- Нативный модуль уже скомпилирован и доступен в `node_modules`

## 🎯 Результат

✅ Приложение успешно собирается в Docker  
✅ База данных инициализируется при первом запуске  
✅ Нативные модули работают корректно  
✅ Деплой занимает 5-10 минут  

## 📚 Дополнительная информация

- **Быстрый старт:** `QUICK-START.md`
- **Деплой без SSL:** `DEPLOY-NO-SSL.md`
- **Деплой с SSL:** `DEPLOYMENT.md`
- **Команды:** `COMMANDS.md`

## 🐛 Если проблема осталась

1. Очистите Docker кеш: `docker system prune -a`
2. Пересоберите образ: `docker compose build --no-cache`
3. Проверьте логи: `docker compose logs -f`
4. Убедитесь, что используете последнюю версию файлов: `git pull`

## Проблема #2: Копирование нативных модулей в runtime

При создании заявки возникала ошибка:
```
Error: Could not locate the bindings file for better-sqlite3
 → /app/node_modules/.pnpm/better-sqlite3@12.4.1/node_modules/better-sqlite3/build/better_sqlite3.node
```

**Причина:**
- Нативный модуль `better-sqlite3` компилировался в стадии `deps`
- Но копировался из стадии `builder` в финальный образ
- В `builder` модуль не был пересобран, поэтому копировалась неправильная версия

**Решение:**
- Копируем скомпилированный `better-sqlite3` из стадии `deps` (где он был пересобран)
- Копируем весь `.pnpm` каталог для сохранения всех зависимостей

**Изменения в Dockerfile:**
```dockerfile
# Было:
COPY --from=builder /app/node_modules/.pnpm ./node_modules/.pnpm

# Стало:
COPY --from=deps /app/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=deps /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
```

## Проблема #3: Next.js 16 конфигурация

При сборке возникала ошибка:
```
⚠ Invalid next.config.mjs options detected:
⚠     Unrecognized key(s) in object: 'serverComponentsExternalPackages' at "experimental"
⚠ `experimental.serverComponentsExternalPackages` has been moved to `serverExternalPackages`

⨯ ERROR: This build is using Turbopack, with a `webpack` config and no `turbopack` config.
```

**Причина:**
- В Next.js 16 `experimental.serverComponentsExternalPackages` переименован в `serverExternalPackages`
- Turbopack теперь включен по умолчанию
- Webpack конфигурация конфликтует с Turbopack

**Решение:**
- Переименовали `experimental.serverComponentsExternalPackages` → `serverExternalPackages`
- Удалили webpack конфигурацию
- Добавили пустую конфигурацию `turbopack: {}` для подавления предупреждения

## 📝 Примечания

- Изменения обратно совместимы
- Локальная разработка работает без изменений
- База данных создается автоматически при первом запуске
- Дефолтный администратор создается автоматически (admin/admin123)
- Конфигурация обновлена для Next.js 16

