import { Module } from '@nestjs/common';
import { ValidateController } from './modules/validate/validate.controller';
import { ValidateService } from './modules/validate/validate.service';
import { ClientModule } from './modules/client/client.module';

@Module({
  imports: [ClientModule],
  controllers: [ValidateController],
  providers: [ValidateService],
})
export class AppModule {}
