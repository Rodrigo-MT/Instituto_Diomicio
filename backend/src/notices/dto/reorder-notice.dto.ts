import { IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReorderNoticeDto {
  @ApiProperty({ example: 1, description: 'ID da notícia' })
  @IsInt()
  id: number;

  @ApiProperty({ example: 10, description: 'Nova ordem para a notícia' })
  @IsInt()
  newOrder: number;
}

export class ReorderNoticesDto {
  @ApiProperty({ type: [ReorderNoticeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderNoticeDto)
  notices: ReorderNoticeDto[];
}
