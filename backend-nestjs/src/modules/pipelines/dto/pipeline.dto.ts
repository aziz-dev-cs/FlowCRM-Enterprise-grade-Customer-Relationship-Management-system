import { IsString, IsOptional, IsArray, IsBoolean, IsNumber, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStageDto {
  @ApiProperty({ example: 'Lead' })
  @IsString()
  name: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  orderIndex: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  probability?: number;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isWonStage?: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isLostStage?: boolean;
}

export class CreatePipelineDto {
  @ApiProperty({ example: 'Sales Pipeline' })
  @IsString()
  name: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({ type: [CreateStageDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStageDto)
  stages?: CreateStageDto[];
}

export class UpdatePipelineDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateStageDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  probability?: number;

  @IsOptional()
  @IsBoolean()
  isWonStage?: boolean;

  @IsOptional()
  @IsBoolean()
  isLostStage?: boolean;
}

export class ReorderStagesDto {
  @ApiProperty({ type: [{ id: 'string', orderIndex: 0 }] })
  @IsArray()
  stages: { id: string; orderIndex: number }[];
}