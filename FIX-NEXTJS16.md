# 🔧 Исправление для Next.js 16

## ✅ Проблема исправлена!

Ошибка была связана с изменениями в Next.js 16:
- `experimental.serverComponentsExternalPackages` переименован в `serverExternalPackages`
- Turbopack теперь по умолчанию, webpack конфигурация конфликтует с ним

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

### Файл: next.config.mjs

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

