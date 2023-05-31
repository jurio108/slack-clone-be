import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CHANNEL')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  // GET /workspaces/:url/channels
  // :url 내부의 내가 속해있는 채널 리스트를 가져옴
  // return: IChannel[]
  @Get()
  getAllChannels() {
    // getAllChannels
  }

  // POST /workspaces/:url/channels
  // :url 내부에 채널을 생성함
  // body: { name: string(이름) }
  // return: IChannel
  @Post()
  createChannel() {
    // createChannel
  }

  // GET /workspaces/:url/channels/:name
  // :url 내부의 :name 정보를 가져옴
  // return: IChannel
  @Get(':name')
  getChannelInWorkspace() {
    // getAllChannelsInWorkspace
  }

  // GET /workspaces/:url/channels/:name/chats
  // :url 내부의 :name의 채팅을 가져옴
  // query: { perPage: number(한 페이지 당 몇 개), page: number(페이지) }
  // return: IChat[]
  @Post(':name/chats')
  getChatAtChannelInWorkspace() {
    // getChatAtChannelInWorkspace
  }

  // GET /workspaces/:url/channels/:name/unreads
  // :url 내부의 :name의 안 읽은 채팅 유무를 가져옴
  // query: { after: Timestamp }
  // return: number

  // POST /workspaces/:url/channels/:name/chats
  // :url 내부의 :name의 채팅을 저장
  // body: { content: string(내용) }
  // return: 'ok'
  // message 소켓 이벤트가 emit됨

  // POST /workspaces/:url/channels/:name/images
  // :url 내부의 :name의 이미지를 저장
  // body: { image: 이미지(multipart) }
  // return: 'ok'
  // message 소켓 이벤트가 emit됨

  // GET /workspaces/:url/channels/:name/members
  // :url 내부의 :name 멤버 목록을 가져옴
  // return: IUser[]

  // POST /workspaces/:url/channels/:name/members
  // :url 내부의 :name로 멤버 초대
  // body: { email: string(이메일) }
  // return: 'ok'
}
