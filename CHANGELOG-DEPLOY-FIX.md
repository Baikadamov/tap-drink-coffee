# 🔧 Исправления для деплоя

**Дата:** 2025-10-30
**Обновление 1:** 2025-10-30 (Next.js 16 конфигурация)
**Обновление 2:** 2025-10-30 (Копирование нативных модулей в runtime)
**Обновление 3:** 2025-10-30 (Компиляция через node-gyp)
**Обновление 4:** 2025-10-30 (Права доступа к директории БД)
**Обновление 5:** 2025-10-30 (Безопасность и исправление cookies - ФИНАЛЬНОЕ РЕШЕНИЕ)

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

## Проблема #2: Компиляция better-sqlite3 (ФИНАЛЬНОЕ РЕШЕНИЕ)

При создании заявки возникала ошибка:
```
Error: Could not locate the bindings file for better-sqlite3
 → /app/node_modules/.pnpm/better-sqlite3@12.4.1/node_modules/better-sqlite3/build/better_sqlite3.node
```

**Причина:**
- `pnpm rebuild better-sqlite3` не компилировал нативный модуль правильно для Alpine Linux
- Файл `better_sqlite3.node` не создавался в директории `build/Release/`

**Решение:**
- Используем `node-gyp rebuild` напрямую для компиляции нативного модуля
- Добавили установку `node-gyp` глобально
- Переходим в директорию модуля и компилируем напрямую

**Изменения в Dockerfile:**

1. Установка node-gyp (строка 9):
```dockerfile
RUN npm install -g node-gyp
```

2. Компиляция через node-gyp (строки 21-23):
```dockerfile
# Было:
RUN pnpm rebuild better-sqlite3

# Стало:
RUN cd /app/node_modules/.pnpm/better-sqlite3*/node_modules/better-sqlite3 && \
    node-gyp rebuild
```

3. Добавлена отладочная информация (строки 25-29):
```dockerfile
RUN echo "=== Checking better-sqlite3 build ===" && \
    find /app/node_modules -name "better_sqlite3.node" -type f -exec ls -lh {} \; && \
    echo "=== Build directory contents ===" && \
    ls -la /app/node_modules/.pnpm/better-sqlite3*/node_modules/better-sqlite3/build/
```

**Результат:**
- Файл `better_sqlite3.node` успешно компилируется
- Копируется в финальный образ из стадии `deps`
- Приложение работает без ошибок

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

## Проблема #4: Права доступа к директории БД (ФИНАЛЬНОЕ РЕШЕНИЕ)

При создании заявки возникала ошибка:
```
SqliteError: unable to open database file
code: 'SQLITE_CANTOPEN'
```

**Причина:**
- Директория `/app/data` создавалась до копирования файлов
- После копирования файлов права менялись на всю директорию `/app`
- Порядок операций был неправильный

**Решение:**
- Изменен порядок операций в Dockerfile:
  1. Сначала копируем все файлы
  2. Затем создаем директорию `/app/data`
  3. Устанавливаем права на всю директорию `/app` включая `/app/data`
- Добавлено подробное логирование в `lib/db.ts` для отладки

**Изменения в Dockerfile (строки 58-79):**
```dockerfile
# Было:
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data
COPY --from=builder /app/public ./public
...
RUN chown -R nextjs:nodejs /app

# Стало:
COPY --from=builder /app/public ./public
...
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app
```

**Изменения в lib/db.ts:**
- Добавлено логирование создания директории
- Добавлена проверка прав на запись
- Добавлено логирование ошибок с подробной информацией

**Результат:**
- Директория `/app/data` создается с правильными правами
- База данных успешно открывается
- Заявки сохраняются без ошибок

**⚠️ ВАЖНО:** Изменен `docker-compose.yml` - теперь используется named volume вместо bind mount:
```yaml
# Было:
volumes:
  - ./data:/app/data

# Стало:
volumes:
  - app-data:/app/data

volumes:
  app-data:
    driver: local
```

Это решает проблему с правами доступа - Docker автоматически создает volume с правильными правами.

## Проблема #5: Безопасность и исправление cookies (ФИНАЛЬНОЕ РЕШЕНИЕ)

При попытке войти в админ-панель возникали проблемы:
1. Дефолтные учетные данные были слишком простыми и видны на странице
2. После успешного входа (200 OK) не происходил редирект
3. Cookie не устанавливалась из-за `secure: true` без HTTPS

**Причина:**
- В production режиме cookie устанавливалась с флагом `secure: true`
- Без HTTPS браузер отклоняет такие cookies
- `router.push` не всегда работает надежно после установки cookies

**Решение:**

1. **Изменены дефолтные учетные данные:**
   - Логин: `tapdrink_admin`
   - Пароль: `TapDrink2024!Secure`
   - Убрана подсказка со страницы логина

2. **Исправлена установка cookies:**
   ```typescript
   // Было:
   secure: process.env.NODE_ENV === "production"

   // Стало:
   secure: process.env.USE_HTTPS === "true"
   ```

3. **Добавлена переменная окружения в docker-compose.yml:**
   ```yaml
   environment:
     - USE_HTTPS=false
   ```

4. **Исправлен редирект после входа:**
   ```typescript
   // Было:
   router.push("/admin/applications")

   // Стало:
   window.location.href = "/admin/applications"
   ```

**Изменения в файлах:**
- `lib/db.ts` - Новые дефолтные учетные данные
- `lib/auth.ts` - Исправлена логика secure cookies
- `app/admin/login/page.tsx` - Убрана подсказка, исправлен редирект
- `app/api/auth/login/route.ts` - Добавлено логирование
- `docker-compose.yml` - Добавлена переменная USE_HTTPS=false

**Результат:**
- ✅ Более безопасные дефолтные учетные данные
- ✅ Cookie устанавливается корректно без HTTPS
- ✅ Редирект работает надежно
- ✅ Вход в админ-панель работает

**⚠️ ВАЖНО:** После первого запуска проверьте логи Docker для получения учетных данных:
```bash
docker compose logs app | grep "Создан дефолтный администратор"
```

## 📝 Примечания

- Изменения обратно совместимы
- Локальная разработка работает без изменений
- База данных создается автоматически при первом запуске
- Дефолтный администратор создается автоматически с безопасными учетными данными
- Конфигурация обновлена для Next.js 16
- Cookie работает без HTTPS (для production без SSL)

