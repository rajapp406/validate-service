import { Controller, Get, Param, Post, Body, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ValidateService } from './validate.service';
import { UserResponse } from './interfaces/user.interface';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserRequestDto, LoginRequestDto, LoginResponseDto, RefreshTokenDto } from './dto/login.dto';
import { AuthService } from '../auth/auth.service';



@ApiTags('Authentication')
@Controller('api/v1/auth')
export class ValidateController {
  constructor(
    private readonly validateService: ValidateService,
    private readonly authService: AuthService,
  ) {}

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

  @GrpcMethod('ValidateService', 'login')
  @ApiOperation({ summary: 'Fetch user by credentials (gRPC)' })
  @ApiBody({ type: LoginRequestDto, description: 'User credentials' })
  @ApiResponse({ 
    status: 200, 
    description: 'The user has been successfully found via gRPC.',
    type: LoginResponseDto
  })
  async fetchUser(data: LoginRequestDto): Promise<LoginResponseDto> {
    return this.validateService.login(data);
  }

  @GrpcMethod('ValidateService', 'createUser')
  @ApiOperation({ summary: 'Create new user (gRPC)' })
  @ApiBody({ type: CreateUserRequestDto, description: 'User registration data' })
  @ApiResponse({ 
    status: 201, 
    description: 'The user has been successfully created via gRPC.',
    type: LoginResponseDto
  })
  async createUser(data: CreateUserRequestDto): Promise<LoginResponseDto> {
    return this.validateService.createUser(data);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserRequestDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'User successfully registered', 
    type: LoginResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Bad Request' 
  })
  async register(@Body() createUserDto: CreateUserRequestDto): Promise<LoginResponseDto> {
    return this.validateService.createUser(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ status: 200, description: 'User successfully logged in', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    return this.validateService.login(loginRequest);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token successfully refreshed', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    const payload = await this.authService.validateToken(refreshToken, true);
    return this.authService.refreshTokens(payload.sub, refreshToken);
  }

  @GrpcMethod('ValidateService', 'validateToken')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token successfully refreshed', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async validateToken(@Body() refreshTokenDto: Pick<LoginResponseDto, 'accessToken'>) {
   console.log(refreshTokenDto, 'refreshTokenDto.accessToken')
    return await this.authService.validateToken(refreshTokenDto.accessToken);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const payload = await this.authService.validateToken(token);
      await this.authService.logout(payload.sub);
    }
    return { message: 'Successfully logged out' };
  }
}
