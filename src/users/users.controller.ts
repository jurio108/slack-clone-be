import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserDto } from 'src/common/dto/user.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptors';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { NotLoggedInGuard } from 'src/auth/not.logged.in.guard';
import { LoggedInGuard } from 'src/auth/logged.in.guard';

@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * GET /users
   * 사용자 정보 조회
   *
   * @param body { email: string(이메일) }
   * @returns 회원 정보
   */
  @ApiResponse({ type: UserDto })
  @ApiOperation({
    summary: '사용자 정보 조회',
    description: '사용자 로그인 정보를 가져옴, 로그인되어있지 않으면 false',
  })
  @Get()
  getUsers(@User() user) {
    return user;
  }

  // GET /workspaces/:url/users/:id
  // :url의 멤버인 특정 :id 사용자 정보를 가져옴
  // return: IUser

  /**
   * POST /users
   * 회원가입
   *
   * @param body { email: string(이메일), nickname: string(닉네임), password: string(비밀번호) }
   * @returns 회원 정보
   */
  @ApiOkResponse({
    description: '성공',
    type: UserDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @UseGuards(new NotLoggedInGuard())
  @Post()
  async join(@Body() body: JoinRequestDto) {
    await this.usersService.join(body.email, body.nickname, body.password);
  }

  /**
   * POST /users/login
   * 로그인
   *
   * @param body { email: string(이메일), password: string(비밀번호) }
   * @returns 회원 정보
   */
  @ApiOperation({ summary: '로그인' })
  @UseGuards(new LocalAuthGuard())
  @Post('login')
  logIn(@User() user) {
    return user;
  }

  /**
   * POST /users/logout
   * 로그아웃
   *
   * @param body request
   * @returns string
   */
  @ApiOperation({ summary: '로그아웃' })
  @UseGuards(new LoggedInGuard())
  @Post('logout')
  logOut(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok');
  }
}

// import {
//   Body,
//   Controller,
//   Post,
//   Get,
//   Req,
//   Res,
//   UseInterceptors,
//   UseGuards,
// } from '@nestjs/common';
// import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { JoinRequestDto } from './dto/join.request.dto';
// import { UsersService } from './users.service';
// import { UserDto } from '../common/dto/user.dto';
// import { User } from '../common/decorators/user.decorator';
// import { UndefinedToNullInterceptor } from '../common/interceptors/undefinedToNull.interceptor';
// import { LocalAuthGuard } from '../auth/local-auth.guard';
// import { NotLoggedInGuard } from '../auth/not-logged-in.guard';
// import { LoggedInGuard } from '../auth/logged-in.guard';

// @UseInterceptors(UndefinedToNullInterceptor)
// @ApiTags('USER')
// @Controller('api/users')
// export class UsersController {
//   constructor(private usersService: UsersService) {}

//   @ApiResponse({
//     type: UserDto,
//     status: 200,
//     description: '성공',
//   })
//   @ApiOperation({ summary: '내 정보 조회' })
//   @Get()
//   getUsers(@User() user) {
//     return user || false;
//   }

//   @UseGuards(new NotLoggedInGuard())
//   @ApiOperation({ summary: '회원가입' })
//   @Post()
//   async join(@Body() body: JoinRequestDto) {
//     await this.usersService.join(body.email, body.nickname, body.password);
//   }

//   @ApiResponse({
//     type: UserDto,
//     status: 200,
//     description: '성공',
//   })
//   @ApiResponse({
//     status: 500,
//     description: '서버 에러',
//   })
//   @ApiOperation({ summary: '로그인' })
//   @UseGuards(LocalAuthGuard)
//   @Post('login')
//   logIn(@User() user) {
//     return user;
//   }

//   @UseGuards(new LoggedInGuard())
//   @ApiOperation({ summary: '로그아웃' })
//   @Post('logout')
//   logOut(@Req() req, @Res() res) {
//     req.logOut();
//     res.clearCookie('connect.sid', { httpOnly: true });
//     res.send('ok');
//   }
// }
