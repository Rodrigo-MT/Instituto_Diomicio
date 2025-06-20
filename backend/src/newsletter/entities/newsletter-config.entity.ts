import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NewsletterConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string; // criptografado

  @Column()
  password: string;  // criptografada
}
