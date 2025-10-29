"use client"

import { useEffect, useState } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Устанавливаем дату окончания - 1 января 2026
    const targetDate = new Date("2026-01-01T00:00:00").getTime()

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    // Вычисляем сразу
    calculateTimeLeft()

    // Обновляем каждую секунду
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatNumber = (num: number) => String(num).padStart(2, "0")

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 sm:p-6 inline-block">
      <div className="flex gap-2 sm:gap-4 lg:gap-6 items-center justify-center">
        <div className="text-center">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{formatNumber(timeLeft.days)}</div>
          <div className="text-xs sm:text-sm opacity-90 mt-1">Дней</div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold">:</div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{formatNumber(timeLeft.hours)}</div>
          <div className="text-xs sm:text-sm opacity-90 mt-1">Часов</div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold">:</div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{formatNumber(timeLeft.minutes)}</div>
          <div className="text-xs sm:text-sm opacity-90 mt-1">Минут</div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold">:</div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{formatNumber(timeLeft.seconds)}</div>
          <div className="text-xs sm:text-sm opacity-90 mt-1">Секунд</div>
        </div>
      </div>
    </div>
  )
}

