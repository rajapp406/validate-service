import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateUserRequestDto } from '../validate/dto/login.dto';

interface ClientServiceGrpc {
  fetchUser(data: { email: string; password: string }): Observable<any>;
  Health(data: { }): Observable<{ status: string }>;
  createUser(data: { email: string; password: string; firstName: string; lastName: string }): Observable<{ user_id: string; email: string; access_token: string }>;
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
    console.log(this.clientService, 'this.clientService', credentials)
    return this.clientService.fetchUser({
      email: credentials.email,
      password: credentials.password
    }).toPromise();
  }

  async createUser(credentials: CreateUserRequestDto) {
    if (!this.clientService) {
      throw new Error('gRPC service not initialized');
    }
    
    if (!credentials.email || !credentials.password) {
      throw new Error('Both email and password are required');
    }
    console.log(this.clientService, 'this.clientService')
    return this.clientService.createUser({
      email: credentials.email,
      password: credentials.password,
      firstName: credentials.firstName,
      lastName: credentials.lastName
    }).toPromise() as any;
  }
}
