// src/partners/partners.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Partner } from './entities/partners.entity';
import { CreatePartnerDto } from './dto/create-partners.dto';
import { UpdatePartnerDto } from './dto/update-partners.dto';
import { OnModuleInit } from '@nestjs/common';

@Injectable()
export class PartnersService implements OnModuleInit {
  private partners: Partner[] = [];
  private nextId = 1;

  onModuleInit() {
    // Adiciona o parceiro ESUCRI ao iniciar
    if (!this.partners.find(p => p.nome === 'ESUCRI')) {
      this.partners.push({
        id: this.nextId++,
        nome: 'ESUCRI',
        logo: 'https://esucri.com.br/img/layout/header/esucri.png',
        descricao: 'A ESUCRI é uma instituição de ensino superior comprometida com a formação de profissionais qualificados. Como parceira, ofereceu a criação completa deste website além de outras formas de suporte para nossa instituição',
        site: 'https://www.esucri.com.br',
      });
    }
  }

  findAll(): Partner[] {
    return this.partners;
  }

  create(dto: CreatePartnerDto): Partner {
    const partner: Partner = {
      id: this.nextId++,
      ...dto,
    };
    this.partners.push(partner);
    return partner;
  }

  update(id: number, dto: UpdatePartnerDto): Partner {
    const index = this.partners.findIndex(p => p.id === id);
    if (index === -1) {
      throw new NotFoundException('Parceiro não encontrado');
    }
    this.partners[index] = { ...this.partners[index], ...dto };
    return this.partners[index];
  }

  remove(id: number): void {
    const index = this.partners.findIndex(p => p.id === id);
    if (index === -1) {
      throw new NotFoundException('Parceiro não encontrado');
    }
    this.partners.splice(index, 1);
  }
}