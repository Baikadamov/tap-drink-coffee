# Используем официальный Node.js образ
FROM node:20-alpine AS base

# Установка зависимостей для компиляции нативных модулей (better-sqlite3)
RUN apk add --no-cache libc6-compat python3 make g++ sqlite

# Установка pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Установка зависимостей только когда нужно
FROM base AS deps
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости с пересборкой нативных модулей
RUN pnpm install --no-frozen-lockfile

# Пересобираем better-sqlite3 для текущей платформы
RUN pnpm rebuild better-sqlite3

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

# Создаем директорию для базы данных
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

# Копируем необходимые файлы из builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Копируем node_modules с скомпилированным better-sqlite3
# Standalone режим Next.js не включает нативные модули автоматически
COPY --from=builder /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=builder /app/node_modules/.pnpm ./node_modules/.pnpm

# Устанавливаем правильные права
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

