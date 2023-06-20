import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import multer from 'multer';
import path from 'path';
import { LoggedInGuard } from 'src/auth/logged.in.guard';
import { DmsService } from './dms.service';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { FilesInterceptor } from '@nestjs/platform-express';

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

@ApiTags('DMS')
@UseGuards(LoggedInGuard)
@Controller('api/workspaces/:url/dms')
export class DmsController {
  constructor(private dmsService: DmsService) {}

  /**
   * GET /workspaces/:url/dms
   * DM 주고받은 사용자 조회
   *
   * @param url workspace url
   * @param user 사용자
   * @returns IUsers[]
   */
  @ApiOperation({
    summary: 'DM 사용자 조회',
    description: 'DM 주고받은 사용자 조회',
  })
  @Get()
  async getWorkspaceDMs(
    @Param('url') url,
    @User() user: Users,
  ): Promise<Users[]> {
    return this.dmsService.getWorkspaceDMs(url, user.id);
  }

  /**
   * GET /workspaces/:url/dms/:id/chats
   * :workspace 내부의 :id와 나눈 dm을 가져옴
   *
   * @param url workspace url
   * @param id 사용자 ID
   * @query perPage: number(한 페이지 당 몇 개), page: number(페이지)
   * @returns IDM[]
   */
  @ApiOperation({
    summary: 'DM 조회',
    description: ':url 내부의 :id와 나눈 dm을 가져옴',
  })
  @ApiParam({
    name: 'url',
    required: true,
    description: '워크스페이스 url',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '사용자 ID',
  })
  @ApiQuery({
    name: 'perPage',
    required: true,
    description: '한 번에 가져오는 갯수',
    example: '20',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description: '불러올 페이지',
    example: '1',
  })
  @Get(':id/chats')
  async getChat(
    @Param('url') url,
    @Param('id', ParseIntPipe) id: number,
    @Query('perPage', ParseIntPipe) perPage: number,
    @Query('page', ParseIntPipe) page: number,
    @User() user: Users,
  ) {
    return this.dmsService.getWorkspaceDMChats(url, id, user.id, perPage, page);
  }

  /**
   * GET /workspaces/:url/dms/:id/chats
   * :workspace 내부의 :id와 나눈 dm을 가져옴(dm 소켓 이벤트가 emit됨)
   *
   * @param url workspace url
   * @param id 사용자 ID
   * @body content: string(내용)
   * @returns
   */
  @ApiOperation({
    summary: 'DM 생성',
    description: ':workspace 내부의 :id와 나눈 dm을 저장',
  })
  @Post('/:id/chats')
  async createWorkspaceDMChats(
    @Param('url') url,
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content,
    @User() user: Users,
  ) {
    return this.dmsService.createWorkspaceDMChats(url, content, id, user.id);
  }

  /**
   * GET /workspaces/:url/dms/:id/images
   * :workspace 내부의 :id에게 보낸 이미지 저장(dm 소켓 이벤트가 emit됨)
   *
   * @param url workspace url
   * @param id 사용자 ID
   * @uploadfiles image: 이미지(multipart)
   * @returns
   */
  @ApiOperation({
    summary: 'DM 이미지 업로드',
    description: ':workspace 내부의 :id에게 보낸 이미지 저장',
  })
  @UseInterceptors(
    FilesInterceptor('image', 10, {
      storage: multer.diskStorage({
        destination(req, file, cb) {
          cb(null, 'uploads/');
        },
        filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @Post(':id/images')
  async createWorkspaceDMImages(
    @Param('url') url,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: Users,
  ) {
    return this.dmsService.createWorkspaceDMImages(url, files, id, user.id);
  }

  /**
   * GET /workspaces/:workspace/dms/:id/unreads
   * :workspace 내부의 :id가 보낸 안 읽은 채팅 수를 가져옴.
   *
   * @param url workspace url
   * @param id 사용자 ID
   * @query { after: Timestamp }
   * @returns number
   */
  @ApiOperation({
    summary: '안 읽은 DM 조회',
    description: ':workspace 내부의 :id가 보낸 안 읽은 채팅 수를 가져옴.',
  })
  @Get(':url/dms/:id/unreads')
  async getUnreads(
    @Param('url') url,
    @Param('id', ParseIntPipe) id: number,
    @Query('after', ParseIntPipe) after: number,
    @User() user: Users,
  ) {
    return this.dmsService.getDMUnreadsCount(url, id, user.id, after);
  }
}
