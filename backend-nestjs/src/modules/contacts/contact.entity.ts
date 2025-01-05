import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Workspace } from '../workspaces/workspace.entity';
import { Company } from '../companies/company.entity';
import { Deal } from '../deals/deal.entity';
import { ContactActivity } from './contact-activity.entity';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'text', array: true, default: {} })
  tags: string[];

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

  @ManyToOne(() => Company, company => company.contacts, { nullable: true })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ nullable: true })
  companyId: string;

  @OneToMany(() => Deal, deal => deal.contact)
  deals: Deal[];

  @OneToMany(() => ContactActivity, activity => activity.contact)
  activities: ContactActivity[];
}