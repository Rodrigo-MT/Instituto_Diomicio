import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  date: string; // ou Date se preferir, mas alinhe com o DTO

  @Column()
  location: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  imagePath?: string;  // <-- essa propriedade precisa existir
}
