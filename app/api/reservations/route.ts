import { NextRequest, NextResponse } from 'next/server'
import { reservationService } from '@/lib/services/ReservationService'

// GET /api/reservations - Obtener todas las reservas
// GET /api/reservations?id=1 - Obtener una reserva por ID
// GET /api/reservations?status=activa - Obtener reservas por estado
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const status = searchParams.get('status')

    if (id) {
      const reservation = await reservationService.getById(parseInt(id))
      if (!reservation) {
        return NextResponse.json(
          { error: 'Reserva no encontrada' },
          { status: 404 }
        )
      }
      return NextResponse.json(reservation)
    }

    if (status) {
      const reservations = await reservationService.getByStatus(status)
      return NextResponse.json(reservations)
    }

    const reservations = await reservationService.getAll()
    return NextResponse.json(reservations)
  } catch (error) {
    console.error('Error in GET /api/reservations:', error)
    return NextResponse.json(
      { error: 'Error al obtener reservas' },
      { status: 500 }
    )
  }
}

// POST /api/reservations - Crear una nueva reserva
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verificar disponibilidad del vehículo
    const isAvailable = await reservationService.checkAvailability(
      body.vehicleId,
      body.startDate,
      body.endDate
    )

    if (!isAvailable) {
      return NextResponse.json(
        { error: 'El vehículo no está disponible en esas fechas' },
        { status: 400 }
      )
    }

    const reservation = await reservationService.create(body)
    return NextResponse.json(reservation, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/reservations:', error)
    return NextResponse.json(
      { error: 'Error al crear reserva' },
      { status: 500 }
    )
  }
}

// PUT /api/reservations?id=1 - Actualizar una reserva
export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de la reserva requerido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const reservation = await reservationService.update(parseInt(id), body)
    
    if (!reservation) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Error in PUT /api/reservations:', error)
    return NextResponse.json(
      { error: 'Error al actualizar reserva' },
      { status: 500 }
    )
  }
}

// DELETE /api/reservations?id=1 - Eliminar una reserva
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de la reserva requerido' },
        { status: 400 }
      )
    }

    const deleted = await reservationService.delete(parseInt(id))
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Reserva eliminada exitosamente' })
  } catch (error) {
    console.error('Error in DELETE /api/reservations:', error)
    return NextResponse.json(
      { error: 'Error al eliminar reserva' },
      { status: 500 }
    )
  }
}
