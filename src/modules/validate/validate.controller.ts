import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ValidateService } from './validate.service';
import { UserResponse } from './interfaces/user.interface';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateUserRequestDto, LoginRequestDto, LoginResponseDto } from './dto/login.dto';



@ApiTags('Users')
@Controller('api/v1/users')
export class ValidateController {
  constructor(private readonly validateService: ValidateService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: '123' })
  @ApiResponse({ 
    status: 200, 
    description: 'The user has been successfully found.',
    type: UserResponse 
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(@Param('id') id: string): Promise<UserResponse> {
    return this.validateService.fetchUser({email: id, password: 'password'});
  }

  @GrpcMethod('ValidateService', 'fetchUser')
  @ApiOperation({ summary: 'Fetch user by userId (gRPC)' })
  @ApiBody({ type: LoginRequestDto, description: 'User credentials' })
  @ApiResponse({ 
    status: 200, 
    description: 'The user has been successfully found via gRPC.',
    type: LoginResponseDto
  })
  async fetchUser(data: LoginRequestDto): Promise<LoginResponseDto> {
    return this.validateService.fetchUser(data);
  }

  @GrpcMethod('ValidateService', 'createUser')
  @ApiOperation({ summary: 'Create user by userId (gRPC)' })
  @ApiBody({ type: CreateUserRequestDto, description: 'User credentials' })
  @ApiResponse({ 
    status: 200, 
    description: 'The user has been successfully created via gRPC.',
    type: CreateUserRequestDto
  })
  async createUser(data: CreateUserRequestDto): Promise<CreateUserRequestDto> {
    return this.validateService.createUser(data);
  }

  @GrpcMethod('ValidateService', 'login')
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully logged in',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    return this.validateService.login(loginRequest);
  }

  @GrpcMethod('ValidateService', 'register')
  @Post('register')
  @ApiOperation({ summary: 'User register' })
  @ApiBody({ type: CreateUserRequestDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully logged in',
    type: CreateUserRequestDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async register(@Body() loginRequest: CreateUserRequestDto): Promise<CreateUserRequestDto> {
    return this.validateService.createUser(loginRequest);
  }
}
