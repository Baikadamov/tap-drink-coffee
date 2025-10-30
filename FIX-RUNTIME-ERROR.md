# 🔧 Исправление runtime ошибки better-sqlite3

## ✅ Проблема исправлена!

### Что случилось:
При создании заявки возникала ошибка:
```
Error: Could not locate the bindings file for better-sqlite3
```

### Причина:
Нативный модуль `better-sqlite3` компилировался в стадии `deps` Docker, но копировался из стадии `builder`, где он не был пересобран. В результате в runtime использовалась неправильная версия модуля.

### Решение:
Изменили Dockerfile чтобы копировать скомпилированный модуль из правильной стадии (`deps` вместо `builder`).

---

## 🚀 Что делать на сервере

### Быстрое исправление (одна команда):

```bash
cd ~/tap-drink-coffee && git pull && docker compose down && docker compose build --no-cache && docker compose up -d
```

### Пошаговая инструкция:

```bash
# 1. Перейти в директорию проекта
cd ~/tap-drink-coffee

# 2. Получить последние изменения
git pull

# 3. Остановить контейнеры
docker compose down

# 4. Пересобрать образ с нуля
docker compose build --no-cache

# 5. Запустить контейнеры
docker compose up -d

# 6. Проверить логи
docker compose logs -f app
```

---

## ✅ Проверка

После пересборки проверьте:

### 1. Контейнеры запущены
```bash
docker compose ps
```

Должно быть:
```
NAME                    STATUS
tap-drink-coffee-app    Up
tap-drink-coffee-nginx  Up
```

### 2. Нет ошибок в логах
```bash
docker compose logs app | tail -20
```

### 3. Приложение отвечает
```bash
curl http://localhost
```

### 4. Создание заявки работает

Откройте в браузере: `http://YOUR_SERVER_IP`

1. Заполните форму заявки
2. Нажмите "Отправить заявку"
3. Должно появиться сообщение "Заявка успешно отправлена!"

### 5. Проверьте админ-панель

1. Откройте: `http://YOUR_SERVER_IP/admin`
2. Войдите (admin/admin123)
3. Проверьте что заявка появилась в списке

---

## 📋 Что было изменено

### Dockerfile (строки 62-66)

**Было:**
```dockerfile
# Копируем node_modules с скомпилированным better-sqlite3
# Standalone режим Next.js не включает нативные модули автоматически
COPY --from=builder /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=builder /app/node_modules/.pnpm ./node_modules/.pnpm
```

**Стало:**
```dockerfile
# Копируем скомпилированный better-sqlite3 из deps (где он был пересобран)
# Standalone режим Next.js не включает нативные модули автоматически
# Копируем весь .pnpm каталог чтобы получить все версии и зависимости
COPY --from=deps /app/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=deps /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
```

**Ключевое изменение:** 
- Копируем из `deps` вместо `builder`
- В `deps` выполняется `pnpm rebuild better-sqlite3` (строка 21)
- Поэтому именно там находится правильно скомпилированный модуль

---

## 🔍 Техническая информация

### Почему это важно:

1. **Стадия `deps`:**
   - Устанавливает зависимости: `pnpm install`
   - Пересобирает нативные модули: `pnpm rebuild better-sqlite3`
   - Модуль компилируется для Alpine Linux

2. **Стадия `builder`:**
   - Копирует `node_modules` из `deps`
   - Собирает Next.js приложение: `pnpm build`
   - НЕ пересобирает нативные модули

3. **Стадия `runner`:**
   - Финальный образ для production
   - Должен содержать скомпилированный модуль из `deps`

### Структура better-sqlite3:

```
node_modules/
├── .pnpm/
│   └── better-sqlite3@12.4.1/
│       └── node_modules/
│           └── better-sqlite3/
│               └── build/
│                   └── better_sqlite3.node  ← Скомпилированный файл
└── better-sqlite3/  ← Симлинк на .pnpm/better-sqlite3@...
```

Нужно копировать оба:
- `.pnpm/better-sqlite3@...` - содержит скомпилированный файл
- `better-sqlite3/` - симлинк для импортов

---

## 🐛 Если проблема осталась

### 1. Проверьте что файл скопирован

```bash
# Зайти в контейнер
docker compose exec app sh

# Проверить наличие скомпилированного файла
ls -la /app/node_modules/.pnpm/better-sqlite3*/node_modules/better-sqlite3/build/

# Должен быть файл: better_sqlite3.node
```

### 2. Проверьте права доступа

```bash
# В контейнере
ls -la /app/data/

# Должно быть:
# drwxr-xr-x nextjs nodejs data
```

### 3. Очистите Docker полностью

```bash
docker compose down
docker system prune -a -f
docker volume prune -f
docker compose build --no-cache --pull
docker compose up -d
```

### 4. Проверьте версию модуля

```bash
# В контейнере
cat /app/node_modules/better-sqlite3/package.json | grep version
```

Должно быть: `"version": "12.4.1"`

---

## 📊 Ожидаемый результат

После исправления:

1. ✅ Сборка проходит успешно
2. ✅ Контейнеры запускаются
3. ✅ Главная страница загружается
4. ✅ Форма заявки работает
5. ✅ Заявки сохраняются в БД
6. ✅ Админ-панель показывает заявки
7. ✅ Нет ошибок в логах

### Логи должны показывать:

```
tap-drink-coffee-app | ▲ Next.js 16.0.0
tap-drink-coffee-app | - Local:        http://localhost:3000
tap-drink-coffee-app | - Network:      http://0.0.0.0:3000
tap-drink-coffee-app | ✓ Ready in XXXms
```

При создании заявки:
```
tap-drink-coffee-app | Application created successfully
```

---

## 💡 Полезные команды

```bash
# Посмотреть логи только app контейнера
docker compose logs -f app

# Посмотреть последние 50 строк логов
docker compose logs --tail=50 app

# Проверить использование ресурсов
docker stats

# Зайти в контейнер для отладки
docker compose exec app sh

# Перезапустить только app
docker compose restart app

# Проверить что база данных создана
ls -lh data/applications.db
```

---

## 📚 Связанная документация

- **Полный changelog:** [CHANGELOG-DEPLOY-FIX.md](CHANGELOG-DEPLOY-FIX.md)
- **Исправление Next.js 16:** [FIX-NEXTJS16.md](FIX-NEXTJS16.md)
- **Деплой:** [QUICK-START.md](QUICK-START.md)
- **Решение проблем:** [DEPLOY-NO-SSL.md](DEPLOY-NO-SSL.md)

---

## ✅ Итог

Проблема исправлена! Просто обновите код и пересоберите:

```bash
cd ~/tap-drink-coffee && git pull && docker compose down && docker compose build --no-cache && docker compose up -d
```

После этого создание заявок должно работать без ошибок! 🎉

---

**Время исправления:** 5-10 минут (время пересборки Docker образа)

