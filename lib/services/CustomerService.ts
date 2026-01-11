import { getDataSource } from '../database'
import { Customer } from '../entities/Customer'

export interface CreateCustomerDTO {
  name: string
  email: string
  phone: string
  address?: string
  city?: string
  country?: string
}

export class CustomerService {
  async getAll(): Promise<Customer[]> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Customer)
    return await repository.find({
      order: { createdAt: 'DESC' }
    })
  }

  async getById(id: number): Promise<Customer | null> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Customer)
    return await repository.findOne({ where: { id } })
  }

  async getByEmail(email: string): Promise<Customer | null> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Customer)
    return await repository.findOne({ where: { email } })
  }

  async create(data: CreateCustomerDTO): Promise<Customer> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Customer)
    const customer = repository.create(data)
    return await repository.save(customer)
  }

  async update(id: number, data: Partial<CreateCustomerDTO>): Promise<Customer | null> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Customer)
    
    const customer = await repository.findOne({ where: { id } })
    if (!customer) return null

    Object.assign(customer, data)
    return await repository.save(customer)
  }

  async delete(id: number): Promise<boolean> {
    const dataSource = await getDataSource()
    const repository = dataSource.getRepository(Customer)
    const result = await repository.delete(id)
    return (result.affected ?? 0) > 0
  }
}

export const customerService = new CustomerService()
