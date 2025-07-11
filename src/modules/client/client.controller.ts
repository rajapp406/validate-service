import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ClientService } from './client.service';

class FetchUserDto {
  email: string;
  password: string;
}

@Controller('client')
export class ClientController {
  constructor(public readonly clientService: ClientService) { }

  @Post('fetchUser')
  @ApiOperation({ 
    summary: 'Fetch user by credentials',
    description: 'Fetches a user by their email and password.'
  })
  @ApiBody({
    type: FetchUserDto,
    examples: {
      example: {
        value: {
          email: 'user@example.com',
          password: 'userpassword123'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User found',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        isActive: { type: 'boolean' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Email and password are required.' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials.' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found.' 
  })
  async fetchUser(@Body() credentials: FetchUserDto) {
    try {
      if (!this.clientService) {
        throw new Error('gRPC service not initialized');
      }
      
      if (!credentials.email || !credentials.password) {
        throw new BadRequestException('Email and password are required');
      }
      
      return await this.clientService.fetchUser({
        email: credentials.email,
        password: credentials.password
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

}
