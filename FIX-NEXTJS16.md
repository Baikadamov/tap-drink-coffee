# 🔧 Исправление для Next.js 16 и better-sqlite3

## ✅ Проблемы исправлены!

### Проблема 1: Next.js 16 конфигурация
- `experimental.serverComponentsExternalPackages` переименован в `serverExternalPackages`
- Turbopack теперь по умолчанию, webpack конфигурация конфликтует с ним

### Проблема 2: Копирование нативных модулей
- Нативный модуль `better-sqlite3` копировался из неправильной стадии Docker
- Модуль компилировался в `deps`, но копировался из `builder`

## 🚀 Что делать на сервере

### Вариант 1: Обновить через Git (рекомендуется)

```bash
# На сервере
cd ~/tap-drink-coffee

# Получить последние изменения
git pull

# Пересобрать образ
docker compose down
docker compose build --no-cache
docker compose up -d

# Проверить логи
docker compose logs -f
```

### Вариант 2: Обновить файл вручную

Если git pull не работает, обновите файл `next.config.mjs` вручную:

```bash
# На сервере
cd ~/tap-drink-coffee
nano next.config.mjs
```

Замените содержимое на:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  // В Next.js 16 переименовано из experimental.serverComponentsExternalPackages
  serverExternalPackages: ['better-sqlite3'],
  // Пустая конфигурация Turbopack для подавления предупреждения
  turbopack: {},
}

export default nextConfig
```

Сохраните (Ctrl+O, Enter, Ctrl+X) и пересоберите:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

## ✅ Проверка

После пересборки проверьте:

```bash
# 1. Контейнеры запущены
docker compose ps

# 2. Нет ошибок в логах
docker compose logs app | grep -i error

# 3. Приложение отвечает
curl http://localhost
```

Если все ОК, откройте в браузере: `http://YOUR_SERVER_IP`

## 📋 Что было изменено

### Файл 1: next.config.mjs

**Было:**
```javascript
experimental: {
  serverComponentsExternalPackages: ['better-sqlite3'],
},
webpack: (config, { isServer }) => {
  if (isServer) {
    config.externals.push('better-sqlite3')
  }
  return config
},
```

**Стало:**
```javascript
serverExternalPackages: ['better-sqlite3'],
turbopack: {},
```

### Файл 2: Dockerfile

**Было:**
```dockerfile
# Копируем node_modules с скомпилированным better-sqlite3
COPY --from=builder /app/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=builder /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
```

**Стало:**
```dockerfile
# Копируем скомпилированный better-sqlite3 из deps (где он был пересобран)
COPY --from=deps /app/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=deps /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
```

**Ключевое изменение:** Копируем из `deps` вместо `builder`, потому что именно в `deps` выполняется `pnpm rebuild better-sqlite3`

## 🐛 Если проблема осталась

### 1. Очистите Docker кеш полностью

```bash
docker compose down
docker system prune -a -f
docker volume prune -f
```

### 2. Пересоберите с нуля

```bash
docker compose build --no-cache --pull
docker compose up -d
```

### 3. Проверьте версию Next.js

```bash
docker compose exec app cat package.json | grep next
```

Должно быть: `"next": "16.0.0"`

### 4. Проверьте содержимое next.config.mjs

```bash
cat next.config.mjs
```

Убедитесь, что файл содержит правильную конфигурацию (см. выше).

## 📊 Ожидаемый результат

После исправления сборка должна пройти успешно:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Collecting build traces
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    ...      ...
└ ○ /admin                               ...      ...
```

## 💡 Полезные команды

```bash
# Посмотреть логи сборки
docker compose logs app

# Посмотреть логи в реальном времени
docker compose logs -f

# Перезапустить только app контейнер
docker compose restart app

# Проверить статус
docker compose ps

# Зайти внутрь контейнера
docker compose exec app sh
```

## 📚 Дополнительная информация

- **Документация Next.js 16:** https://nextjs.org/docs
- **Turbopack:** https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
- **Миграция конфигурации:** https://nextjs.org/docs/messages/invalid-next-config

## ✅ Итог

Проблема исправлена! Просто обновите код и пересоберите Docker образ.

**Быстрая команда:**
```bash
cd ~/tap-drink-coffee && git pull && docker compose down && docker compose build --no-cache && docker compose up -d
```

---

**Нужна помощь?** Проверьте [DEPLOY-NO-SSL.md](DEPLOY-NO-SSL.md) или [CHANGELOG-DEPLOY-FIX.md](CHANGELOG-DEPLOY-FIX.md)

