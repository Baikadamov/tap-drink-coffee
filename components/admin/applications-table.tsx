"use client"

import { useState } from "react"
import { Application } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

interface ApplicationsTableProps {
  initialApplications: Application[]
}

const statusLabels: Record<Application["status"], string> = {
  new: "Новая",
  contacted: "Связались",
  approved: "Одобрена",
  rejected: "Отклонена",
}

const statusColors: Record<Application["status"], string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
}

export function ApplicationsTable({ initialApplications }: ApplicationsTableProps) {
  const [applications, setApplications] = useState<Application[]>(initialApplications)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const handleStatusChange = async (id: number, newStatus: Application["status"]) => {
    setUpdatingId(id)

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (response.ok) {
        setApplications((prev) => prev.map((app) => (app.id === id ? data.application : app)))
        toast.success("Статус обновлен")
      } else {
        toast.error("Ошибка", {
          description: data.error || "Не удалось обновить статус",
        })
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Ошибка при обновлении статуса")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту заявку?")) {
      return
    }

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        setApplications((prev) => prev.filter((app) => app.id !== id))
        toast.success("Заявка удалена")
      } else {
        toast.error("Ошибка", {
          description: data.error || "Не удалось удалить заявку",
        })
      }
    } catch (error) {
      console.error("Error deleting application:", error)
      toast.error("Ошибка при удалении заявки")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 md:p-12 text-center">
        <p className="text-gray-500 text-base md:text-lg">Заявок пока нет</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {applications.map((app) => (
          <div key={app.id} className="bg-white rounded-2xl shadow-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-500">ID: {app.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[app.status]}`}
                  >
                    {statusLabels[app.status]}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{app.coffee_shop_name}</h3>
                <p className="text-xs text-gray-500 break-words">{app.address}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(app.id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50 shrink-0 h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium min-w-[70px]">Контакт:</span>
                <span className="text-gray-900">{app.contact_person}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium min-w-[70px]">Телефон:</span>
                <a href={`tel:${app.phone}`} className="text-[#FF5C00] hover:underline">
                  {app.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium min-w-[70px]">Филиалы:</span>
                <span className="text-gray-900">{app.branches}</span>
              </div>
              {app.social && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-medium min-w-[70px]">Соц. сети:</span>
                  <a
                    href={app.social}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF5C00] hover:underline break-all"
                  >
                    {app.social}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium min-w-[70px]">Дата:</span>
                <span className="text-gray-900">{formatDate(app.created_at)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="text-xs text-gray-500 font-medium block mb-1">Изменить статус:</label>
              <select
                value={app.status}
                onChange={(e) => handleStatusChange(app.id, e.target.value as Application["status"])}
                disabled={updatingId === app.id}
                className={`w-full px-3 py-2 rounded-lg text-xs font-semibold ${statusColors[app.status]} border-0 cursor-pointer disabled:opacity-50`}
              >
                <option value="new">{statusLabels.new}</option>
                <option value="contacted">{statusLabels.contacted}</option>
                <option value="approved">{statusLabels.approved}</option>
                <option value="rejected">{statusLabels.rejected}</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Кофейня
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Контакт
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Телефон
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Филиалы
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Дата</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{app.coffee_shop_name}</div>
                    <div className="text-sm text-gray-500">{app.address}</div>
                    {app.social && (
                      <a
                        href={app.social}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#FF5C00] hover:underline"
                      >
                        {app.social}
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.contact_person}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <a href={`tel:${app.phone}`} className="text-[#FF5C00] hover:underline">
                      {app.phone}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.branches}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as Application["status"])}
                      disabled={updatingId === app.id}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[app.status]} border-0 cursor-pointer disabled:opacity-50`}
                    >
                      <option value="new">{statusLabels.new}</option>
                      <option value="contacted">{statusLabels.contacted}</option>
                      <option value="approved">{statusLabels.approved}</option>
                      <option value="rejected">{statusLabels.rejected}</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(app.created_at)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(app.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

