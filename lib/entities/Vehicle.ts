import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 50 })
  category: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'int' })
  year: number

  @Column({ type: 'varchar', length: 50 })
  color: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number

  @Column({ type: 'int' })
  passengers: number

  @Column({ type: 'int' })
  luggage: number

  @Column({ type: 'varchar', length: 50 })
  transmission: string

  @Column({ type: 'varchar', length: 50 })
  fuel: string

  @Column({ type: 'int' })
  doors: number

  @Column({ type: 'text' })
  features: string

  @Column({ type: 'varchar', length: 500 })
  image: string

  @Column({ type: 'boolean', default: true })
  available: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => require('./Reservation').Reservation, (reservation: any) => reservation.vehicle)
  reservations: any[]
}
