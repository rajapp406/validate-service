import { Test, TestingModule } from '@nestjs/testing';
import { ValidateService } from './validate.service';
import { LoginRequestDto } from './dto/login.dto';

describe('ValidateService', () => {
  let service: ValidateService;
  let testLoginRequest: LoginRequestDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidateService],
    }).compile();

    service = module.get<ValidateService>(ValidateService);
    
    // Setup test data
    testLoginRequest = {
      email: 'test@example.com',
      password: 'testpassword123',
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchUser', () => {
    it('should return a user with the provided credentials', async () => {
      const result = await service.fetchUser(testLoginRequest);
      
      expect(result).toBeDefined();
      expect(result.id).toContain('user-');
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe(testLoginRequest.email);
      expect(result.isActive).toBe(true);
      expect(result.accessToken).toBeDefined();
    });
  });

  describe('login', () => {
    it('should return a user with access token when valid credentials are provided', async () => {
      const result = await service.login(testLoginRequest);
      
      expect(result).toBeDefined();
      expect(result.id).toContain('user-');
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe(testLoginRequest.email);
      expect(result.isActive).toBe(true);
      expect(result.accessToken).toBe('mock-jwt-token');
    });
  });
});
