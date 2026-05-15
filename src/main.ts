import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './modules/app.module';
import { AllExceptionsFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api', {
    exclude: ['health', '/'],
  });

  app.enableCors();
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  const options = new DocumentBuilder()
    .setTitle('Fms API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  const port = parseInt(
    process.env.PORT || configService.get('PORT') || '4300',
    10,
  );

  await app.listen(port);

  console.log('='.repeat(50));
  console.log(`Application started successfully!`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Listening on: http://localhost:${port}`);
  console.log(`Health Check: http://localhost:${port}/health`);
  console.log(`API Docs: http://localhost:${port}/api-docs`);
  console.log(`API Endpoints: http://localhost:${port}/api/*`);
  console.log('='.repeat(50));
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
