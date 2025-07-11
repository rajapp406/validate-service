import { Injectable } from '@nestjs/common';
import { ClientService } from '../client/client.service';
import { CreateUserRequestDto, LoginRequestDto, LoginResponseDto } from './dto/login.dto';

@Injectable()
export class ValidateService {
  constructor(
    private clientService: ClientService
  ) { }
  async fetchUser(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    // For now, we'll just forward to the login method
    // In a real implementation, you might want to handle fetchUser differently
    return this.login(loginRequest);
  }

  async login(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    // TODO: Implement actual authentication logic
    // For now, return a mock response
    console.log('login', loginRequest);
    const result =  await this.clientService.fetchUser(loginRequest)
    console.log('login', result);
    return result;
  }
  async createUser(loginRequest: CreateUserRequestDto): Promise<CreateUserRequestDto> {
    console.log('createUser', loginRequest);
    const result =  await this.clientService.createUser(loginRequest)
    console.log('createUser', result);
    return result;  
  }
}
