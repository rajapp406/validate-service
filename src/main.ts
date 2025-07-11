import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // Start HTTP app for Swagger and REST endpoints
  const httpApp = await NestFactory.create(AppModule);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Check Service')
    .setDescription('API documentation for the Check Service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(httpApp, config);
  SwaggerModule.setup('api', httpApp, document);

  await httpApp.listen(3600);

  // Start gRPC microservice
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50588',
        package: 'check',
        protoPath: join(
          __dirname,
          '../../common-modules/protocol/check.proto',
        ),
      },
    },
  );
  await grpcApp.listen();
  console.log('Validate Service is running on port 50588');
}

bootstrap();
