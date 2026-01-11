import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  customer: string

  @Column({ type: 'varchar', length: 255 })
  email: string

  @Column({ type: 'varchar', length: 50 })
  phone: string

  @Column({ name: 'vehicle_id', type: 'int' })
  vehicleId: number

  @ManyToOne(() => require('./Vehicle').Vehicle, (vehicle: any) => vehicle.reservations)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: any

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date

  @Column({ name: 'end_date', type: 'timestamp' })
  endDate: Date

  @Column({ name: 'pickup_time', type: 'varchar', length: 10 })
  pickupTime: string

  @Column({ name: 'return_time', type: 'varchar', length: 10 })
  returnTime: string

  @Column({ type: 'varchar', length: 50, default: 'pendiente' })
  status: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
