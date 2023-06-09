import {
  // ApiProperty,
  PickType,
} from '@nestjs/swagger';
import { Channels } from 'src/entities/Channels';

export class CreateChannelDto extends PickType(Channels, ['name'] as const) {
  // @ApiProperty({
  //   example: '수다방',
  //   description: '채널명',
  // })
  // public name: string;
}
