"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Eye, Edit, Trash2, Phone, Mail } from "lucide-react"

interface Reservation {
  id: number
  customer: string
  email: string
  phone: string
  vehicle: {
    id: number
    name: string
  }
  startDate: string
  endDate: string
  status: string
  total: number
  pickupTime: string
  returnTime: string
}

export default function ReservasAdminPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todas")

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/reservations')
      
      if (!response.ok) {
        throw new Error('Error al cargar reservas')
      }
      
      const data = await response.json()
      setReservations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (reservationId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/reservations?id=${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await fetchReservations()
      } else {
        throw new Error('Error al actualizar estado')
      }
    } catch (err) {
      console.error('Error:', err)
      alert('No se pudo actualizar el estado de la reserva')
    }
  }

  const filteredReservations = reservations.filter((reservation) => {
    const vehicleName = reservation.vehicle?.name || ''
    const matchesSearch =
      reservation.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicleName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todas" || reservation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Volver al Dashboard
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Gestión de Reservas</CardTitle>
            <p className="text-muted-foreground">Administra todas las reservas de tus vehículos</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  placeholder="Buscar por cliente o vehículo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="activa">Activas</SelectItem>
                  <SelectItem value="pendiente">Pendientes</SelectItem>
                  <SelectItem value="completada">Completadas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Cargando reservas...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-8">
                <p className="text-destructive mb-4">Error: {error}</p>
                <Button onClick={fetchReservations}>Reintentar</Button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredReservations.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron reservas</p>
              </div>
            )}

            {/* Reservations List */}
            {!loading && !error && filteredReservations.length > 0 && (
              <div className="space-y-4">
              {filteredReservations.map((reservation) => (
                <Card key={reservation.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-lg">{reservation.customer}</h3>
                            <p className="text-sm text-muted-foreground">{reservation.vehicle?.name || 'Vehículo desconocido'}</p>
                          </div>
                          <Select
                            value={reservation.status}
                            onValueChange={(value) => handleStatusChange(reservation.id, value)}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pendiente">Pendiente</SelectItem>
                              <SelectItem value="activa">Activa</SelectItem>
                              <SelectItem value="completada">Completada</SelectItem>
                              <SelectItem value="cancelada">Cancelada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" aria-hidden="true" />
                            <a href={`mailto:${reservation.email}`} className="hover:text-primary">
                              {reservation.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" aria-hidden="true" />
                            <a href={`tel:${reservation.phone}`} className="hover:text-primary">
                              {reservation.phone}
                            </a>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Recogida: </span>
                            <span className="font-medium">
                              {reservation.startDate} {reservation.pickupTime}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Devolución: </span>
                            <span className="font-medium">
                              {reservation.endDate} {reservation.returnTime}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total: </span>
                            <span className="font-semibold text-primary">${reservation.total}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex lg:flex-col gap-2">
                        <Button variant="outline" size="sm" className="flex-1 lg:flex-none bg-transparent">
                          <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 lg:flex-none bg-transparent">
                          <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 lg:flex-none text-destructive hover:text-destructive bg-transparent"
                        >
                          <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
