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

/**
 * ## Socket.io
  - namespace와 room으로 구성됨
  - namespace는 워크스페이스(ws-워크스페이스명, 예시:ws-sleact)
  - room은 채널, DM
  - @WebSocketGateway({ namespace: '이름' 또는 정규표현식 })
  - @WebSocketServer(): 서비스에서 의존성주입받아 사용할 소켓 서버 객체
  - @SubscribeMessage(이벤트명): 웹소켓 이벤트리스너
  - @MessageBody(): 이벤트의 데이터가 의존성주입됨
  - afterInit: 웹소켓 초기화가 끝났을 때
  - handleConnection: 클라이언트와 연결이 맺어졌을 때
  - @ConnectedSocket(): socket을 의존성주입받을 수 있음
  - socket.emit으로 이벤트 전송 가능(이렇게 하면 모두에게 이벤트 전송)
  - socket.nsp: 네임스페이스 객체(socket.nsp.emit 하면 해당 네임스페이스 전체에게 이벤트 전송)
  - socket.nsp.name: 네임스페이스 이름
  - socket.id: 소켓의 고유 아이디(이걸 사용해서 1대1 메시지도 보낼 수 있음, socket.to(소켓아이디).emit)
  - handleDisconnect: 클라이언트와 연결이 끊어졌을 때
 */
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
