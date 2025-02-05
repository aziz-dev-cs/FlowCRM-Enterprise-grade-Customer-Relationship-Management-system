import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'notifications',
})
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      client.join(`user_${userId}`);
      console.log(`User ${userId} connected to notifications`);
    }
  }

  sendNotification(userId: string, notification: any) {
    this.server.to(`user_${userId}`).emit('notification:new', notification);
  }

  sendToWorkspace(workspaceId: string, event: string, data: any) {
    this.server.to(`workspace_${workspaceId}`).emit(event, data);
  }
}