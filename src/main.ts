import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClientModule } from './modules/client/client.module';
import { checkProto } from './utils/protos';
import { AuthModule } from './modules/auth/auth.module';

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
      AppModule,
      // Add all modules that contain controllers with @ApiTags
      ClientModule,
      AuthModule,
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

  await httpApp.listen(process.env.HTTP_PORT || 3600);

  // Start gRPC microservice
  const grpcHost = process.env.GRPC_HOST || '0.0.0.0';
  const grpcPort = process.env.GRPC_PORT || '50588';
  const grpcUrl = `${grpcHost}:${grpcPort}`;
  
  console.log(`Starting gRPC server on ${grpcUrl}`);
  
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: grpcUrl,
        package: 'check',
        protoPath: checkProto,
        loader: {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
        },
      },
    },
  );
  
  await grpcApp.listen();
  console.log(`gRPC server is listening on ${grpcUrl}`);
  console.log('Check Service is running and ready to accept connections');
}

bootstrap();
