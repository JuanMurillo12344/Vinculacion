import { NextRequest, NextResponse } from 'next/server'
import { vehicleService } from '@/lib/services/VehicleService'

// GET /api/vehicles - Obtener todos los vehículos
// GET /api/vehicles?id=1 - Obtener un vehículo por ID
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (id) {
      const vehicle = await vehicleService.getById(parseInt(id))
      if (!vehicle) {
        return NextResponse.json(
          { error: 'Vehículo no encontrado' },
          { status: 404 }
        )
      }
      return NextResponse.json(vehicle)
    }

    const vehicles = await vehicleService.getAll()
    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('Error in GET /api/vehicles:', error)
    return NextResponse.json(
      { error: 'Error al obtener vehículos' },
      { status: 500 }
    )
  }
}

// POST /api/vehicles - Crear un nuevo vehículo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const vehicle = await vehicleService.create(body)
    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/vehicles:', error)
    return NextResponse.json(
      { error: 'Error al crear vehículo' },
      { status: 500 }
    )
  }
}

// PUT /api/vehicles?id=1 - Actualizar un vehículo
export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID del vehículo requerido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const vehicle = await vehicleService.update(parseInt(id), body)
    
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error in PUT /api/vehicles:', error)
    return NextResponse.json(
      { error: 'Error al actualizar vehículo' },
      { status: 500 }
    )
  }
}

// DELETE /api/vehicles?id=1 - Eliminar un vehículo
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID del vehículo requerido' },
        { status: 400 }
      )
    }

    const deleted = await vehicleService.delete(parseInt(id))
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Vehículo eliminado exitosamente' })
  } catch (error: any) {
    console.error('Error in DELETE /api/vehicles:', error)
    
    // Verificar si es un error de foreign key (vehículo tiene reservas)
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
      return NextResponse.json(
        { error: 'No se puede eliminar el vehículo porque tiene reservas asociadas. Cancela las reservas primero.' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al eliminar vehículo' },
      { status: 500 }
    )
  }
}
