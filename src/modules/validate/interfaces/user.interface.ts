import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string = '';

  @ApiProperty({
    description: 'First name of the user',
    example: 'John'
  })
  firstName: string = '';

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe'
  })
  lastName: string = '';

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com'
  })
  email: string = '';

  @ApiProperty({
    description: 'Indicates if the user account is active',
    example: true
  })
  isActive: boolean = false;

  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  accessToken?: string = '';

  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  refreshToken?: string = '';
}
