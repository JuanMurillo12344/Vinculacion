import { DataSource } from 'typeorm'
import { Vehicle } from './entities/Vehicle'
import { Reservation } from './entities/Reservation'
import { Customer } from './entities/Customer'

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Para Neon
  },
  synchronize: false, // DESACTIVADO - usar SQL manual
  logging: false, // Desactivar logging para no sobrecargar
  entities: [Vehicle, Reservation, Customer],
  migrations: [],
  subscribers: [],
  // Configuración de pool de conexiones
  extra: {
    max: 10, // Máximo 10 conexiones simultáneas
    connectionTimeoutMillis: 60000, // 60 segundos timeout
  },
})

export async function initializeDatabase() {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize()
      console.log('✅ Base de datos conectada')
    } catch (error) {
      console.error('❌ Error al conectar con la base de datos:', error)
      throw error
    }
  }
  return AppDataSource
}

export async function getDataSource() {
  if (!AppDataSource.isInitialized) {
    await initializeDatabase()
  }
  return AppDataSource
}
