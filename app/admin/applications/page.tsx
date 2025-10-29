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
    <div className="min-h-screen bg-gradient-to-br from-[#EBE6DD] to-[#cfa173] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[#FF5C00] font-bold text-3xl mb-1">
                Tap
                <br />
                Drink
              </div>
              <p className="text-gray-600">Админ-панель</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Вы вошли как</p>
                <p className="font-semibold text-gray-900">{session.username}</p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Всего заявок</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Новые</p>
                <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Связались</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.contacted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Одобрено</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Заявки от кофеен</h2>
          <ApplicationsTable initialApplications={applications} />
        </div>
      </div>
    </div>
  )
}

