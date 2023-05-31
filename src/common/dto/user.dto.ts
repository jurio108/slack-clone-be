import { ApiProperty } from '@nestjs/swagger';
import { JoinRequestDto } from 'src/users/dto/join.request.dto';

export class UserDto extends JoinRequestDto {
  @ApiProperty({
    example: 1,
    description: '사용자 ID',
    required: true,
  })
  public id: number;
}
