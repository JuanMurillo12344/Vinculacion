import { NextRequest, NextResponse } from 'next/server'
import { customerService } from '@/lib/services/CustomerService'

// GET /api/customers - Obtener todos los clientes
// GET /api/customers?id=1 - Obtener un cliente por ID
// GET /api/customers?email=email@example.com - Obtener un cliente por email
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const email = searchParams.get('email')

    if (id) {
      const customer = await customerService.getById(parseInt(id))
      if (!customer) {
        return NextResponse.json(
          { error: 'Cliente no encontrado' },
          { status: 404 }
        )
      }
      return NextResponse.json(customer)
    }

    if (email) {
      const customer = await customerService.getByEmail(email)
      if (!customer) {
        return NextResponse.json(
          { error: 'Cliente no encontrado' },
          { status: 404 }
        )
      }
      return NextResponse.json(customer)
    }

    const customers = await customerService.getAll()
    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error in GET /api/customers:', error)
    return NextResponse.json(
      { error: 'Error al obtener clientes' },
      { status: 500 }
    )
  }
}

// POST /api/customers - Crear un nuevo cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const customer = await customerService.create(body)
    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/customers:', error)
    return NextResponse.json(
      { error: 'Error al crear cliente' },
      { status: 500 }
    )
  }
}

// PUT /api/customers?id=1 - Actualizar un cliente
export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID del cliente requerido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const customer = await customerService.update(parseInt(id), body)
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error in PUT /api/customers:', error)
    return NextResponse.json(
      { error: 'Error al actualizar cliente' },
      { status: 500 }
    )
  }
}

// DELETE /api/customers?id=1 - Eliminar un cliente
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID del cliente requerido' },
        { status: 400 }
      )
    }

    const deleted = await customerService.delete(parseInt(id))
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Cliente eliminado exitosamente' })
  } catch (error) {
    console.error('Error in DELETE /api/customers:', error)
    return NextResponse.json(
      { error: 'Error al eliminar cliente' },
      { status: 500 }
    )
  }
}
