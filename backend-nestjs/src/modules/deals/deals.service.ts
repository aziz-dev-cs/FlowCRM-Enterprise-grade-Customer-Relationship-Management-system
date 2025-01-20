import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from './deal.entity';
import { CreateDealDto, UpdateDealDto, UpdateDealStageDto } from './dto/deal.dto';
import { PipelineStage } from '../pipelines/pipeline-stage.entity';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal)
    private dealRepository: Repository<Deal>,
    @InjectRepository(PipelineStage)
    private stageRepository: Repository<PipelineStage>,
  ) {}

  async findAll(workspaceId: string): Promise<Deal[]> {
    return this.dealRepository.find({
      where: { workspaceId },
      relations: ['owner', 'contact', 'stage'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, workspaceId: string): Promise<Deal> {
    const deal = await this.dealRepository.findOne({
      where: { id, workspaceId },
      relations: ['owner', 'contact', 'stage', 'contact.company'],
    });
    
    if (!deal) {
      throw new NotFoundException('Deal not found');
    }
    
    return deal;
  }

  async create(createDealDto: CreateDealDto, workspaceId: string, ownerId: string): Promise<Deal> {
    const stage = await this.stageRepository.findOne({
      where: { id: createDealDto.stageId },
    });
    
    if (!stage) {
      throw new BadRequestException('Invalid stage');
    }
    
    const deal = this.dealRepository.create({
      ...createDealDto,
      workspaceId,
      ownerId,
      pipelineId: stage.pipelineId,
    });
    
    return this.dealRepository.save(deal);
  }

  async update(id: string, updateDealDto: UpdateDealDto, workspaceId: string): Promise<Deal> {
    const deal = await this.findOne(id, workspaceId);
    Object.assign(deal, updateDealDto);
    return this.dealRepository.save(deal);
  }

  async updateStage(id: string, updateStageDto: UpdateDealStageDto, workspaceId: string): Promise<Deal> {
    const deal = await this.findOne(id, workspaceId);
    const newStage = await this.stageRepository.findOne({
      where: { id: updateStageDto.stageId },
    });
    
    if (!newStage) {
      throw new BadRequestException('Invalid stage');
    }
    
    const oldStageId = deal.stageId;
    deal.stageId = newStage.id;
    deal.pipelineId = newStage.pipelineId;
    deal.probability = newStage.probability;
    
    const updatedDeal = await this.dealRepository.save(deal);
    
    return { ...updatedDeal, oldStageId, newStageId: newStage.id };
  }

  async delete(id: string, workspaceId: string): Promise<void> {
    const deal = await this.findOne(id, workspaceId);
    await this.dealRepository.remove(deal);
  }

  async getPipelineValue(workspaceId: string): Promise<number> {
    const result = await this.dealRepository
      .createQueryBuilder('deal')
      .select('SUM(deal.value)', 'total')
      .where('deal.workspaceId = :workspaceId', { workspaceId })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }
}