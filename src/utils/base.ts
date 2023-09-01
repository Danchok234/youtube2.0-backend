import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export abstract class Base {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
