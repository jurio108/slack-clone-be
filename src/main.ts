import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  // swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Slack clone API')
    .setDescription('Slack clone code API 문서자료입니다.')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    // .addTag('clone tag')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
