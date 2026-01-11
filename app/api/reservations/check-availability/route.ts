import { NextRequest, NextResponse } from 'next/server'
import { reservationService } from '@/lib/services/ReservationService'

// POST /api/reservations/check-availability
// Verificar disponibilidad de un vehículo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vehicleId, startDate, endDate } = body

    if (!vehicleId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'vehicleId, startDate y endDate son requeridos' },
        { status: 400 }
      )
    }

    const isAvailable = await reservationService.checkAvailability(
      parseInt(vehicleId),
      startDate,
      endDate
    )

    return NextResponse.json({ available: isAvailable })
  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json(
      { error: 'Error al verificar disponibilidad' },
      { status: 500 }
    )
  }
}
