import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { applicationQueries } from "@/lib/db"
import { ApplicationsTable } from "@/components/admin/applications-table"
import { LogoutButton } from "@/components/admin/logout-button"
import { BarChart3 } from "lucide-react"

export default async function AdminApplicationsPage() {
  // Проверяем авторизацию
  const session = await getSession()

  if (!session) {
    redirect("/admin/login")
  }

  // Получаем заявки и статистику
  const applications = applicationQueries.getAll()
  const stats = applicationQueries.getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EBE6DD] to-[#cfa173] p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-[#FF5C00] font-bold text-2xl md:text-3xl mb-1">
                Tap
                <br />
                Drink
              </div>
              <p className="text-gray-600 text-sm md:text-base">Админ-панель</p>
            </div>
            <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
              <div className="text-left sm:text-right flex-1 sm:flex-none">
                <p className="text-xs md:text-sm text-gray-600">Вы вошли как</p>
                <p className="font-semibold text-gray-900 text-sm md:text-base">{session.username}</p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-600">Всего заявок</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-blue-600 rounded-full"></div>
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-600">Новые</p>
                <p className="text-lg md:text-2xl font-bold text-blue-600">{stats.new}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-xl flex items-center justify-center shrink-0">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-yellow-600 rounded-full"></div>
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-600">Связались</p>
                <p className="text-lg md:text-2xl font-bold text-yellow-600">{stats.contacted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-600 rounded-full"></div>
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-600">Одобрено</p>
                <p className="text-lg md:text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Заявки от кофеен</h2>
          <ApplicationsTable initialApplications={applications} />
        </div>
      </div>
    </div>
  )
}

