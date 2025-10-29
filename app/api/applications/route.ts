import { NextRequest, NextResponse } from "next/server"
import { applicationQueries, type NewApplication } from "@/lib/db"
import { getSessionFromRequest } from "@/lib/auth"

// POST - Создать новую заявку (публичный endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Валидация данных
    const { coffee_shop_name, address, contact_person, phone, branches, social } = body

    if (!coffee_shop_name || !address || !contact_person || !phone || !branches) {
      return NextResponse.json({ error: "Все обязательные поля должны быть заполнены" }, { status: 400 })
    }

    // Создаем заявку
    const newApplication: NewApplication = {
      coffee_shop_name,
      address,
      contact_person,
      phone,
      branches,
      social: social || undefined,
    }

    const application = applicationQueries.create(newApplication)

    return NextResponse.json(
      {
        success: true,
        message: "Заявка успешно отправлена!",
        application,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json({ error: "Ошибка при создании заявки" }, { status: 500 })
  }
}

// GET - Получить все заявки (защищенный endpoint)
export async function GET(request: NextRequest) {
  try {
    // Проверяем авторизацию
    const session = await getSessionFromRequest(request)

    if (!session) {
      return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
    }

    // Получаем все заявки
    const applications = applicationQueries.getAll()
    const stats = applicationQueries.getStats()

    return NextResponse.json({
      success: true,
      applications,
      stats,
    })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Ошибка при получении заявок" }, { status: 500 })
  }
}

