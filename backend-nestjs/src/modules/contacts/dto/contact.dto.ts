import { IsString, IsEmail, IsOptional, IsArray, IsUUID, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'company-uuid', required: false })
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiProperty({ example: 'Acme Inc', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ example: ['lead', 'hot'], required: false })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ example: { skype: 'john.doe' }, required: false })
  @IsOptional()
  @IsObject()
  customFields?: Record<string, any>;
}

export class UpdateContactDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsObject()
  customFields?: Record<string, any>;
}

export class AddActivityDto {
  @ApiProperty({ enum: ['call', 'email', 'meeting', 'note'] })
  @IsString()
  type: 'call' | 'email' | 'meeting' | 'note';

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  contactId?: string;
  userId?: string;
}

export class ImportContactsDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}