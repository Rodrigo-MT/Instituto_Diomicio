import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Newsletter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string; // armazenado criptografado

  @CreateDateColumn()
  subscribedAt: Date;
}
