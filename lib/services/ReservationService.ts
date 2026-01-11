import { Between, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { getDataSource } from '../database'
import { Reservation } from '../entities/Reservation'

export interface CreateReservationDTO {
  customer: string
  email: string
  phone: string
  vehicleId: number
  startDate: Date | string
  endDate: Date | string
  pickupTime: string
  returnTime: string
  total: number
  status?: string
}

export class ReservationService {
  async getAll(): Promise<Reservation[]> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Reservation)
    return await repository.find({
      relations: ['vehicle'],
      order: { createdAt: 'DESC' }
    })
  }

  async getById(id: number): Promise<Reservation | null> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Reservation)
    return await repository.findOne({
      where: { id },
      relations: ['vehicle']
    })
  }

  async getByStatus(status: string): Promise<Reservation[]> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Reservation)
    return await repository.find({
      where: { status },
      relations: ['vehicle'],
      order: { startDate: 'DESC' }
    })
  }

  async getByVehicle(vehicleId: number): Promise<Reservation[]> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Reservation)
    return await repository.find({
      where: { vehicleId },
      relations: ['vehicle'],
      order: { startDate: 'DESC' }
    })
  }

  async create(data: CreateReservationDTO): Promise<Reservation> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Reservation)
    
    const reservation = repository.create({
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: data.status || 'pendiente'
    })
    
    return await repository.save(reservation)
  }

  async update(id: number, data: Partial<CreateReservationDTO>): Promise<Reservation | null> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Reservation)
    
    const reservation = await repository.findOne({ where: { id } })
    if (!reservation) return null

    if (data.startDate) {
      reservation.startDate = new Date(data.startDate)
    }
    if (data.endDate) {
      reservation.endDate = new Date(data.endDate)
    }

    Object.assign(reservation, data)
    return await repository.save(reservation)
  }

  async delete(id: number): Promise<boolean> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Reservation)
    const result = await repository.delete(id)
    return (result.affected ?? 0) > 0
  }

  async checkAvailability(
    vehicleId: number,
    startDate: Date | string,
    endDate: Date | string
  ): Promise<boolean> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Reservation)
    
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Buscar reservas que se solapen con las fechas solicitadas
    const count = await repository
      .createQueryBuilder('reservation')
      .where('reservation.vehicleId = :vehicleId', { vehicleId })
      .andWhere('reservation.status IN (:...statuses)', { statuses: ['pendiente', 'activa'] })
      .andWhere(
        '(reservation.startDate <= :end AND reservation.endDate >= :start)',
        { start, end }
      )
      .getCount()

    return count === 0
  }
}

export const reservationService = new ReservationService()
