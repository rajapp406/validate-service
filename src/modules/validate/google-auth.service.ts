import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { ClientService } from '../client';
import { ValidateService } from './validate.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class GoogleAuthService {
  private readonly client: OAuth2Client;

  constructor(
    private configService: ConfigService,
    private clientService: ClientService,
    private authService: AuthService
) {
    this.client = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID')
    );
  }

  async verifyIdToken(idToken: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload();
      if (!payload) throw new UnauthorizedException('Invalid Google token');
      // Extract user info
      const user = await this.clientService.findOrCreateUserByGoogleId({googleId: payload.sub, email: payload.email, firstName: payload.given_name, lastName: payload.family_name, displayName: payload.name})
     console.log(user, 'user')
     const tokens = await this.authService.generateTokens(user.id, user.email);
     console.log(tokens, 'tokens')
     // Return user data with tokens
     return {
       id: user.id,
       firstName: user.firstName,
       lastName: user.lastName,
       email: user.email,
       isActive: user.isActive,
       profile: user.profile,
       ...tokens
     };
    } catch (err) {
        console.log(err, 'err')
      throw new UnauthorizedException(err);
    }
  }
}
