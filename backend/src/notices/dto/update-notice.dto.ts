import { PartialType } from '@nestjs/mapped-types';
import { CreateNoticeDto } from './create-notice.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNoticeDto extends PartialType(CreateNoticeDto) {
  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  image?: string;

  @ApiPropertyOptional()
  link?: string;

  @ApiPropertyOptional()
  source?: string;
}
