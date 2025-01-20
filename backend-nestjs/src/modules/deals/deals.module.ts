import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { DealsGateway } from './deals.gateway';
import { Deal } from './deal.entity';
import { PipelineStage } from '../pipelines/pipeline-stage.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Deal, PipelineStage]), NotificationsModule],
  controllers: [DealsController],
  providers: [DealsService, DealsGateway],
  exports: [DealsService],
})
export class DealsModule {}