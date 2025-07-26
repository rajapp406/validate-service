import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';

const PROTO_DIR = join(process.cwd(), 'node_modules', '@rajapp406', 'proto-definitions', 'protos');

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CLIENT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'client',
          protoPath: join(PROTO_DIR, 'client.proto'),
          url: 'client-service:50522',
          channelOptions: {
            'grpc.keepalive_time_ms': 10000,
            'grpc.keepalive_timeout_ms': 5000,
            'grpc.keepalive_permit_without_calls': 1,
            'grpc.http2_max_pings_without_data': 0,
            'grpc.max_send_message_length': 1024 * 1024 * 50,
            'grpc.max_receive_message_length': 1024 * 1024 * 50,
          },
          loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
          }
        },
      },
    ]),
  ],
  providers: [ClientService],
  controllers: [ClientController],
  exports: [ClientService],
})
export class ClientModule {
  constructor() {
    console.log('ClientModule initialized with proto directory:', PROTO_DIR);
  }
}
