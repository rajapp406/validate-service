import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private redisClient: Redis;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
    });
  }

  async generateTokens(userId: string, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET', 'accessSecret'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'refreshSecret'),
          expiresIn: '7d',
        },
      ),
    ]);

    // Store refresh token in Redis
    await this.redisClient.set(
      `refresh_token:${userId}`,
      refreshToken,
      'EX',
      60 * 60 * 24 * 7, // 7 days
    );

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const storedToken = await this.redisClient.get(`refresh_token:${userId}`);
    
    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Get user data (you might want to fetch this from your user service)
    const user = { id: userId, email: '' }; // Replace with actual user fetch
    
    // Generate new tokens
    const tokens = await this.generateTokens(user.id, user.email);
    
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.redisClient.del(`refresh_token:${userId}`);
  }

  async validateToken(token: string, isRefresh = false): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(
          isRefresh ? 'JWT_REFRESH_SECRET' : 'JWT_ACCESS_SECRET',
          isRefresh ? 'refreshSecret' : 'accessSecret',
        ),
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
