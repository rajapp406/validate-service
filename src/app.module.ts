import { Module } from '@nestjs/common';
import { ValidateController } from './validate/validate.controller';
import { ValidateService } from './validate/validate.service';

@Module({
  imports: [],
  controllers: [ValidateController],
  providers: [ValidateService],
})
export class AppModule {}
