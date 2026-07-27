import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Smart MDM Pondok API Documentation')
    .setDescription(
      'Sistem Monitoring & Pengelolaan Perangkat HP Khusus Lingkungan Pondok Pesantren (NestJS, Prisma, WebSockets, REST API)',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Smart MDM Pondok Backend berjalan di http://localhost:${port}`);
  console.log(`📖 Dokumentasi Swagger API tersedia di http://localhost:${port}/api/docs`);
}
bootstrap();
