import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// const getEnv = async () => {
//   return {
//     PORT: 3000,
//   };
// };

@Module({
  // imports: [ConfigModule.forRoot({ isGlobal: true, load: [getEnv] })],
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
