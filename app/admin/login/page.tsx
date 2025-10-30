"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Успешный вход!")
        // Используем window.location для надежного редиректа
        window.location.href = "/admin/applications"
      } else {
        toast.error("Ошибка входа", {
          description: data.error || "Неверный логин или пароль",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Ошибка", {
        description: "Произошла ошибка при входе",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EBE6DD] to-[#cfa173] flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 lg:p-12 space-y-6 md:space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="text-[#FF5C00] font-bold text-3xl md:text-4xl mb-2">
              Tap
              <br />
              Drink
            </div>
            <p className="text-gray-600 text-base md:text-lg">Админ-панель</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                Логин
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2.5 md:py-3 rounded-xl border border-gray-300 focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 outline-none transition-all text-sm md:text-base"
                placeholder="Введите логин"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 md:py-3 rounded-xl border border-gray-300 focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 outline-none transition-all text-sm md:text-base"
                placeholder="Введите пароль"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-[#FF5C00] hover:bg-[#E54F00] text-white py-5 md:py-6 text-base md:text-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </form>
        </div>

        {/* Back to home */}
        <div className="text-center mt-4 md:mt-6">
          <a href="/" className="text-white hover:text-[#FF5C00] transition-colors font-medium text-sm md:text-base">
            ← Вернуться на главную
          </a>
        </div>
      </div>
    </div>
  )
}

