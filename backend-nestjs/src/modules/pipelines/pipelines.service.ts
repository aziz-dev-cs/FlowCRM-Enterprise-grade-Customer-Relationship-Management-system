import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pipeline } from './pipeline.entity';
import { PipelineStage } from './pipeline-stage.entity';
import { CreatePipelineDto, UpdatePipelineDto, CreateStageDto, UpdateStageDto, ReorderStagesDto } from './dto/pipeline.dto';

@Injectable()
export class PipelinesService {
  constructor(
    @InjectRepository(Pipeline)
    private pipelineRepository: Repository<Pipeline>,
    @InjectRepository(PipelineStage)
    private stageRepository: Repository<PipelineStage>,
  ) {}

  async findAll(workspaceId: string): Promise<Pipeline[]> {
    return this.pipelineRepository.find({
      where: { workspaceId },
      relations: ['stages'],
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string, workspaceId: string): Promise<Pipeline> {
    const pipeline = await this.pipelineRepository.findOne({
      where: { id, workspaceId },
      relations: ['stages'],
    });
    
    if (!pipeline) {
      throw new NotFoundException('Pipeline not found');
    }
    
    return pipeline;
  }

  async create(createPipelineDto: CreatePipelineDto, workspaceId: string): Promise<Pipeline> {
    const pipeline = this.pipelineRepository.create({
      ...createPipelineDto,
      workspaceId,
    });
    
    const savedPipeline = await this.pipelineRepository.save(pipeline);
    
    // Create default stages if none provided
    if (!createPipelineDto.stages || createPipelineDto.stages.length === 0) {
      const defaultStages = [
        { name: 'Lead', orderIndex: 0, probability: 10 },
        { name: 'Qualified', orderIndex: 1, probability: 25 },
        { name: 'Proposal', orderIndex: 2, probability: 50 },
        { name: 'Negotiation', orderIndex: 3, probability: 75 },
        { name: 'Closed Won', orderIndex: 4, probability: 100, isWonStage: true },
        { name: 'Closed Lost', orderIndex: 5, probability: 0, isLostStage: true },
      ];
      
      for (const stageData of defaultStages) {
        const stage = this.stageRepository.create({
          ...stageData,
          pipelineId: savedPipeline.id,
        });
        await this.stageRepository.save(stage);
      }
    } else {
      for (const stageData of createPipelineDto.stages) {
        const stage = this.stageRepository.create({
          ...stageData,
          pipelineId: savedPipeline.id,
        });
        await this.stageRepository.save(stage);
      }
    }
    
    return this.findOne(savedPipeline.id, workspaceId);
  }

  async update(id: string, updatePipelineDto: UpdatePipelineDto, workspaceId: string): Promise<Pipeline> {
    const pipeline = await this.findOne(id, workspaceId);
    Object.assign(pipeline, updatePipelineDto);
    return this.pipelineRepository.save(pipeline);
  }

  async addStage(pipelineId: string, createStageDto: CreateStageDto, workspaceId: string): Promise<PipelineStage> {
    const pipeline = await this.findOne(pipelineId, workspaceId);
    
    const stage = this.stageRepository.create({
      ...createStageDto,
      pipelineId: pipeline.id,
    });
    
    return this.stageRepository.save(stage);
  }

  async updateStage(stageId: string, updateStageDto: UpdateStageDto, workspaceId: string): Promise<PipelineStage> {
    const stage = await this.stageRepository.findOne({
      where: { id: stageId },
      relations: ['pipeline'],
    });
    
    if (!stage || stage.pipeline.workspaceId !== workspaceId) {
      throw new NotFoundException('Stage not found');
    }
    
    Object.assign(stage, updateStageDto);
    return this.stageRepository.save(stage);
  }

  async reorderStages(pipelineId: string, reorderDto: ReorderStagesDto, workspaceId: string): Promise<PipelineStage[]> {
    const pipeline = await this.findOne(pipelineId, workspaceId);
    
    for (const stageOrder of reorderDto.stages) {
      await this.stageRepository.update(
        { id: stageOrder.id, pipelineId: pipeline.id },
        { orderIndex: stageOrder.orderIndex },
      );
    }
    
    return this.stageRepository.find({
      where: { pipelineId: pipeline.id },
      order: { orderIndex: 'ASC' },
    });
  }

  async deleteStage(stageId: string, workspaceId: string): Promise<void> {
    const stage = await this.stageRepository.findOne({
      where: { id: stageId },
      relations: ['pipeline'],
    });
    
    if (!stage || stage.pipeline.workspaceId !== workspaceId) {
      throw new NotFoundException('Stage not found');
    }
    
    // Check if stage has deals
    const dealCount = await stage.deals?.length || 0;
    if (dealCount > 0) {
      throw new BadRequestException(`Cannot delete stage with ${dealCount} active deals`);
    }
    
    await this.stageRepository.remove(stage);
  }

  async delete(id: string, workspaceId: string): Promise<void> {
    const pipeline = await this.findOne(id, workspaceId);
    
    // Check if any deals exist in this pipeline
    let hasDeals = false;
    for (const stage of pipeline.stages) {
      if (stage.deals && stage.deals.length > 0) {
        hasDeals = true;
        break;
      }
    }
    
    if (hasDeals) {
      throw new BadRequestException('Cannot delete pipeline with active deals');
    }
    
    await this.pipelineRepository.remove(pipeline);
  }

  async setDefault(id: string, workspaceId: string): Promise<void> {
    // Remove default from all pipelines
    await this.pipelineRepository.update(
      { workspaceId, isDefault: true },
      { isDefault: false },
    );
    
    // Set new default
    await this.pipelineRepository.update(
      { id, workspaceId },
      { isDefault: true },
    );
  }
}