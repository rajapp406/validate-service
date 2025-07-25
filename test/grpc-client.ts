import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';

const PROTO_DIR = join(process.cwd(), 'node_modules', '@rajapp406', 'proto-definitions', 'protos');
const PROTO_PATH = join(PROTO_DIR, 'check.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const validateProto = grpc.loadPackageDefinition(packageDefinition).check as any;

const client = new validateProto.ValidateService(
  'localhost:50588',
  grpc.credentials.createInsecure(),
);

function fetchUser(userId: string) {
  return new Promise((resolve, reject) => {
    client.fetchUser({ userId }, (error: any, response: any) => {
      if (error) {
        console.error('Error:', error);
        reject(error);
      } else {
        console.log('Response:', response);
        resolve(response);
      }
    });
  });
}

// Test the service
async function test() {
  try {
    console.log('Calling fetchUser with userId: test123');
    await fetchUser('test123');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();
