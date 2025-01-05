import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto, UpdateContactDto, AddActivityDto, ImportContactsDto } from './dto/contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@ApiTags('contacts')
@ApiBearerAuth()
@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all contacts' })
  async findAll(
    @Req() req,
    @Query('search') search?: string,
    @Query('tags') tags?: string,
  ) {
    const tagArray = tags ? tags.split(',') : undefined;
    return this.contactsService.findAll(req.user.workspaceId, search, tagArray);
  }

  @Get('duplicates')
  @ApiOperation({ summary: 'Find duplicate contacts' })
  async findDuplicates(@Req() req) {
    return this.contactsService.findDuplicates(req.user.workspaceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact by ID' })
  async findOne(@Param('id') id: string, @Req() req) {
    return this.contactsService.findOne(id, req.user.workspaceId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new contact' })
  async create(@Body() createContactDto: CreateContactDto, @Req() req) {
    return this.contactsService.create(createContactDto, req.user.workspaceId, req.user.id);
  }

  @Post('import')
  @ApiOperation({ summary: 'Import contacts from CSV' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async importContacts(@UploadedFile() file: Express.Multer.File, @Req() req) {
    return this.contactsService.importContacts(file.path, req.user.workspaceId, req.user.id);
  }

  @Post(':id/activities')
  @ApiOperation({ summary: 'Add activity to contact' })
  async addActivity(@Param('id') id: string, @Body() addActivityDto: AddActivityDto, @Req() req) {
    return this.contactsService.addActivity({
      ...addActivityDto,
      contactId: id,
      userId: req.user.id,
    });
  }

  @Get(':id/activities')
  @ApiOperation({ summary: 'Get contact activities' })
  async getActivities(@Param('id') id: string, @Req() req) {
    return this.contactsService.getActivities(id, req.user.workspaceId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update contact' })
  async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto, @Req() req) {
    return this.contactsService.update(id, updateContactDto, req.user.workspaceId);
  }

  @Post('merge/:primaryId/:secondaryId')
  @ApiOperation({ summary: 'Merge duplicate contacts' })
  async mergeContacts(@Param('primaryId') primaryId: string, @Param('secondaryId') secondaryId: string, @Req() req) {
    return this.contactsService.mergeContacts(primaryId, secondaryId, req.user.workspaceId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contact' })
  async delete(@Param('id') id: string, @Req() req) {
    await this.contactsService.delete(id, req.user.workspaceId);
    return { success: true };
  }
}