import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)

    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: session.userId,
        username: session.username,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Ошибка при получении данных пользователя" }, { status: 500 })
  }
}

