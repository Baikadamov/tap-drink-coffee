import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const secret = new TextEncoder().encode(SECRET_KEY)

export interface SessionPayload {
  userId: number
  username: string
  expiresAt: Date
}

// Создать JWT токен
export async function createSession(userId: number, username: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 дней

  const token = await new SignJWT({ userId, username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })

  return token
}

// Проверить JWT токен
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)

    return {
      userId: payload.userId as number,
      username: payload.username as string,
      expiresAt: new Date((payload.exp as number) * 1000),
    }
  } catch (error) {
    console.error("Failed to verify session:", error)
    return null
  }
}

// Получить текущую сессию из cookies
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return null
  }

  return verifySession(token)
}

// Получить сессию из request (для API routes)
export async function getSessionFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get("session")?.value

  if (!token) {
    return null
  }

  return verifySession(token)
}

// Удалить сессию (logout)
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

// Проверить, авторизован ли пользователь
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null && session.expiresAt > new Date()
}

