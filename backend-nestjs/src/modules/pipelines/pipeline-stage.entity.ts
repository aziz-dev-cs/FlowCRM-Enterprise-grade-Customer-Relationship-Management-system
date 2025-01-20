import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Pipeline } from './pipeline.entity';
import { Deal } from '../deals/deal.entity';

@Entity('pipeline_stages')
export class PipelineStage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  orderIndex: number;

  @Column({ default: 0 })
  probability: number;

  @Column({ default: false })
  isWonStage: boolean;

  @Column({ default: false })
  isLostStage: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Pipeline, pipeline => pipeline.stages)
  @JoinColumn({ name: 'pipelineId' })
  pipeline: Pipeline;

  @Column()
  pipelineId: string;

  @OneToMany(() => Deal, deal => deal.stage)
  deals: Deal[];
}