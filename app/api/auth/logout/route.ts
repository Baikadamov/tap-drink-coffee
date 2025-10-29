import { NextResponse } from "next/server"
import { deleteSession } from "@/lib/auth"

export async function POST() {
  try {
    await deleteSession()

    return NextResponse.json({
      success: true,
      message: "Успешный выход",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Ошибка при выходе" }, { status: 500 })
  }
}

