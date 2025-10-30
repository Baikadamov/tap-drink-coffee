import { Button } from "@/components/ui/button"
import {
  MapPin,
  Play,
  DollarSign,
  TrendingUp,
  Settings,
  Clock,
  Percent,
  Coffee,
  FileText,
  Users,
  BarChart3,
  Smartphone,
} from "lucide-react"
import Image from "next/image"
import { NavigationMenu } from "@/components/navigation-menu"
import { CountdownTimer } from "@/components/countdown-timer"
import { ApplicationForm } from "@/components/application-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#EBE6DD]">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-[80vh] lg:h-screen px-6 py-8 lg:px-16 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 lg:mb-16 shrink-0">
          <div className="text-[#FF5C00] font-bold text-3xl lg:text-4xl">
            Tap
            <br />
            Drink
          </div>

          <NavigationMenu />
        </header>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto flex-1 w-full">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight text-balance">
              Для тех,
              <br />
              кто <span className="text-[#FF5C00]">ценит время</span>
            </h1>

            <p className="text-base lg:text-xl text-gray-700 leading-relaxed max-w-xl">
              Закажи кофе в любом любимом месте — и просто забери его по пути. Без ожиданий, без очередей.
            </p>

            <div className="flex items-center gap-3 lg:gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#FF5C00] hover:bg-[#E54F00] text-white px-6 py-5 lg:px-8 lg:py-6 text-base lg:text-lg cursor-pointer"
              >
                <a href="#app">Скачать приложение</a>
              </Button>
              <Button size="lg" className="rounded-full bg-[#FF5C00] hover:bg-[#E54F00] text-white h-12 w-12 lg:h-14 lg:w-14 p-0 shrink-0">
                <Play className="h-5 w-5 lg:h-6 lg:w-6 fill-white" />
              </Button>
            </div>

            {/* Bottom Cards - Hidden on mobile */}
            <div className="hidden lg:flex gap-4 pt-8">
              <div className="relative rounded-3xl overflow-hidden w-64 h-40">
                <Image
                  src="/modern-coffee-shop-interior-with-white-walls.jpg"
                  alt="URBO coffee interior"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-white rounded-full px-4 py-2 text-sm font-medium">
                  URBO coffee
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-full h-40 px-6 bg-white hover:bg-gray-50 border-gray-300 writing-mode-vertical"
                >
                  <span className="[writing-mode:vertical-lr] rotate-180">Travelers</span>
                </Button>
                <Button variant="outline" className="rounded-full h-40 px-6 bg-white hover:bg-gray-50 border-gray-300">
                  <span className="[writing-mode:vertical-lr] rotate-180">TJ Coffee</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Image - Hidden on mobile */}
          <div className="relative hidden lg:block">
            <div className="absolute top-0 right-0 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 z-10">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">URBO coffee</span>
            </div>

            <div className="rounded-[3rem] overflow-hidden aspect-[3/4] relative">
              <Image
                src="/tattoo-am-finger.jpg"
                alt="Coffee cup with latte art"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="px-6 py-16 lg:py-24 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center mb-12 lg:mb-16 text-balance">
            Как это <span className="text-[#FF5C00]">работает</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-[#EBE6DD] rounded-3xl p-6 lg:p-8 space-y-3 lg:space-y-4">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-[#FF5C00] rounded-2xl flex items-center justify-center text-white text-xl lg:text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl lg:text-2xl font-bold">Выбери кофейню</h3>
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">Найди ближайшую кофейню на карте или выбери любимое место</p>
            </div>

            <div className="bg-[#EBE6DD] rounded-3xl p-6 lg:p-8 space-y-3 lg:space-y-4">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-[#FF5C00] rounded-2xl flex items-center justify-center text-white text-xl lg:text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl lg:text-2xl font-bold">Сделай заказ</h3>
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">Выбери напиток из меню и оплати онлайн за пару секунд</p>
            </div>

            <div className="bg-[#EBE6DD] rounded-3xl p-6 lg:p-8 space-y-3 lg:space-y-4">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-[#FF5C00] rounded-2xl flex items-center justify-center text-white text-xl lg:text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl lg:text-2xl font-bold">Забери кофе</h3>
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
                Приходи в удобное время и забери готовый заказ без очереди
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What is TapDrink Section */}
      <section id="what-is" className="px-6 py-16 lg:py-24 lg:px-16 bg-[#EBE6DD]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center mb-10 lg:mb-12 text-balance">
            Что такое <span className="text-[#FF5C00]">TapDrink</span>
          </h2>

          {/* Animation/Infographic */}
          <div className="bg-white rounded-3xl p-6 lg:p-12 mb-6 lg:mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-8 mb-6 lg:mb-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#FF5C00] rounded-full flex items-center justify-center mb-3 lg:mb-4">
                  <span className="text-2xl lg:text-3xl">👤</span>
                </div>
                <p className="text-sm lg:text-base font-semibold">Клиент</p>
              </div>

              <div className="hidden md:block text-[#FF5C00] text-2xl lg:text-3xl">→</div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#FF5C00] rounded-full flex items-center justify-center mb-3 lg:mb-4">
                  <span className="text-2xl lg:text-3xl">📱</span>
                </div>
                <p className="text-sm lg:text-base font-semibold">Приложение</p>
              </div>

              <div className="hidden md:block text-[#FF5C00] text-2xl lg:text-3xl">→</div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#FF5C00] rounded-full flex items-center justify-center mb-3 lg:mb-4">
                  <span className="text-2xl lg:text-3xl">☕</span>
                </div>
                <p className="text-sm lg:text-base font-semibold">Бариста</p>
              </div>

              <div className="hidden md:block text-[#FF5C00] text-2xl lg:text-3xl">→</div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#FF5C00] rounded-full flex items-center justify-center mb-3 lg:mb-4">
                  <span className="text-2xl lg:text-3xl">✅</span>
                </div>
                <p className="text-sm lg:text-base font-semibold">Выдача кофе</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg md:text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-balance">
                TapDrink — это Wolt для кофе, только быстрее и без доставки.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
            <div className="bg-white rounded-3xl p-6 lg:p-8">
              <h3 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4">Для клиентов</h3>
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
                Клиент заказывает заранее, оплачивает онлайн и просто забирает готовый напиток.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-6 lg:p-8">
              <h3 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4">Для кофеен</h3>
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">Вы — получаете оплату, статистику и новых клиентов.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Coffee Shops Connect Section */}
      <section id="for-coffee-shops" className="px-6 py-16 lg:py-24 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center mb-3 lg:mb-4 text-balance">
            Почему кофейни подключаются к <span className="text-[#FF5C00]">TapDrink</span>
          </h2>
          <p className="text-center text-gray-600 text-base lg:text-lg mb-12 lg:mb-16 max-w-3xl mx-auto">
            Реальная бизнес-ценность, цифры и выгода для вашей кофейни
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mb-10 lg:mb-12">
            {/* Card 1 */}
            <div className="bg-[#EBE6DD] rounded-3xl p-6 lg:p-8 space-y-3 lg:space-y-4">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-[#FF5C00] rounded-2xl flex items-center justify-center">
                <DollarSign className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold">0₸ до 1 января</h3>
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">Бесплатное подключение</p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#EBE6DD] rounded-3xl p-6 lg:p-8 space-y-3 lg:space-y-4">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-[#FF5C00] rounded-2xl flex items-center justify-center">
                <TrendingUp className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold">+20% заказов</h3>
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">Клиенты TapDrink приходят сами</p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#EBE6DD] rounded-3xl p-6 lg:p-8 space-y-3 lg:space-y-4">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-[#FF5C00] rounded-2xl flex items-center justify-center">
                <Settings className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold">Без интеграций</h3>
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">Всё работает через обычный смартфон</p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#EBE6DD] rounded-3xl p-6 lg:p-8 space-y-3 lg:space-y-4">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-[#FF5C00] rounded-2xl flex items-center justify-center">
                <Clock className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold">Мгновенные заказы</h3>
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">Заказы поступают в реальном времени</p>
            </div>

            {/* Card 5 */}
            <div className="bg-[#EBE6DD] rounded-3xl p-6 lg:p-8 space-y-3 lg:space-y-4">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-[#FF5C00] rounded-2xl flex items-center justify-center">
                <Percent className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold">Прозрачная комиссия 13%</h3>
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">Никаких скрытых платежей</p>
            </div>

            {/* Card 6 */}
            <div className="bg-[#EBE6DD] rounded-3xl p-6 lg:p-8 space-y-3 lg:space-y-4">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-[#FF5C00] rounded-2xl flex items-center justify-center">
                <Coffee className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold">Поддержка от реальных бариста</h3>
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">Мы понимаем ваш бизнес</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto text-balance">
              TapDrink помогает кофейням продавать больше без лишних расходов и маркетинга.
            </p>
          </div>
        </div>
      </section>

      {/* How TapDrink Works for Coffee Shops Section */}
      <section className="px-6 py-16 lg:py-24 lg:px-16 bg-[#EBE6DD]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center mb-12 lg:mb-16 text-balance">
            Как работает TapDrink <span className="text-[#FF5C00]">для кофейни</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 space-y-4 lg:space-y-6">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#FF5C00] to-[#E54F00] flex items-center justify-center">
                <FileText className="h-16 w-16 lg:h-24 lg:w-24 text-white" />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-3">Оставляете заявку</h3>
                <p className="text-sm lg:text-base text-gray-700 leading-relaxed">Мы связываемся и подключаем кофейню.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 space-y-4 lg:space-y-6">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#FF5C00] to-[#E54F00] flex items-center justify-center">
                <Users className="h-16 w-16 lg:h-24 lg:w-24 text-white" />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-3">Подписывайте договор и подключаетесь</h3>
                <p className="text-sm lg:text-base text-gray-700 leading-relaxed">Клиенты видят вас в приложении и начинают заказывать.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 space-y-4 lg:space-y-6">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#FF5C00] to-[#E54F00] flex items-center justify-center">
                <BarChart3 className="h-16 w-16 lg:h-24 lg:w-24 text-white" />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-3">Продаёте больше без очередей</h3>
                <p className="text-sm lg:text-base text-gray-700 leading-relaxed">Все заказы и отчёты — в одном интерфейсе.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Connection Promotion Section */}
      <section className="px-6 py-16 lg:py-24 lg:px-16 bg-gradient-to-br from-[#cfa173] to-[#6c4e2f] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6 lg:space-y-8 relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-balance">Бесплатное подключение до 1 января</h2>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-5 sm:p-6 lg:p-12 space-y-5 lg:space-y-8">
            <p className="text-lg sm:text-xl lg:text-3xl font-semibold text-balance">
              Успейте подключиться к TapDrink до 1 января и получите:
            </p>

            <ul className="text-left max-w-2xl mx-auto space-y-2 sm:space-y-3 lg:space-y-4 text-sm sm:text-base lg:text-xl">
              <li className="flex items-start gap-2 lg:gap-3">
                <span className="text-lg sm:text-xl lg:text-2xl">•</span>
                <span>Бесплатное подключение</span>
              </li>
              <li className="flex items-start gap-2 lg:gap-3">
                <span className="text-lg sm:text-xl lg:text-2xl">•</span>
                <span>Персональную настройку</span>
              </li>
              <li className="flex items-start gap-2 lg:gap-3">
                <span className="text-lg sm:text-xl lg:text-2xl">•</span>
                <span>Помощь в продвижении вашей кофейни</span>
              </li>
            </ul>

            {/* Countdown Timer */}
            <div className="flex justify-center">
              <CountdownTimer />
            </div>

            <div className="pt-2">
              <a href="#application">
                <Button
                  size="lg"
                  className="rounded-2xl bg-white text-[#6c4e2f] hover:bg-gray-100 px-5 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-6 text-sm sm:text-base lg:text-xl font-bold shadow-2xl w-full sm:w-auto"
                >
                  Подключиться бесплатно
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
      </section>

      {/* App Interface Showcase Section */}
      <section id="app" className="px-6 py-16 lg:py-24 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 lg:mb-6 text-balance">
              Приложение <span className="text-[#FF5C00]">изнутри</span>
            </h2>
            <p className="text-lg md:text-xl lg:text-3xl text-gray-600 font-light">Интуитивно. Просто. Современно.</p>
          </div>

          {/* App Screenshots Carousel */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {/* Screenshot 1 - Main Screen */}
            <div className="bg-[#EBE6DD] rounded-3xl p-5 lg:p-6 space-y-3 lg:space-y-4">
              <div className="aspect-[9/16] rounded-2xl relative overflow-hidden">
                <Image
                  src="/1.jpg"
                  alt="TapDrink главный экран"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center text-sm lg:text-base font-semibold">Главный экран с кофейнями</p>
            </div>

            {/* Screenshot 2 - Digital Service Tools */}
            <div className="bg-[#EBE6DD] rounded-3xl p-5 lg:p-6 space-y-3 lg:space-y-4">
              <div className="aspect-[9/16] rounded-2xl relative overflow-hidden">
                <Image
                  src="/3.jpg"
                  alt="TapDrink инструменты обслуживания"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center text-sm lg:text-base font-semibold">Карточка заказа</p>
            </div>

            {/* Screenshot 3 - Payment */}
            <div className="bg-[#EBE6DD] rounded-3xl p-5 lg:p-6 space-y-3 lg:space-y-4">
              <div className="aspect-[9/16] rounded-2xl relative overflow-hidden">
                <Image
                  src="/4.jpg"
                  alt="TapDrink экран оплаты"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center text-sm lg:text-base font-semibold">Экран оплаты</p>
            </div>

            {/* Screenshot 4 - Admin Panel */}
            <div className="bg-[#EBE6DD] rounded-3xl p-5 lg:p-6 space-y-3 lg:space-y-4">
              <div className="aspect-[9/16] rounded-2xl relative overflow-hidden">
                <Image
                  src="/3.jpg"
                  alt="TapDrink админка кофейни"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center text-sm lg:text-base font-semibold">Экран кофейни (админка)</p>
            </div>
          </div>

          {/* Product Images */}
          <div className="mt-12 lg:mt-16 grid md:grid-cols-2 gap-6 lg:gap-8">
            <div className="rounded-3xl overflow-hidden aspect-[4/3]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D0%A1%D1%82%D0%B0%D0%BA%D0%B0%D0%BD-j6xaEkePssCVlkEKZMWEXZGppB0mxk.jpg"
                alt="TapDrink branded coffee cups"
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden aspect-[4/3]">
              <Image
                src="/secondpic.png"
                alt="TapDrink order pickup stand"
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="application" className="px-6 py-16 lg:py-24 lg:px-16 bg-[#EBE6DD]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 lg:mb-6 text-balance">
              Оставьте <span className="text-[#FF5C00]">заявку</span>
            </h2>
            <p className="text-base lg:text-lg text-gray-600">Мы свяжемся в течение 24 часов и покажем, как TapDrink работает.</p>
          </div>

          <ApplicationForm />
        </div>
      </section>

      {/* Contacts Section */}
      <section id="contacts" className="px-6 py-16 lg:py-24 lg:px-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center mb-12 lg:mb-16 text-balance">
            <span className="text-[#FF5C00]">Контакты</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-[#EBE6DD] rounded-3xl p-6 lg:p-8 space-y-5 lg:space-y-6">
              <div className="flex items-start gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#FF5C00] rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg lg:text-xl mb-1 lg:mb-2">Адрес</h3>
                  <p className="text-sm lg:text-base text-gray-700">Алматы, Казахстан</p>
                </div>
              </div>

              <div className="flex items-start gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#FF5C00] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Smartphone className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg lg:text-xl mb-1 lg:mb-2">WhatsApp</h3>
                  <a href="tel:+7XXXXXXXXXX" className="text-sm lg:text-base text-gray-700 hover:text-[#FF5C00] transition-colors">
                    +7 XXX XXX XX XX
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-[#EBE6DD] rounded-3xl p-6 lg:p-8 space-y-5 lg:space-y-6">
              <div className="flex items-start gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#FF5C00] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg lg:text-xl">@</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-lg lg:text-xl mb-1 lg:mb-2">Email</h3>
                  <a href="mailto:hello@tapdrink.app" className="text-sm lg:text-base text-gray-700 hover:text-[#FF5C00] transition-colors break-all">
                    hello@tapdrink.app
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#FF5C00] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-lg lg:text-xl mb-1 lg:mb-2">Социальные сети</h3>
                  <div className="flex flex-wrap gap-2 lg:gap-3 text-sm lg:text-base">
                    <a href="#" className="text-gray-700 hover:text-[#FF5C00] transition-colors">
                      Instagram
                    </a>
                    <span className="text-gray-400">•</span>
                    <a href="#" className="text-gray-700 hover:text-[#FF5C00] transition-colors">
                      Telegram
                    </a>
                    <span className="text-gray-400">•</span>
                    <a href="#" className="text-gray-700 hover:text-[#FF5C00] transition-colors">
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="px-6 py-16 lg:py-24 lg:px-16 bg-[#EBE6DD]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center mb-12 lg:mb-16 text-balance">
            Часто задаваемые <span className="text-[#FF5C00]">вопросы</span>
          </h2>

          <div className="space-y-3 lg:space-y-4">
            <details className="bg-white rounded-2xl p-5 lg:p-6 group">
              <summary className="font-bold text-base lg:text-lg cursor-pointer list-none flex items-center justify-between">
                <span>Нужно ли платить за подключение?</span>
                <span className="text-[#FF5C00] text-xl lg:text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 lg:mt-4 text-sm lg:text-base text-gray-700 leading-relaxed">
                До 1 января подключение полностью бесплатное. После этой даты стоимость подключения составит 50 000 ₸.
              </p>
            </details>

            <details className="bg-white rounded-2xl p-5 lg:p-6 group">
              <summary className="font-bold text-base lg:text-lg cursor-pointer list-none flex items-center justify-between">
                <span>Какой процент комиссия?</span>
                <span className="text-[#FF5C00] text-xl lg:text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 lg:mt-4 text-sm lg:text-base text-gray-700 leading-relaxed">
                Комиссия TapDrink составляет 13% от суммы заказа. Никаких скрытых платежей или дополнительных сборов.
              </p>
            </details>

            <details className="bg-white rounded-2xl p-5 lg:p-6 group">
              <summary className="font-bold text-base lg:text-lg cursor-pointer list-none flex items-center justify-between">
                <span>Как быстро всё настроим?</span>
                <span className="text-[#FF5C00] text-xl lg:text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 lg:mt-4 text-sm lg:text-base text-gray-700 leading-relaxed">
                Подключение занимает 1-2 рабочих дня. Мы настроим всё за вас: меню, фотографии, описания и интеграцию с
                вашей системой.
              </p>
            </details>

            <details className="bg-white rounded-2xl p-5 lg:p-6 group">
              <summary className="font-bold text-base lg:text-lg cursor-pointer list-none flex items-center justify-between">
                <span>Нужно ли оборудование?</span>
                <span className="text-[#FF5C00] text-xl lg:text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 lg:mt-4 text-sm lg:text-base text-gray-700 leading-relaxed">
                Нет, специальное оборудование не требуется. Всё работает через обычный смартфон или планшет. Мы
                предоставим вам доступ к админ-панели.
              </p>
            </details>

            <details className="bg-white rounded-2xl p-5 lg:p-6 group">
              <summary className="font-bold text-base lg:text-lg cursor-pointer list-none flex items-center justify-between">
                <span>Можно ли работать без кассы?</span>
                <span className="text-[#FF5C00] text-xl lg:text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 lg:mt-4 text-sm lg:text-base text-gray-700 leading-relaxed">
                Да, TapDrink полностью совместим с любыми кассовыми системами. Мы также можем работать без интеграции с
                кассой — все заказы будут отображаться в нашей админ-панели.
              </p>
            </details>

            <details className="bg-white rounded-2xl p-5 lg:p-6 group">
              <summary className="font-bold text-base lg:text-lg cursor-pointer list-none flex items-center justify-between">
                <span>Когда я получаю деньги?</span>
                <span className="text-[#FF5C00] text-xl lg:text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 lg:mt-4 text-sm lg:text-base text-gray-700 leading-relaxed">
                Выплаты производятся еженедельно на ваш расчётный счёт. Вы всегда можете отслеживать статистику продаж и
                выплат в личном кабинете.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="app" className="px-6 py-16 lg:py-24 lg:px-16 bg-[#FF5C00] text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 lg:space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-balance">Начни экономить время уже сегодня</h2>
          <p className="text-base md:text-lg lg:text-xl leading-relaxed opacity-90">Скачай приложение и получи первый кофе со скидкой 50%</p>
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white text-[#FF5C00] hover:bg-gray-100 px-6 py-5 lg:px-8 lg:py-6 text-base lg:text-lg font-semibold cursor-pointer"
            >
              <a href="https://apps.apple.com/kz/app/tapdrink/id6746508898" target="_blank" rel="noopener noreferrer">
                App Store
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white text-[#FF5C00] hover:bg-gray-100 px-6 py-5 lg:px-8 lg:py-6 text-base lg:text-lg font-semibold cursor-pointer"
            >
              <a
                href="https://play.google.com/store/apps/details?id=com.onedrink.app&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Play
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 lg:py-12 lg:px-16 bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 lg:gap-8 mb-6 lg:mb-8">
            <div>
              <div className="text-[#FF5C00] font-bold text-xl lg:text-2xl mb-3 lg:mb-4">
                Tap
                <br />
                Drink
              </div>
              <p className="text-gray-400 text-xs lg:text-sm">Кофе на вынос без очередей</p>
            </div>

            <div>
              <h4 className="font-bold text-sm lg:text-base mb-3 lg:mb-4">Компания</h4>
              <ul className="space-y-1.5 lg:space-y-2 text-gray-400 text-xs lg:text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    О нас
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Вакансии
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Партнёрам
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm lg:text-base mb-3 lg:mb-4">Поддержка</h4>
              <ul className="space-y-1.5 lg:space-y-2 text-gray-400 text-xs lg:text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Помощь
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Контакты
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm lg:text-base mb-3 lg:mb-4">Социальные сети</h4>
              <ul className="space-y-1.5 lg:space-y-2 text-gray-400 text-xs lg:text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    VK
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 lg:pt-8 text-center text-gray-400 text-xs lg:text-sm">
            © 2025 Tap Drink. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  )
}
