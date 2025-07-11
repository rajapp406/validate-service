import { Injectable } from '@nestjs/common';
import { ClientService } from '../client/client.service';
import { CreateUserRequestDto, LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
const saltRounds = 10;

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
    const hashedPassword = await bcrypt.hash(loginRequest.password, saltRounds);
    const result = await this.clientService.fetchUser(loginRequest)
    const comparePassword = await bcrypt.compare(result.password, hashedPassword)
    console.log('comparePassword', comparePassword);
    if (!comparePassword) {
      throw new Error('Invalid password');
    }
    return result;
  }
  async createUser(loginRequest: CreateUserRequestDto): Promise<CreateUserRequestDto> {
    console.log('createUser', loginRequest);
    
    // Hash the password before sending to client service
    const hashedPassword = await bcrypt.hash(loginRequest.password, saltRounds);
    
    const userToCreate = {
      ...loginRequest,
      password: hashedPassword
    };
    
    const result = await this.clientService.createUser(userToCreate);
    console.log('createUser', result);
    
    // Don't return the hashed password in the response
    const { password, ...userWithoutPassword } = result;
    return userWithoutPassword as CreateUserRequestDto;
  }
}
