"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { toast } from "sonner"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Вы вышли из системы")
        router.push("/admin/login")
      } else {
        toast.error("Ошибка при выходе")
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Ошибка при выходе")
    }
  }

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="rounded-full border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300 text-sm md:text-base px-3 md:px-4 py-2"
    >
      <LogOut className="h-3.5 w-3.5 md:h-4 md:w-4 md:mr-2" />
      <span className="hidden sm:inline">Выйти</span>
    </Button>
  )
}

