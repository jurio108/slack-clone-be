import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { ChannelsService } from './channels.service';
import { Users } from 'src/entities/Users';
import { Channels } from 'src/entities/Channels';
import { CreateChannelDto } from './dto/create.channel.dto';
import { ChannelChats } from 'src/entities/ChannelChats';

@ApiTags('CHANNEL')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  /**
   * GET /workspaces/:url/channels
   * :url 내부의 내가 속해있는 채널 리스트를 가져옴
   *
   * @param url workspace url
   * @param user 사용자
   * @returns Channels[]
   */
  @ApiOperation({
    summary: '채널 조회',
    description: 'url 내부의 내가 속해있는 채널 리스트를 가져옴',
  })
  @Get()
  getAllChannels(@Param('url') url, @User() user: Users): Promise<Channels[]> {
    return this.channelsService.getWorkspaceChannels(url, user.id);
  }

  /**
   * POST /workspaces/:url/channels
   * :url 내부에 채널을 생성함
   *
   * @param url workspace url
   * @param body { name: string(채널명) }
   * @param user 사용자
   * @returns void
   */
  @ApiOperation({
    summary: '채널 생성',
    description: ':url 내부에 채널을 생성함',
  })
  @Post()
  createWorkspaceChannels(
    @Param('url') url,
    @Body() body: CreateChannelDto,
    @User() user: Users,
  ): Promise<void> {
    return this.channelsService.createWorkspaceChannels(
      url,
      body.name,
      user.id,
    );
  }

  /**
   * GET /workspaces/:url/channels/:name
   * :url 내부의 :name 정보를 가져옴
   *
   * @param url workspace url
   * @param name 채널명
   * @returns Channel
   */
  @ApiOperation({
    summary: '채널 정보 조회',
    description: 'url 내부의 :name 정보를 가져옴',
  })
  @Get(':name')
  getWorkspaceChannel(
    @Param('url') url,
    @Param('name') name,
  ): Promise<Channels> {
    return this.channelsService.getWorkspaceChannel(url, name);
  }

  /**
   * GET /workspaces/:url/channels/:name/members
   * :url 내부의 :name 멤버 목록을 가져옴
   *
   * @param url workspace url
   * @param name 채널명
   * @returns User[]
   */
  @ApiOperation({
    summary: '채널 내 사용자 목록 조회',
    description: ':url 내부의 :name 멤버 목록을 가져옴',
  })
  @Get(':name/members')
  async getWorkspaceChannelMembers(
    @Param('url') url: string,
    @Param('name') name: string,
  ): Promise<Users[]> {
    return this.channelsService.getWorkspaceChannelMembers(url, name);
  }

  /**
   * POST /workspaces/:url/channels/:name/members
   * :url 내부의 :name로 멤버 초대
   *
   * @param url workspace url
   * @param name 채널명
   * @param email 사용자 email
   * @returns void
   */
  @ApiOperation({
    summary: '채널 내 사용자 생성',
    description: ':url 내부의 :name로 멤버 사용자 초대(생성)',
  })
  @Post(':name/members')
  async createWorkspaceMembers(
    @Param('url') url: string,
    @Param('name') name: string,
    @Body('email') email,
  ): Promise<void> {
    return this.channelsService.createWorkspaceChannelMembers(url, name, email);
  }

  /**
   * GET /workspaces/:url/channels/:name/chats
   * :url 내부의 :name의 채팅을 가져옴
   *
   * @param url workspace url
   * @param name 채널명
   * @param perPage number(한 페이지 당 몇 개)
   * @param page number(페이지)
   * @returns ChannelChats[]
   */
  @ApiOperation({
    summary: '채팅 조회',
    description: ':url 내부의 :name의 채팅을 가져옴',
  })
  @Get(':name/chats')
  async getWorkspaceChannelChats(
    @Param('url') url: string,
    @Param('name') name: string,
    @Query('perPage', ParseIntPipe) perPage: number,
    @Query('page', ParseIntPipe) page: number,
  ): Promise<ChannelChats[]> {
    return this.channelsService.getWorkspaceChannelChats(
      url,
      name,
      perPage,
      page,
    );
  }

  // POST /workspaces/:url/channels/:name/chats
  // :url 내부의 :name의 채팅을 저장
  // body: { content: string(내용) }
  // return: 'ok'
  // message 소켓 이벤트가 emit됨
  @Post(':name/chats')
  async createWorkspaceChannelChats(
    @Param('url') url: string,
    @Param('name') name: string,
    @Body('content') content: string,
    @User() user: Users,
  ) {
    return this.channelsService.createWorkspaceChannelChats(
      url,
      name,
      content,
      user.id,
    );
  }

  // POST /workspaces/:url/channels/:name/images
  // :url 내부의 :name의 이미지를 저장
  // body: { image: 이미지(multipart) }
  // return: 'ok'
  // message 소켓 이벤트가 emit됨
  @Post(':name/images')
  async createWorkspaceChannelImages() {
    return this.channelsService.createWorkspaceChannelImages();
  }

  // GET /workspaces/:url/channels/:name/unreads
  // :url 내부의 :name의 안 읽은 채팅 유무를 가져옴
  // query: { after: Timestamp }
  // return: number
  @ApiOperation({
    summary: '읽지 않은 채팅 갯수 조회',
    description: ':url 내부의 :name의 안 읽은 채팅 유무를 가져옴',
  })
  @Get(':name/unreads')
  async getUnreads(
    @Param('url') url: string,
    @Param('name') name: string,
    @Query('after', ParseIntPipe) after: number,
  ) {
    return this.channelsService.getChannelUnreadsCount(url, name, after);
  }
}
