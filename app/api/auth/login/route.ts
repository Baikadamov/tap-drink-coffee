import { NextRequest, NextResponse } from "next/server"
import { adminQueries } from "@/lib/db"
import { createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Валидация
    if (!username || !password) {
      return NextResponse.json({ error: "Логин и пароль обязательны" }, { status: 400 })
    }

    // Ищем администратора
    const admin = adminQueries.findByUsername(username)

    if (!admin) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 })
    }

    // Проверяем пароль
    const isValidPassword = adminQueries.verifyPassword(admin, password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 })
    }

    // Создаем сессию
    await createSession(admin.id, admin.username)

    return NextResponse.json({
      success: true,
      message: "Успешный вход",
      user: {
        id: admin.id,
        username: admin.username,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Ошибка при входе" }, { status: 500 })
  }
}

