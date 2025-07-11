import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ValidateController } from './modules/validate/validate.controller';
import { ValidateService } from './modules/validate/validate.service';
import { ClientModule } from './modules/client/client.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientModule,
    AuthModule,
  ],
  controllers: [ValidateController],
  providers: [ValidateService],
})
export class AppModule {}
