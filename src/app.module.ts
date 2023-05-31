import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';

// const getEnv = async () => {
//   return {
//     PORT: 3000,
//   };
// };

@Module({
  // imports: [ConfigModule.forRoot({ isGlobal: true, load: [getEnv] })],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    WorkspacesModule,
    ChannelsModule,
    DmsModule,
  ],
  controllers: [AppController],
  providers: [
    ConfigService,
    /*
      매개변수 AppService의 원형
      {provide: AppService, useClass: AppService,}, === AppService
    */
    {
      provide: AppService,
      useClass: AppService,
    },
    /*
      기타 provider 사용법(중 하나)
      AppController의 구현 예제 참고
    */
    {
      provide: 'CUSTOM_KEY',
      useValue: 'CUSTOM_VALUE',
    },
  ],
})
export class AppModule {}
