import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface ClientServiceGrpc {
  fetchUser(data: { email: string; password: string }): Observable<any>;
  Health(data: { }): Observable<{ status: string }>;
  Register(data: { email: string; password: string; name: string }): Observable<{ user_id: string; email: string; access_token: string }>;
  Login(data: { email: string; password: string }): Observable<{ user_id: string; email: string; access_token: string }>;
  VerifyToken(data: { token: string }): Observable<{ valid: boolean; user?: any }>;
}

@Injectable()
export class ClientService implements OnModuleInit {
  public clientService?: ClientServiceGrpc;

  constructor(
    @Inject('CLIENT_PACKAGE') private readonly clientRpc: ClientGrpc

  ) {}

  onModuleInit() {
    this.clientService = this.clientRpc.getService<ClientServiceGrpc>('ClientService');
  }

  // Implement methods to call gRPC endpoints

  async fetchUser(credentials: { email: string; password: string }) {
    if (!this.clientService) {
      throw new Error('gRPC service not initialized');
    }
    
    if (!credentials.email || !credentials.password) {
      throw new Error('Both email and password are required');
    }
    
    return this.clientService.fetchUser({
      email: credentials.email,
      password: credentials.password
    }).toPromise();
  }
}
