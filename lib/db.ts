import Database from "better-sqlite3"
import bcrypt from "bcryptjs"
import path from "path"
import fs from "fs"

// Путь к базе данных
const dbDir = path.join(process.cwd(), "data")
const dbPath = path.join(dbDir, "applications.db")

let db: Database.Database | null = null
let isInitialized = false

// Функция для получения экземпляра базы данных
function getDatabase(): Database.Database {
  // Пропускаем инициализацию во время сборки Next.js
  if (process.env.SKIP_DB_INIT === "1") {
    throw new Error("Database is not available during build time")
  }

  if (!db) {
    // Создаем директорию для БД если её нет
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }

    // Инициализация базы данных
    db = new Database(dbPath)

    // Включаем поддержку внешних ключей
    db.pragma("foreign_keys = ON")

    // Инициализируем таблицы
    if (!isInitialized) {
      initDatabase()
      isInitialized = true
    }
  }

  return db
}

// Создание таблиц
function initDatabase() {
  const database = db!

  // Таблица заявок
  database.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      coffee_shop_name TEXT NOT NULL,
      address TEXT NOT NULL,
      contact_person TEXT NOT NULL,
      phone TEXT NOT NULL,
      branches TEXT NOT NULL,
      social TEXT,
      status TEXT DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'approved', 'rejected')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Таблица администраторов
  database.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Создаем дефолтного администратора если его нет
  const adminExists = database.prepare("SELECT COUNT(*) as count FROM admins").get() as { count: number }

  if (adminExists.count === 0) {
    const passwordHash = bcrypt.hashSync("admin123", 10)
    database.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").run("admin", passwordHash)
    console.log("✅ Создан дефолтный администратор: admin / admin123")
  }
}

// Типы для TypeScript
export interface Application {
  id: number
  coffee_shop_name: string
  address: string
  contact_person: string
  phone: string
  branches: string
  social: string | null
  status: "new" | "contacted" | "approved" | "rejected"
  created_at: string
  updated_at: string
}

export interface Admin {
  id: number
  username: string
  password_hash: string
  created_at: string
}

export interface NewApplication {
  coffee_shop_name: string
  address: string
  contact_person: string
  phone: string
  branches: string
  social?: string
}

// Функции для работы с заявками
export const applicationQueries = {
  // Создать новую заявку
  create: (data: NewApplication): Application => {
    const database = getDatabase()
    const stmt = database.prepare(`
      INSERT INTO applications (coffee_shop_name, address, contact_person, phone, branches, social)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      data.coffee_shop_name,
      data.address,
      data.contact_person,
      data.phone,
      data.branches,
      data.social || null
    )

    return applicationQueries.getById(result.lastInsertRowid as number)!
  },

  // Получить все заявки
  getAll: (): Application[] => {
    const database = getDatabase()
    return database.prepare("SELECT * FROM applications ORDER BY created_at DESC").all() as Application[]
  },

  // Получить заявку по ID
  getById: (id: number): Application | undefined => {
    const database = getDatabase()
    return database.prepare("SELECT * FROM applications WHERE id = ?").get(id) as Application | undefined
  },

  // Обновить статус заявки
  updateStatus: (id: number, status: Application["status"]): Application | undefined => {
    const database = getDatabase()
    database.prepare("UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, id)
    return applicationQueries.getById(id)
  },

  // Удалить заявку
  delete: (id: number): void => {
    const database = getDatabase()
    database.prepare("DELETE FROM applications WHERE id = ?").run(id)
  },

  // Получить статистику
  getStats: () => {
    const database = getDatabase()
    const total = database.prepare("SELECT COUNT(*) as count FROM applications").get() as { count: number }
    const newCount = database.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'new'").get() as {
      count: number
    }
    const contacted = database.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'contacted'").get() as {
      count: number
    }
    const approved = database.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'approved'").get() as {
      count: number
    }

    return {
      total: total.count,
      new: newCount.count,
      contacted: contacted.count,
      approved: approved.count,
    }
  },
}

// Функции для работы с администраторами
export const adminQueries = {
  // Найти администратора по username
  findByUsername: (username: string): Admin | undefined => {
    const database = getDatabase()
    return database.prepare("SELECT * FROM admins WHERE username = ?").get(username) as Admin | undefined
  },

  // Создать нового администратора
  create: (username: string, password: string): Admin => {
    const database = getDatabase()
    const passwordHash = bcrypt.hashSync(password, 10)
    const stmt = database.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)")
    const result = stmt.run(username, passwordHash)

    return database.prepare("SELECT * FROM admins WHERE id = ?").get(result.lastInsertRowid) as Admin
  },

  // Проверить пароль
  verifyPassword: (admin: Admin, password: string): boolean => {
    return bcrypt.compareSync(password, admin.password_hash)
  },
}

export { getDatabase }
export default getDatabase

