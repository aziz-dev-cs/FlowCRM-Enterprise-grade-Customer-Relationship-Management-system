import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PipelinesService } from './pipelines.service';
import { CreatePipelineDto, UpdatePipelineDto, CreateStageDto, UpdateStageDto, ReorderStagesDto } from './dto/pipeline.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('pipelines')
@ApiBearerAuth()
@Controller('pipelines')
@UseGuards(JwtAuthGuard)
export class PipelinesController {
  constructor(private pipelinesService: PipelinesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all pipelines' })
  async findAll(@Req() req) {
    return this.pipelinesService.findAll(req.user.workspaceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pipeline by ID' })
  async findOne(@Param('id') id: string, @Req() req) {
    return this.pipelinesService.findOne(id, req.user.workspaceId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new pipeline' })
  async create(@Body() createPipelineDto: CreatePipelineDto, @Req() req) {
    return this.pipelinesService.create(createPipelineDto, req.user.workspaceId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update pipeline' })
  async update(@Param('id') id: string, @Body() updatePipelineDto: UpdatePipelineDto, @Req() req) {
    return this.pipelinesService.update(id, updatePipelineDto, req.user.workspaceId);
  }

  @Post(':id/stages')
  @ApiOperation({ summary: 'Add stage to pipeline' })
  async addStage(@Param('id') id: string, @Body() createStageDto: CreateStageDto, @Req() req) {
    return this.pipelinesService.addStage(id, createStageDto, req.user.workspaceId);
  }

  @Put('stages/:stageId')
  @ApiOperation({ summary: 'Update stage' })
  async updateStage(@Param('stageId') stageId: string, @Body() updateStageDto: UpdateStageDto, @Req() req) {
    return this.pipelinesService.updateStage(stageId, updateStageDto, req.user.workspaceId);
  }

  @Post(':id/stages/reorder')
  @ApiOperation({ summary: 'Reorder stages' })
  async reorderStages(@Param('id') id: string, @Body() reorderDto: ReorderStagesDto, @Req() req) {
    return this.pipelinesService.reorderStages(id, reorderDto, req.user.workspaceId);
  }

  @Delete('stages/:stageId')
  @ApiOperation({ summary: 'Delete stage' })
  async deleteStage(@Param('stageId') stageId: string, @Req() req) {
    await this.pipelinesService.deleteStage(stageId, req.user.workspaceId);
    return { success: true };
  }

  @Post(':id/default')
  @ApiOperation({ summary: 'Set pipeline as default' })
  async setDefault(@Param('id') id: string, @Req() req) {
    await this.pipelinesService.setDefault(id, req.user.workspaceId);
    return { success: true };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete pipeline' })
  async delete(@Param('id') id: string, @Req() req) {
    await this.pipelinesService.delete(id, req.user.workspaceId);
    return { success: true };
  }
}