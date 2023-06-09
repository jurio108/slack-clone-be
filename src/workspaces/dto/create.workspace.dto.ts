import {
  // ApiProperty,
  PickType,
} from '@nestjs/swagger';
import { Workspaces } from 'src/entities/Workspaces';

export class CreateWorkspaceDto extends PickType(Workspaces, [
  'name',
  'url',
] as const) {
  /**
   * PickType으로 entity에서 가져옴으로서 아래는 필요가 없어짐
   */
  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({
  //   example: 'name_sleact',
  //   description: '워크스페이스명',
  // })
  // public name: string;
  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({
  //   example: 'url_sleact',
  //   description: 'url 주소',
  // })
  // public url: string;
}
