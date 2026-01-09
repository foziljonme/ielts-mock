// controls.gateway.ts
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { Inject, type LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@WebSocketGateway({
  namespace: '/controls',
})
export class ControlsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected:', client.id);
  }

  @OnEvent('controls.test.started')
  handleControlStarted(payload: any) {
    this.logger.log({ message: 'Test started:', payload });
    this.server.emit('controls.test.started', payload);
  }

  @OnEvent('controls.section.started')
  handleControlSectionStarted(payload: any) {
    this.logger.log({ message: 'Section started:', payload });
    this.server.emit('controls.section.started', payload);
  }

  @OnEvent('controls.section.finished')
  handleControlSectionEnded(payload: any) {
    this.logger.log({ message: 'Section finished:', payload });
    this.server.emit('controls.section.finished', payload);
  }
}
