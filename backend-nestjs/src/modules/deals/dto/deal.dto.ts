import { IsString, IsNumber, IsOptional, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDealDto {
  @ApiProperty({ example: 'Enterprise Deal' })
  @IsString()
  title: string;

  @ApiProperty({ example: 100000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsOptional()
  @IsString()
  expectedCloseDate?: string;

  @ApiProperty({ example: 'stage-uuid' })
  @IsUUID()
  stageId: string;

  @ApiProperty({ example: 'contact-uuid', required: false })
  @IsOptional()
  @IsUUID()
  contactId?: string;
}

export class UpdateDealDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsString()
  expectedCloseDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  probability?: number;
}

export class UpdateDealStageDto {
  @ApiProperty({ example: 'new-stage-uuid' })
  @IsUUID()
  stageId: string;
}