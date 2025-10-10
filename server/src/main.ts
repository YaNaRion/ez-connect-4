import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://ezconnecty.cc', 'http://localhost', 'http://localhost:3000', 'http://www.ezconnecty.cc'],
  });
  await app.listen(3000);
}
bootstrap();
