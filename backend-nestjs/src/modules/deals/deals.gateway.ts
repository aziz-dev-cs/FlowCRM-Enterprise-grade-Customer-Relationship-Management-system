import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { DealsService } from './deals.service';
import { NotificationsService } from '../notifications/notifications.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'deals',
})
export class DealsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string[]> = new Map();

  constructor(
    private dealsService: DealsService,
    private notificationsService: NotificationsService,
  ) {}

  async handleConnection(client: Socket) {
    const workspaceId = client.handshake.query.workspaceId as string;
    if (workspaceId) {
      client.join(`workspace_${workspaceId}`);
      console.log(`Client ${client.id} connected to workspace ${workspaceId}`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('deal:stageChanged')
  @UseGuards(WsJwtGuard)
  async handleStageChange(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { dealId: string; oldStage: string; newStage: string; workspaceId: string },
  ) {
    const { dealId, oldStage, newStage, workspaceId } = data;
    
    const deal = await this.dealsService.findOne(dealId, workspaceId);
    
    // Broadcast to all members in workspace
    this.server.to(`workspace_${workspaceId}`).emit('deal:stageUpdated', {
      deal,
      oldStage,
      newStage,
      timestamp: new Date(),
      userId: client.data.userId,
    });
    
    // Create notification for team members
    await this.notificationsService.create({
      workspaceId,
      type: 'deal_update',
      title: 'Deal Stage Changed',
      content: `${deal.title} moved from ${oldStage} to ${newStage}`,
      metadata: { dealId, oldStage, newStage },
    });
    
    // Send real-time notification to all workspace members
    this.server.to(`workspace_${workspaceId}`).emit('notification:new', {
      type: 'deal_update',
      title: 'Deal Stage Changed',
      content: `${deal.title} moved to ${newStage}`,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('deal:created')
  async handleDealCreated(@MessageBody() data: { deal: any; workspaceId: string }) {
    this.server.to(`workspace_${data.workspaceId}`).emit('deal:added', data.deal);
  }

  @SubscribeMessage('deal:deleted')
  async handleDealDeleted(@MessageBody() data: { dealId: string; workspaceId: string }) {
    this.server.to(`workspace_${data.workspaceId}`).emit('deal:removed', data.dealId);
  }
}