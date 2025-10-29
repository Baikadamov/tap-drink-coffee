import { NextRequest, NextResponse } from "next/server"
import { applicationQueries, type Application } from "@/lib/db"
import { getSessionFromRequest } from "@/lib/auth"

// PATCH - Обновить статус заявки (защищенный endpoint)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Проверяем авторизацию
    const session = await getSessionFromRequest(request)

    if (!session) {
      return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
    }

    const { id } = await params
    const applicationId = parseInt(id, 10)

    if (isNaN(applicationId)) {
      return NextResponse.json({ error: "Неверный ID заявки" }, { status: 400 })
    }

    const body = await request.json()
    const { status } = body

    // Валидация статуса
    const validStatuses: Application["status"][] = ["new", "contacted", "approved", "rejected"]
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Неверный статус" }, { status: 400 })
    }

    // Обновляем статус
    const updatedApplication = applicationQueries.updateStatus(applicationId, status)

    if (!updatedApplication) {
      return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Статус заявки обновлен",
      application: updatedApplication,
    })
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ error: "Ошибка при обновлении заявки" }, { status: 500 })
  }
}

// DELETE - Удалить заявку (защищенный endpoint)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Проверяем авторизацию
    const session = await getSessionFromRequest(request)

    if (!session) {
      return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
    }

    const { id } = await params
    const applicationId = parseInt(id, 10)

    if (isNaN(applicationId)) {
      return NextResponse.json({ error: "Неверный ID заявки" }, { status: 400 })
    }

    // Проверяем существование заявки
    const application = applicationQueries.getById(applicationId)
    if (!application) {
      return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 })
    }

    // Удаляем заявку
    applicationQueries.delete(applicationId)

    return NextResponse.json({
      success: true,
      message: "Заявка удалена",
    })
  } catch (error) {
    console.error("Error deleting application:", error)
    return NextResponse.json({ error: "Ошибка при удалении заявки" }, { status: 500 })
  }
}

