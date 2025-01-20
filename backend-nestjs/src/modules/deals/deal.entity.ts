import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Workspace } from '../workspaces/workspace.entity';
import { User } from '../users/user.entity';
import { Contact } from '../contacts/contact.entity';
import { PipelineStage } from '../pipelines/pipeline-stage.entity';

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  value: number;

  @Column({ type: 'date', nullable: true })
  expectedCloseDate: Date;

  @Column({ type: 'int', default: 0 })
  probability: number;

  @Column({ type: 'jsonb', default: {} })
  customFields: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace;

  @Column()
  workspaceId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;

  @ManyToOne(() => Contact)
  @JoinColumn({ name: 'contactId' })
  contact: Contact;

  @Column({ nullable: true })
  contactId: string;

  @ManyToOne(() => PipelineStage)
  @JoinColumn({ name: 'stageId' })
  stage: PipelineStage;

  @Column()
  stageId: string;

  @Column()
  pipelineId: string;
}
