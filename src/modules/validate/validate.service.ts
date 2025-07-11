import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ClientService } from '../client/client.service';
import { CreateUserRequestDto, LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';

const saltRounds = 10;

@Injectable()
export class ValidateService {
  constructor(
    private clientService: ClientService,
    private authService: AuthService,
  ) { }
  async fetchUser(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    // For now, we'll just forward to the login method
    // In a real implementation, you might want to handle fetchUser differently
    return this.login(loginRequest);
  }

  async login(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    this.logger.log(`Login attempt for user: ${loginRequest.email}`);
    
    // Get user from client service
    const user = await this.clientService.fetchUser(loginRequest);
    
    // Verify user exists and is active
    if (!user || !user.isActive) {
      this.logger.warn(`Login failed: User not found or inactive - ${loginRequest.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Login failed: Invalid password for user - ${loginRequest.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Generate tokens
    const tokens = await this.authService.generateTokens(user.id, user.email);
    this.logger.log(`Login successful for user: ${user.email}`);
    console.log(tokens, 'tokens')
    // Return user data with tokens
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
      ...tokens
    };
  }
  private readonly logger = new Logger(ValidateService.name);

  async createUser(createUserDto: CreateUserRequestDto): Promise<LoginResponseDto> {
    this.logger.log('Creating new user');
    
    // Hash the password before sending to client service
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    
    const userToCreate = {
      ...createUserDto,
      password: hashedPassword,
      isActive: true
    };
    
    // Create user in the database
    const createdUser = await this.clientService.createUser(userToCreate);
    this.logger.log(`User created with ID: ${createdUser.id}`);
    
    // Generate tokens
    const tokens = await this.authService.generateTokens(createdUser.id, createdUser.email);
    
    // Return user data with tokens
    return {
      id: createdUser.id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      email: createdUser.email,
      isActive: createdUser.isActive || true,
      ...tokens
    };
  }
}
