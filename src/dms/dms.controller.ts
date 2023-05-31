import { Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('api/workspaces/:url/dms')
export class DmsController {
  // GET /workspaces/:url/dms/:id/chats
  // :url 내부의 :id와 나눈 dm을 가져옴
  // query: { perPage: number(한 페이지 당 몇 개), page: number(페이지) }
  // return: IDM[]
  @Get(':id/chats')
  getChat(@Query() query, @Param() param) {
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
  }

  // GET /workspaces/:url/dms/:id/unreads
  // :url 내부의 :id가 보낸 안 읽은 채팅 수를 가져옴.
  // query: { after: Timestamp }
  // return: number

  // POST /workspaces/:url/dms/:id/chats
  // :url 내부의 :id와 나눈 dm을 저장
  // body: { content: string(내용) }
  // return: 'ok'
  // dm 소켓 이벤트가 emit됨
  @Post(':id/chats')
  postChat() {
    // postChat
  }

  // POST /workspaces/:url/dms/:id/images
  // :url 내부의 :id에게 보낸 이미지 저장
  // body: { image: 이미지(multipart) }
  // return: 'ok'
  // dm 소켓 이벤트가 emit됨
}
