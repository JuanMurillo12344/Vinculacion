"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calendar, ArrowLeft, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ReservaPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { toast } = useToast()
  const [vehicle, setVehicle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [days, setDays] = useState(0)
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    license: "",
    pickupTime: "",
    returnTime: ""
  })

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`/api/vehicles?id=${resolvedParams.id}`)
        if (response.ok) {
          const data = await response.json()
          setVehicle(data)
        } else {
          setVehicle(null)
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error)
        setVehicle(null)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicle()
  }, [resolvedParams.id])

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return <div>Vehículo no encontrado</div>
  }

  const calculateDays = (pickup: string, returnD: string) => {
    if (pickup && returnD) {
      const start = new Date(pickup)
      const end = new Date(returnD)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setDays(diffDays)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const customerName = `${formData.firstName} ${formData.lastName}`
      const total = vehicle.price * days

      const reservationData = {
        customer: customerName,
        email: formData.email,
        phone: formData.phone,
        vehicleId: parseInt(resolvedParams.id),
        startDate: new Date(`${pickupDate}T${formData.pickupTime}`).toISOString(),
        endDate: new Date(`${returnDate}T${formData.returnTime}`).toISOString(),
        pickupTime: formData.pickupTime,
        returnTime: formData.returnTime,
        status: 'pendiente',
        total: total
      }

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      })

      if (response.ok) {
        const reservation = await response.json()
        toast({
          title: "Reserva creada",
          description: "Tu reserva ha sido registrada exitosamente.",
        })
        router.push(`/pago/${vehicle.id}?days=${days}&reservationId=${reservation.id}`)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear la reserva')
      }
    } catch (error: any) {
      console.error('Error creating reservation:', error)
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la reserva. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const total = vehicle.price * days

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6" asChild>
            <Link href={`/vehiculo/${vehicle.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Volver al vehículo
            </Link>
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" aria-hidden="true" />
                  Detalles de la Reserva
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Información Personal</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input 
                          id="firstName" 
                          placeholder="Juan" 
                          required 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Pérez" 
                          required 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="juan@ejemplo.com" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+593 96 778 1785" 
                        required 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="license">Número de Licencia</Label>
                      <Input 
                        id="license" 
                        placeholder="EC-1234567890" 
                        required 
                        value={formData.license}
                        onChange={(e) => setFormData({...formData, license: e.target.value})}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold">Fechas de Renta</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pickupDate">Fecha de Recogida</Label>
                        <Input
                          id="pickupDate"
                          type="date"
                          value={pickupDate}
                          onChange={(e) => {
                            setPickupDate(e.target.value)
                            calculateDays(e.target.value, returnDate)
                          }}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="returnDate">Fecha de Devolución</Label>
                        <Input
                          id="returnDate"
                          type="date"
                          value={returnDate}
                          onChange={(e) => {
                            setReturnDate(e.target.value)
                            calculateDays(pickupDate, e.target.value)
                          }}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pickupTime">Hora de Recogida</Label>
                        <Input 
                          id="pickupTime" 
                          type="time" 
                          required 
                          value={formData.pickupTime}
                          onChange={(e) => setFormData({...formData, pickupTime: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="returnTime">Hora de Devolución</Label>
                        <Input 
                          id="returnTime" 
                          type="time" 
                          required 
                          value={formData.returnTime}
                          onChange={(e) => setFormData({...formData, returnTime: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    disabled={days === 0 || isSubmitting}
                  >
                    <CreditCard className="mr-2 h-4 w-4" aria-hidden="true" />
                    {isSubmitting ? 'Procesando...' : 'Continuar al Pago'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Resumen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Vehículo</p>
                    <p className="font-semibold">{vehicle.name}</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Precio por día</span>
                      <span className="font-medium">${vehicle.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Número de días</span>
                      <span className="font-medium">{days}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">${total}</span>
                      <p className="text-xs text-muted-foreground">USD</p>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      El precio incluye seguro completo, kilometraje ilimitado y asistencia en carretera 24/7
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
