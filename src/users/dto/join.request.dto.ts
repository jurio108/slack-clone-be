import {
  //ApiProperty,
  PickType,
} from '@nestjs/swagger';
import { Users } from 'src/entities/Users';

export class JoinRequestDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
] as const) {
  /**
   * PickType으로 entity에서 가져옴으로서 아래는 필요가 없어짐
   */
  // @ApiProperty({
  //   example: 'jurio108@gmail.com',
  //   description: '이메일',
  //   required: true,
  // })
  // public email: string;
  // @ApiProperty({
  //   example: 'jurio108',
  //   description: '닉네임',
  //   required: true,
  // })
  // public nickname: string;
  // @ApiProperty({
  //   example: 'jurio108!@#',
  //   description: '비밀번호',
  //   required: true,
  // })
  // public password: string;
}
