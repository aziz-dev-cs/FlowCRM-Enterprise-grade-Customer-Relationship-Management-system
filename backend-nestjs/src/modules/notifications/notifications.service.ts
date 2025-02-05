import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(createNotificationDto);
    return this.notificationRepository.save(notification);
  }

  async findAll(userId: string, workspaceId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId, workspaceId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async markAsRead(id: string, userId: string): Promise<void> {
    await this.notificationRepository.update(
      { id, userId },
      { isRead: true },
    );
  }

  async markAllAsRead(userId: string, workspaceId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, workspaceId, isRead: false },
      { isRead: true },
    );
  }

  async getUnreadCount(userId: string, workspaceId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, workspaceId, isRead: false },
    });
  }
}