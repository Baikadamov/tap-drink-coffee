# Используем официальный Node.js образ
FROM node:20-alpine AS base

# Установка зависимостей для компиляции нативных модулей (better-sqlite3)
RUN apk add --no-cache libc6-compat python3 make g++ sqlite

# Установка pnpm и node-gyp
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm install -g node-gyp

# Установка зависимостей только когда нужно
FROM base AS deps
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости
RUN pnpm install --no-frozen-lockfile

# Компилируем better-sqlite3 напрямую через node-gyp
RUN cd /app/node_modules/.pnpm/better-sqlite3*/node_modules/better-sqlite3 && \
    node-gyp rebuild

# Проверяем что файл создан (для отладки)
RUN echo "=== Checking better-sqlite3 build ===" && \
    find /app/node_modules -name "better_sqlite3.node" -type f -exec ls -lh {} \; && \
    echo "=== Build directory contents ===" && \
    ls -la /app/node_modules/.pnpm/better-sqlite3*/node_modules/better-sqlite3/build/ 2>/dev/null || echo "Build directory not found"

# Сборка приложения
FROM base AS builder
WORKDIR /app

# Копируем зависимости из предыдущего этапа
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Отключаем телеметрию Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Устанавливаем переменную окружения для пропуска инициализации БД во время сборки
ENV SKIP_DB_INIT=1

# Собираем приложение
RUN pnpm build

# Продакшн образ
FROM node:20-alpine AS runner
WORKDIR /app

# Устанавливаем только runtime зависимости для better-sqlite3
RUN apk add --no-cache libc6-compat sqlite

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Создаем пользователя для запуска приложения
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем необходимые файлы из builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Копируем скомпилированный better-sqlite3 из deps (где он был пересобран)
# Standalone режим Next.js не включает нативные модули автоматически
# Копируем весь .pnpm каталог чтобы получить все версии и зависимости
COPY --from=deps /app/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=deps /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3

# Проверяем что файл скопирован (для отладки)
RUN ls -la /app/node_modules/.pnpm/better-sqlite3*/node_modules/better-sqlite3/build/ || echo "Build directory not found"

# Создаем директорию для базы данных и устанавливаем права на все файлы
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

