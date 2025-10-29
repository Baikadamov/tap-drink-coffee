# Используем официальный Node.js образ
FROM node:20-alpine AS base

# Установка pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Установка зависимостей только когда нужно
FROM base AS deps
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости
RUN pnpm install --no-frozen-lockfile

# Сборка приложения
FROM base AS builder
WORKDIR /app

# Копируем зависимости из предыдущего этапа
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Отключаем телеметрию Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Собираем приложение
RUN pnpm build

# Продакшн образ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Создаем пользователя для запуска приложения
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Создаем директорию для базы данных
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

# Копируем необходимые файлы
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Устанавливаем правильные права
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

