// src/events/events.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto, imagePath?: string): Promise<Event> {
    const event = this.eventsRepository.create({
      ...createEventDto,
      imagePath,
    });
    return await this.eventsRepository.save(event);
  }

  findAll(): Promise<Event[]> {
    return this.eventsRepository.find();
  }

  findOne(id: number): Promise<Event | null> {
    return this.eventsRepository.findOneBy({ id });
  }

  async update(id: number, updateEventDto: UpdateEventDto, imagePath?: string): Promise<Event> {
    const evento = await this.findOne(id);
    if (!evento) {
      throw new Error('Evento não encontrado');
    }
    Object.assign(evento, updateEventDto);
    if (imagePath) {
      evento.imagePath = imagePath;
    }
    return this.eventsRepository.save(evento);
  }

  async remove(id: number): Promise<void> {
    await this.eventsRepository.delete(id);
  }
}
