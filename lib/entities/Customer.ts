import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string

  @Column({ type: 'varchar', length: 50 })
  phone: string

  @Column({ type: 'text', nullable: true })
  address: string | null

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
