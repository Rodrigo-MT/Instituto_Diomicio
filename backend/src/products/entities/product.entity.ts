import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ nullable: true, type: 'float' })
  preco?: number;

  @Column()
  descricao: string;

  @Column({ nullable: true })
  imagePath?: string;  // caminho da imagem armazenada localmente
}
