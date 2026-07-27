import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log(`Client WebSocket terhubung: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client WebSocket terputus: ${client.id}`);
  }

  emitDeviceStatusUpdate(data: any) {
    this.server?.emit('device_status_update', data);
  }

  emitDashboardMetrics(data: any) {
    this.server?.emit('dashboard_metrics', data);
  }

  emitViolationAlert(data: any) {
    this.server?.emit('violation_alert', data);
  }

  emitNotification(data: any) {
    this.server?.emit('new_notification', data);
  }

  @SubscribeMessage('ping_device')
  handlePingDevice(client: Socket, payload: any) {
    return { event: 'pong_device', data: { timestamp: new Date().toISOString() } };
  }
}
