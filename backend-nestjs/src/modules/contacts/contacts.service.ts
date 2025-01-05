import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';
import { Contact } from './contact.entity';
import { ContactActivity } from './contact-activity.entity';
import { Company } from '../companies/company.entity';
import { CreateContactDto, UpdateContactDto, AddActivityDto, ImportContactsDto } from './dto/contact.dto';
import * as csv from 'csv-parser';
import * as fs from 'fs';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(ContactActivity)
    private activityRepository: Repository<ContactActivity>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async findAll(workspaceId: string, search?: string, tags?: string[]): Promise<Contact[]> {
    const query = this.contactRepository
      .createQueryBuilder('contact')
      .where('contact.workspaceId = :workspaceId', { workspaceId })
      .leftJoinAndSelect('contact.company', 'company')
      .leftJoinAndSelect('contact.deals', 'deals');
    
    if (search) {
      query.andWhere(
        '(contact.firstName ILIKE :search OR contact.lastName ILIKE :search OR contact.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    
    if (tags && tags.length > 0) {
      query.andWhere('contact.tags && :tags', { tags });
    }
    
    return query.getMany();
  }

  async findOne(id: string, workspaceId: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id, workspaceId },
      relations: ['company', 'deals', 'activities', 'activities.user'],
    });
    
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    
    return contact;
  }

  async create(createContactDto: CreateContactDto, workspaceId: string, userId: string): Promise<Contact> {
    // Check if company exists or create new
    let company = null;
    if (createContactDto.companyId) {
      company = await this.companyRepository.findOne({
        where: { id: createContactDto.companyId, workspaceId },
      });
    } else if (createContactDto.companyName) {
      company = await this.companyRepository.findOne({
        where: { name: createContactDto.companyName, workspaceId },
      });
      
      if (!company) {
        company = this.companyRepository.create({
          name: createContactDto.companyName,
          workspaceId,
        });
        company = await this.companyRepository.save(company);
      }
    }
    
    const contact = this.contactRepository.create({
      ...createContactDto,
      workspaceId,
      companyId: company?.id,
      tags: createContactDto.tags || [],
      customFields: createContactDto.customFields || {},
    });
    
    const savedContact = await this.contactRepository.save(contact);
    
    // Add creation activity
    await this.addActivity({
      contactId: savedContact.id,
      type: 'note',
      content: 'Contact created',
      userId,
    });
    
    return savedContact;
  }

  async update(id: string, updateContactDto: UpdateContactDto, workspaceId: string): Promise<Contact> {
    const contact = await this.findOne(id, workspaceId);
    Object.assign(contact, updateContactDto);
    return this.contactRepository.save(contact);
  }

  async addActivity(addActivityDto: AddActivityDto): Promise<ContactActivity> {
    const activity = this.activityRepository.create(addActivityDto);
    return this.activityRepository.save(activity);
  }

  async getActivities(contactId: string, workspaceId: string): Promise<ContactActivity[]> {
    return this.activityRepository.find({
      where: { contactId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async importContacts(filePath: string, workspaceId: string, userId: string): Promise<{ imported: number; errors: any[] }> {
    const results = [];
    const errors = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          for (const row of results) {
            try {
              await this.create({
                firstName: row.first_name || row.firstName,
                lastName: row.last_name || row.lastName,
                email: row.email,
                phone: row.phone,
                companyName: row.company,
                tags: row.tags ? row.tags.split(',') : [],
              }, workspaceId, userId);
            } catch (error) {
              errors.push({ row, error: error.message });
            }
          }
          resolve({ imported: results.length - errors.length, errors });
        })
        .on('error', reject);
    });
  }

  async findDuplicates(workspaceId: string): Promise<any[]> {
    const duplicates = await this.contactRepository
      .createQueryBuilder('contact')
      .select('contact.email, COUNT(*) as count')
      .where('contact.workspaceId = :workspaceId', { workspaceId })
      .andWhere('contact.email IS NOT NULL')
      .groupBy('contact.email')
      .having('COUNT(*) > 1')
      .getRawMany();
    
    return duplicates;
  }

  async mergeContacts(primaryId: string, secondaryId: string, workspaceId: string): Promise<Contact> {
    const primary = await this.findOne(primaryId, workspaceId);
    const secondary = await this.findOne(secondaryId, workspaceId);
    
    // Merge data
    primary.tags = [...new Set([...primary.tags, ...secondary.tags])];
    primary.customFields = { ...primary.customFields, ...secondary.customFields };
    
    // Move deals to primary contact
    for (const deal of secondary.deals) {
      deal.contactId = primary.id;
      await deal.save();
    }
    
    // Move activities to primary contact
    await this.activityRepository.update(
      { contactId: secondary.id },
      { contactId: primary.id },
    );
    
    // Delete secondary contact
    await this.contactRepository.remove(secondary);
    
    return this.contactRepository.save(primary);
  }

  async delete(id: string, workspaceId: string): Promise<void> {
    const contact = await this.findOne(id, workspaceId);
    await this.contactRepository.remove(contact);
  }
}