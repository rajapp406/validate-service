import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ValidateService } from './validate.service';
import { UserResponse } from './interfaces/user.interface';

interface FetchUserRequest {
  userId: string;
}

@Controller()
export class ValidateController {
  constructor(private readonly validateService: ValidateService) {}

  @GrpcMethod('ValidateService', 'fetchUser')
  async fetchUser(data: FetchUserRequest): Promise<UserResponse> {
    return this.validateService.fetchUser(data.userId);
  }
}
