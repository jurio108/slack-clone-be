import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './http.exception.filter';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';

declare const module: any;

const configService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = configService.get('PORT') || 3095;

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter()); // HttpExceptionFilter 사용

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

  // cookie-parser, session 설정
  app.use(cookieParser());
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: configService.get('COOKIE_SECRET'),
      cookie: {
        httpOnly: true,
      },
    }),
  );

  // passport 설정
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
