import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { onlineMap } from './onlineMap';

@WebSocketGateway({ namespace: /\/ws-.+/ })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  private logger = new Logger('EventsGateway');

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: string) {
    this.logger.verbose('test', data);
  }

  @SubscribeMessage('login')
  handleLogin(
    @MessageBody() data: { id: number; channels: number[] },
    @ConnectedSocket() socket: Socket,
  ) {
    const newNamespace = socket.nsp;

    this.logger.verbose('login', newNamespace);

    onlineMap[socket.nsp.name][socket.id] = data.id;
    newNamespace.emit('onlineList', Object.values(onlineMap[socket.nsp.name]));

    data.channels.forEach((channel) => {
      this.logger.verbose('join', socket.nsp.name, channel);
      socket.join(`${socket.nsp.name}-${channel}`);
    });
  }

  afterInit(server: any) {
    this.logger.verbose('afterInit');
    console.log(server);
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.verbose('connected', socket.nsp.name);

    if (!onlineMap[socket.nsp.name]) {
      onlineMap[socket.nsp.name] = {};
    }

    // broadcast to all clients in the given sub-namespace
    socket.emit('hello', socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.verbose('disconnected', socket.nsp.name);

    const newNamespace = socket.nsp;
    delete onlineMap[socket.nsp.name][socket.id];

    newNamespace.emit('onlineList', Object.values(onlineMap[socket.nsp.name]));
  }
}
