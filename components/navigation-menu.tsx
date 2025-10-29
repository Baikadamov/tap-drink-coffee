"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Grid2X2, X } from "lucide-react"

const menuItems = [
  { label: "Главная", href: "#hero" },
  { label: "Как это работает", href: "#how-it-works" },
  { label: "Что такое TapDrink", href: "#what-is" },
  { label: "Для кофеен", href: "#for-coffee-shops" },
  { label: "Приложение", href: "#app" },
  { label: "Заявка", href: "#application" },
  { label: "Контакты", href: "#contacts" },
  { label: "FAQ", href: "#faq" },
]

export function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = (href: string) => {
    setIsOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="rounded-full bg-white/80 backdrop-blur-sm border-gray-300 hover:bg-white"
        onClick={() => setIsOpen(true)}
      >
        Меню
        <Grid2X2 className="ml-2 h-4 w-4" />
      </Button>

      {/* Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="text-[#FF5C00] font-bold text-2xl">
                  Tap
                  <br />
                  Drink
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 overflow-y-auto p-6">
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <button
                        onClick={() => handleClick(item.href)}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#EBE6DD] transition-colors text-lg font-medium"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Footer */}
              <div className="p-6 border-t bg-[#EBE6DD]">
                <Button
                  className="w-full rounded-full bg-[#FF5C00] hover:bg-[#E54F00] text-white"
                  onClick={() => handleClick("#application")}
                >
                  Оставить заявку
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

