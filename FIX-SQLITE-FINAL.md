# 🔧 Финальное исправление better-sqlite3

## ✅ Проблема исправлена!

### Что случилось:
При создании заявки возникали ошибки:
1. `Error: Could not locate the bindings file for better-sqlite3`
2. `SqliteError: unable to open database file (SQLITE_CANTOPEN)`

### Причина:
1. `pnpm rebuild` не компилировал нативный модуль правильно для Alpine Linux
2. Неправильный порядок установки прав доступа к директории `/app/data`

### Решение:
1. Используем `node-gyp rebuild` напрямую для компиляции нативного модуля
2. Создаем директорию БД после копирования всех файлов
3. Добавлено подробное логирование для отладки

---

## 🚀 Что делать на сервере

### ⚠️ ВАЖНО: Исправление прав доступа

Если директория `./data` уже существует на сервере, нужно исправить права:

```bash
cd ~/tap-drink-coffee
docker compose down

# Вариант 1: Удалить старую директорию (если нет важных данных)
sudo rm -rf ./data

# Вариант 2: Изменить права (если есть важные данные)
sudo chown -R 1001:1001 ./data
sudo chmod -R 755 ./data
```

### Быстрое исправление (одна команда):

```bash
cd ~/tap-drink-coffee && docker compose down && sudo rm -rf ./data && git pull && docker compose build --no-cache && docker compose up -d
```

### Пошаговая инструкция:

```bash
# 1. Перейти в директорию проекта
cd ~/tap-drink-coffee

# 2. Остановить контейнеры
docker compose down

# 3. Удалить старую директорию data (или изменить права - см. выше)
sudo rm -rf ./data

# 4. Получить последние изменения
git pull

# 5. Пересобрать образ с нуля (это займет 5-10 минут)
docker compose build --no-cache

# 6. Запустить контейнеры
docker compose up -d

# 7. Проверить логи
docker compose logs -f app
```

---

## ✅ Проверка

### 1. Проверить что сборка прошла успешно

Во время сборки вы должны увидеть:
```
=== Checking better-sqlite3 build ===
/app/node_modules/.pnpm/better-sqlite3@12.4.1/node_modules/better-sqlite3/build/Release/better_sqlite3.node
```

Это означает что файл скомпилирован успешно.

### 2. Контейнеры запущены
```bash
docker compose ps
```

Должно быть:
```
NAME                    STATUS
tap-drink-coffee-app    Up
tap-drink-coffee-nginx  Up
```

### 3. Нет ошибок в логах
```bash
docker compose logs app | tail -20
```

Должно быть:
```
Database directory already exists: /app/data
Database directory is writable
Opening database: /app/data/applications.db
Database opened successfully
✓ Ready in XXXms
```

**Если видите ошибку `EACCES: permission denied, access '/app/data'`:**
```bash
docker compose down
sudo chown -R 1001:1001 ./data
docker compose up -d
```

### 4. Создание заявки работает

Откройте в браузере: `http://YOUR_SERVER_IP`

1. Заполните форму заявки:
   - Название кофейни
   - Контактное лицо
   - Телефон
   - Email
   - Адрес

2. Нажмите "Отправить заявку"

3. Должно появиться: **"Заявка успешно отправлена!"**

4. В логах должно быть:
   ```bash
   docker compose logs app | grep "Application created"
   ```
   Вывод:
   ```
   Application created successfully
   ```

### 5. Проверьте админ-панель

1. Откройте: `http://YOUR_SERVER_IP/admin`
2. Войдите:
   - Логин: `admin`
   - Пароль: `admin123`
3. Проверьте что заявка появилась в списке

---

## 📋 Что было изменено

### Dockerfile

**Изменение 1: Добавлен node-gyp (строка 9)**
```dockerfile
RUN npm install -g node-gyp
```

**Изменение 2: Компиляция через node-gyp (строки 21-23)**
```dockerfile
# Было:
RUN pnpm rebuild better-sqlite3

# Стало:
RUN cd /app/node_modules/.pnpm/better-sqlite3*/node_modules/better-sqlite3 && \
    node-gyp rebuild
```

**Изменение 3: Добавлена отладочная информация (строки 25-29)**
```dockerfile
RUN echo "=== Checking better-sqlite3 build ===" && \
    find /app/node_modules -name "better_sqlite3.node" -type f -exec ls -lh {} \; && \
    echo "=== Build directory contents ===" && \
    ls -la /app/node_modules/.pnpm/better-sqlite3*/node_modules/better-sqlite3/build/
```

---

## 🔍 Техническая информация

### Почему node-gyp вместо pnpm rebuild?

1. **pnpm rebuild:**
   - Использует внутренний механизм pnpm
   - Может не работать правильно с некоторыми нативными модулями
   - Зависит от структуры .pnpm каталога

2. **node-gyp rebuild:**
   - Прямая компиляция нативного модуля
   - Стандартный инструмент для Node.js нативных модулей
   - Более надежный для Alpine Linux

### Структура после компиляции:

```
node_modules/
├── .pnpm/
│   └── better-sqlite3@12.4.1/
│       └── node_modules/
│           └── better-sqlite3/
│               ├── build/
│               │   └── Release/
│               │       └── better_sqlite3.node  ← Скомпилированный файл
│               └── package.json
└── better-sqlite3/  ← Симлинк
```

### Зависимости для компиляции:

- `python3` - для node-gyp
- `make` - для Makefile
- `g++` - компилятор C++
- `sqlite` - библиотека SQLite
- `libc6-compat` - совместимость с glibc

---

## 🐛 Если проблема осталась

### 1. Ошибка `EACCES: permission denied, access '/app/data'`

**Причина:** Директория `./data` на хосте принадлежит root, а контейнер работает от пользователя `nextjs` (uid 1001).

**Решение:**
```bash
cd ~/tap-drink-coffee
docker compose down

# Проверить владельца директории
ls -la ./data

# Изменить владельца на uid 1001 (пользователь nextjs в контейнере)
sudo chown -R 1001:1001 ./data
sudo chmod -R 755 ./data

# Запустить снова
docker compose up -d
```

**Альтернатива:** Удалить директорию и дать контейнеру создать её заново:
```bash
docker compose down
sudo rm -rf ./data
docker compose up -d
```

### 2. Проверьте логи сборки

```bash
docker compose build --no-cache 2>&1 | tee build.log
cat build.log | grep -A 10 "better-sqlite3"
```

Должно быть:
```
=== Checking better-sqlite3 build ===
/app/node_modules/.pnpm/better-sqlite3@12.4.1/node_modules/better-sqlite3/build/Release/better_sqlite3.node
```

### 2. Проверьте файл в контейнере

```bash
docker compose exec app sh -c "find /app/node_modules -name 'better_sqlite3.node' -type f -exec ls -lh {} \;"
```

Должен вывести путь к файлу и его размер (обычно ~500KB).

### 3. Проверьте что файл исполняемый

```bash
docker compose exec app sh -c "file /app/node_modules/.pnpm/better-sqlite3*/node_modules/better-sqlite3/build/Release/better_sqlite3.node"
```

Должно быть:
```
ELF 64-bit LSB shared object, x86-64
```

### 4. Используйте скрипт отладки

```bash
chmod +x debug-build.sh
./debug-build.sh
```

Этот скрипт выполнит полную проверку и сохранит логи в `build.log`.

### 5. Очистите Docker полностью

```bash
docker compose down -v
docker system prune -a -f
docker volume prune -f
docker compose build --no-cache --pull
docker compose up -d
```

---

## 📊 Ожидаемый результат

После исправления:

1. ✅ Сборка проходит успешно (5-10 минут)
2. ✅ В логах сборки видно скомпилированный файл
3. ✅ Контейнеры запускаются
4. ✅ Главная страница загружается
5. ✅ Форма заявки работает
6. ✅ Заявки сохраняются в БД
7. ✅ Админ-панель показывает заявки
8. ✅ Нет ошибок "Could not locate the bindings file"

### Логи приложения:

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
# Посмотреть логи сборки
docker compose build --no-cache --progress=plain 2>&1 | tee build.log

# Посмотреть логи приложения
docker compose logs -f app

# Проверить файл better_sqlite3.node
docker compose exec app find /app/node_modules -name "better_sqlite3.node"

# Зайти в контейнер для отладки
docker compose exec app sh

# Проверить базу данных
docker compose exec app ls -lh /app/data/

# Перезапустить приложение
docker compose restart app

# Проверить использование ресурсов
docker stats
```

---

## 📚 Связанная документация

- **Полный changelog:** [CHANGELOG-DEPLOY-FIX.md](CHANGELOG-DEPLOY-FIX.md)
- **Runtime ошибка:** [FIX-RUNTIME-ERROR.md](FIX-RUNTIME-ERROR.md)
- **Next.js 16:** [FIX-NEXTJS16.md](FIX-NEXTJS16.md)
- **Деплой:** [QUICK-START.md](QUICK-START.md)
- **Решение проблем:** [DEPLOY-NO-SSL.md](DEPLOY-NO-SSL.md)

---

## ✅ Итог

Проблема исправлена! Используем `node-gyp rebuild` для прямой компиляции нативного модуля.

```bash
cd ~/tap-drink-coffee && git pull && docker compose down && docker compose build --no-cache && docker compose up -d
```

После этого создание заявок должно работать без ошибок! 🎉

---

**Время исправления:** 5-10 минут (время пересборки Docker образа)

**Важно:** Используйте `--no-cache` чтобы пересобрать все с нуля!

