import { Controller, Get, Param } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ValidateService } from './validate.service';
import { UserResponse } from './interfaces/user.interface';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

class FetchUserRequest {
  @ApiProperty({ 
    description: 'The ID of the user to fetch',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  userId: string = '';
}

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
    return this.validateService.fetchUser(id);
  }

  @GrpcMethod('ValidateService', 'fetchUser')
  @ApiOperation({ summary: 'Fetch user by userId (gRPC)' })
  @ApiBody({ type: FetchUserRequest, description: 'User ID in gRPC request format' })
  @ApiResponse({ 
    status: 200, 
    description: 'The user has been successfully found via gRPC.',
    type: UserResponse 
  })
  async fetchUser(data: FetchUserRequest): Promise<UserResponse> {
    return this.validateService.fetchUser(data.userId);
  }
}
