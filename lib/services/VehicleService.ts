import { getDataSource } from '../database'
import { Vehicle } from '../entities/Vehicle'

export interface CreateVehicleDTO {
  name: string
  category: string
  description: string
  year: number
  color: string
  price: number
  passengers: number
  luggage: number
  transmission: string
  fuel: string
  doors: number
  features: string
  image: string
  available?: boolean
}

export class VehicleService {
  async getAll(): Promise<Vehicle[]> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Vehicle)
    return await repository.find({
      order: { createdAt: 'DESC' }
    })
  }

  async getById(id: number): Promise<Vehicle | null> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Vehicle)
    return await repository.findOne({ where: { id } })
  }

  async getAvailable(): Promise<Vehicle[]> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Vehicle)
    return await repository.find({
      where: { available: true },
      order: { price: 'ASC' }
    })
  }

  async getByCategory(category: string): Promise<Vehicle[]> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Vehicle)
    return await repository.find({
      where: { category, available: true },
      order: { price: 'ASC' }
    })
  }

  async create(data: CreateVehicleDTO): Promise<Vehicle> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Vehicle)
    const vehicle = repository.create(data)
    return await repository.save(vehicle)
  }

  async update(id: number, data: Partial<CreateVehicleDTO>): Promise<Vehicle | null> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Vehicle)
    
    const vehicle = await repository.findOne({ where: { id } })
    if (!vehicle) return null

    Object.assign(vehicle, data)
    return await repository.save(vehicle)
  }

  async delete(id: number): Promise<boolean> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Vehicle)
    const result = await repository.delete(id)
    return (result.affected ?? 0) > 0
  }
}

export const vehicleService = new VehicleService()
