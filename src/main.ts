import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClientModule } from './modules/client/client.module';

async function bootstrap() {
  // Start HTTP app for Swagger and REST endpoints
  const httpApp = await NestFactory.create(AppModule);

  // Global prefix
  httpApp.setGlobalPrefix('api');

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Check Service')
    .setDescription('API documentation for the Check Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(httpApp, config, {
    deepScanRoutes: true,
    include: [
      // Add all modules that contain controllers with @ApiTags
      ClientModule,
    ],
  });
  
  SwaggerModule.setup('api', httpApp, document, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      operationsSorter: 'method',
      tagsSorter: 'alpha',
      docExpansion: 'none',
      defaultModelsExpandDepth: -1, // Hide schemas by default
      filter: true, // Enable filtering by tag
      showRequestDuration: true,
    },
  });

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
