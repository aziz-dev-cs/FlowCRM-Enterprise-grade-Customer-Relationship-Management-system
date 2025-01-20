import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipelinesController } from './pipelines.controller';
import { PipelinesService } from './pipelines.service';
import { Pipeline } from './pipeline.entity';
import { PipelineStage } from './pipeline-stage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pipeline, PipelineStage])],
  controllers: [PipelinesController],
  providers: [PipelinesService],
  exports: [PipelinesService],
})
export class PipelinesModule {}