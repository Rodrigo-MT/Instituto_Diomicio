// src/notices/notices.service.ts

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { Repository } from 'typeorm';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { ReorderNoticesDto } from './dto/reorder-notice.dto';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}

  async findAll(): Promise<Notice[]> {
    return this.noticeRepository.find({ order: { order: 'ASC' } });
  }

  async findPreload(): Promise<Notice[]> {
    return this.noticeRepository.find({
      where: { predefined: true },
      order: { order: 'ASC' },
    });
  }

  async findByTitle(title: string): Promise<Notice | null> {
    return this.noticeRepository.findOneBy({ title });
  }

  async create(createNoticeDto: CreateNoticeDto): Promise<Notice> {
    const existing = await this.noticeRepository.findOneBy({
      link: createNoticeDto.link,
    });
    if (existing) {
      throw new ConflictException('Notice already exists with this link');
    }

    const maxOrder = await this.noticeRepository
      .createQueryBuilder('notice')
      .select('MAX(notice.order)', 'max')
      .getRawOne();

    const order = (maxOrder?.max ?? 0) + 1;

    const notice = this.noticeRepository.create({
      ...createNoticeDto,
      order,
    });

    return this.noticeRepository.save(notice);
  }

  async update(id: number, updateDto: UpdateNoticeDto): Promise<Notice> {
    const notice = await this.noticeRepository.preload({
      id,
      ...updateDto,
    });
    if (!notice) throw new NotFoundException(`Notice with ID ${id} not found`);
    return this.noticeRepository.save(notice);
  }

  async remove(id: number): Promise<void> {
    const notice = await this.noticeRepository.findOneBy({ id });
    if (!notice) throw new NotFoundException(`Notice with ID ${id} not found`);
    await this.noticeRepository.remove(notice);
  }

  async reorder(reorderDto: ReorderNoticesDto): Promise<void> {
    for (const { id, newOrder } of reorderDto.notices) {
      await this.noticeRepository.update(id, { order: newOrder });
    }
  }

  async seedPredefined(): Promise<string[]> {
    const predefinedNotices = [
      {
        title:
          'Instituto Diomício Freitas há 35 anos atuando na garantia dos direitos das pessoas com deficiência',
        image:
          'https://portal-arquivos.engeplus.com.br/cache/noticia/0144/0144953/144953-.jpg',
        link:
          'https://engeplus.com.br/noticia/geral/2020/instituto-diomicio-freitas-ha-35-anos-atuando-na-garantia-dos-direitos-da-pessoa-com-deficiencia',
        source: 'Engeplus',
        predefined: true,
      },
      {
        title: 'Instituto Diomício Freitas realiza almoço beneficente',
        image:
          'https://tnsul.com/wp-content/uploads/2023/04/WhatsApp-Image-2023-04-19-at-11.24.12.jpeg',
        link:
          'https://tnsul.com/2023/04/23/instituto-diomicio-freitas-faz-almoco-beneficente-para-comemorar-38-anos/',
        source: 'TNSul',
        predefined: true,
      },
      {
        title: 'Instituto Diomício Freitas realiza pedágio solidário',
        image:
          'https://www.4oito.com.br/image/cT05OCZ0YWc9JnNyYz1tZWRpYS9ub3RpY2lhcy9fNzIwODAuanBnJnI9MTY2Mjc0MzkxMCZ3PTcyOA==/_72080.jpg',
        link:
          'https://www.4oito.com.br/noticia/instituto-diomicio-freitas-realiza-pedagio-solidario-neste-sabado-61051',
        source: '4oito',
        predefined: true,
      },
      {
        title:
          'Instituto Diomício Freitas acompanha os alunos no mercado de trabalho',
        image:
          'https://jinews.com.br//upload/capa_blog/INSTITUTO-DIOMICIO-FREITAS-FACHADA-25-DE-ABRIL-DE-2022.jpeg',
        link:
          'https://www.jinews.com.br/noticia/-instituto-diomicio-freitas-acompanha-os-alunos-no-mercado-de-trabalho',
        source: 'Jinews',
        predefined: true,
      },
      {
        title:
          'Instituto Diomício Freitas arrecada tampinhas, lacres, latinhas e embalagens vazias de medicamentos',
        image:
          'https://portal-arquivos.engeplus.com.br/cache/noticia/0189/0189758/instituto-diomicio-freitas-arrecada-tampinhas-lacres-latinhas-e-embalagens-vazias-de-medicamentos.jpg',
        link:
          'https://www.engeplus.com.br/noticia/geral/2023/instituto-diomicio-freitas-arrecada-tampinhas-lacres-latinhas-e-embalagens-vazias-de-medicamentos',
        source: 'Engeplus',
        predefined: true,
      },
      {
        title:
          'Ajude o Instituto Diomício Freitas e doe tampinhas, lacres e embalagens vazias de remédios',
        image:
          'https://portallitoralsul.com.br/wp-content/uploads/2023/06/Ajude-o-Instituto-Diomicio-Freitas-e-doe-tampinhas-lacres-e-embalagens-vazias-de-remedios.jpeg',
        link:
          'https://portallitoralsul.com.br/ajude-o-instituto-diomicio-freitas-e-doe-tampinhas-lacres-e-embalagens-vazias-de-remedios/',
        source: 'Portallitoralsul',
        predefined: true,
      },
    ];

    const inseridos: string[] = [];

    for (const notice of predefinedNotices) {
      const exists = await this.findByTitle(notice.title);
      if (!exists) {
        await this.create(notice as CreateNoticeDto);
        inseridos.push(notice.title);
      }
    }

    return inseridos;
  }
}
