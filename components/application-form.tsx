"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// Схема валидации
const applicationSchema = z.object({
  coffee_shop_name: z.string().min(2, "Название должно содержать минимум 2 символа"),
  address: z.string().min(5, "Адрес должен содержать минимум 5 символов"),
  contact_person: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
  branches: z.string().min(1, "Выберите количество филиалов"),
  social: z.string().optional(),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

export function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  })

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        toast.success("Спасибо за заявку!", {
          description: "Мы свяжемся с вами в течение 24 часов",
        })
        reset()

        // Скрываем сообщение об успехе через 5 секунд
        setTimeout(() => {
          setIsSuccess(false)
        }, 5000)
      } else {
        toast.error("Ошибка", {
          description: result.error || "Не удалось отправить заявку",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Ошибка", {
        description: "Произошла ошибка при отправке заявки",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-white rounded-3xl p-8 lg:p-12 text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-gray-900">Спасибо за заявку!</h3>
        <p className="text-lg text-gray-600">Мы свяжемся с вами в течение 24 часов и покажем, как TapDrink работает.</p>
        <Button
          onClick={() => setIsSuccess(false)}
          className="rounded-full bg-[#FF5C00] hover:bg-[#E54F00] text-white px-8 py-6"
        >
          Отправить еще одну заявку
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl p-8 lg:p-12 space-y-6">
      <div className="space-y-2">
        <label htmlFor="coffee_shop_name" className="block text-sm font-semibold text-gray-700">
          Название кофейни *
        </label>
        <input
          type="text"
          id="coffee_shop_name"
          {...register("coffee_shop_name")}
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.coffee_shop_name ? "border-red-500" : "border-gray-300"
          } focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 outline-none transition-all`}
          placeholder="Введите название"
        />
        {errors.coffee_shop_name && <p className="text-red-500 text-sm">{errors.coffee_shop_name.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
          Адрес *
        </label>
        <input
          type="text"
          id="address"
          {...register("address")}
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.address ? "border-red-500" : "border-gray-300"
          } focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 outline-none transition-all`}
          placeholder="Город, улица, дом"
        />
        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="contact_person" className="block text-sm font-semibold text-gray-700">
            Контактное лицо *
          </label>
          <input
            type="text"
            id="contact_person"
            {...register("contact_person")}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.contact_person ? "border-red-500" : "border-gray-300"
            } focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 outline-none transition-all`}
            placeholder="Ваше имя"
          />
          {errors.contact_person && <p className="text-red-500 text-sm">{errors.contact_person.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
            Телефон *
          </label>
          <input
            type="tel"
            id="phone"
            {...register("phone")}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 outline-none transition-all`}
            placeholder="+7 (___) ___-__-__"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="branches" className="block text-sm font-semibold text-gray-700">
          Количество филиалов *
        </label>
        <select
          id="branches"
          {...register("branches")}
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.branches ? "border-red-500" : "border-gray-300"
          } focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 outline-none transition-all`}
        >
          <option value="">Выберите</option>
          <option value="1">1 филиал</option>
          <option value="2-3">2-3 филиала</option>
          <option value="4-10">4-10 филиалов</option>
          <option value="10+">Более 10 филиалов</option>
        </select>
        {errors.branches && <p className="text-red-500 text-sm">{errors.branches.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="social" className="block text-sm font-semibold text-gray-700">
          Соцсеть / сайт (опционально)
        </label>
        <input
          type="text"
          id="social"
          {...register("social")}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 outline-none transition-all"
          placeholder="Instagram, сайт или другая ссылка"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full rounded-full bg-[#FF5C00] hover:bg-[#E54F00] text-white py-6 text-lg font-semibold disabled:opacity-50"
      >
        {isSubmitting ? "Отправка..." : "Отправить заявку"}
      </Button>
    </form>
  )
}

