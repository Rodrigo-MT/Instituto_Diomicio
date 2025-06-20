// src/notices/entities/notice.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column()
  link: string;

  @Column()
  source: string;

  @Column({ default: true })  // Adicionando a coluna 'predefined' com valor padrão 'true'
  predefined: boolean;

  @Column()
  order: number;
}
