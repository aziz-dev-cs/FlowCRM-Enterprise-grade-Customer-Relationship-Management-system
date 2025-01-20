import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { DealsService } from './deals.service';
import { CreateDealDto, UpdateDealDto, UpdateDealStageDto } from './dto/deal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('deals')
@ApiBearerAuth()
@Controller('deals')
@UseGuards(JwtAuthGuard)
export class DealsController {
  constructor(private dealsService: DealsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all deals for workspace' })
  async findAll(@Req() req) {
    return this.dealsService.findAll(req.user.workspaceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deal by ID' })
  async findOne(@Param('id') id: string, @Req() req) {
    return this.dealsService.findOne(id, req.user.workspaceId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new deal' })
  async create(@Body() createDealDto: CreateDealDto, @Req() req) {
    return this.dealsService.create(createDealDto, req.user.workspaceId, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update deal' })
  async update(@Param('id') id: string, @Body() updateDealDto: UpdateDealDto, @Req() req) {
    return this.dealsService.update(id, updateDealDto, req.user.workspaceId);
  }

  @Patch(':id/stage')
  @ApiOperation({ summary: 'Update deal stage (drag & drop)' })
  async updateStage(@Param('id') id: string, @Body() updateStageDto: UpdateDealStageDto, @Req() req) {
    return this.dealsService.updateStage(id, updateStageDto, req.user.workspaceId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete deal' })
  async delete(@Param('id') id: string, @Req() req) {
    return this.dealsService.delete(id, req.user.workspaceId);
  }
}