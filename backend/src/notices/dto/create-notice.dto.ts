import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoticeDto {
  @ApiProperty({ example: 'Instituto Diomício Freitas há 35 anos atuando na garantia dos direitos das pessoas com deficiência' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'https://portal-arquivos.engeplus.com.br/cache/noticia/0144/0144953/144953-.jpg' })
  @IsUrl()
  image: string;

  @ApiProperty({ example: 'https://engeplus.com.br/noticia/geral/2020/instituto-diomicio-freitas-ha-35-anos-atuando-na-garantia-dos-direitos-da-pessoa-com-deficiencia' })
  @IsUrl()
  link: string;

  @ApiProperty({ example: 'Engeplus' })
  @IsString()
  source: string;
}
