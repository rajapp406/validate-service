import * as path from 'node:path';

// Define proto file paths relative to the project root
const PROTO_DIR = path.join(process.cwd(), 'node_modules', '@rajapp406', 'proto-definitions', 'protos');
const checkProto = path.join(PROTO_DIR, 'check.proto');
const validateProto = path.join(PROTO_DIR, 'validate.proto');

export { checkProto, validateProto, PROTO_DIR };
