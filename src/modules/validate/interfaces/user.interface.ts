import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string = '';

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe'
  })
  name: string = '';

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
}
