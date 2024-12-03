import { connect, connection } from 'mongoose';
import { config } from '../../config';

connection.on('connected', () => console.log('connected'));
connection.on('open', () => console.log('open'));
connection.on('disconnected', () => console.log('disconnected'));
connection.on('reconnected', () => console.log('reconnected'));
connection.on('disconnecting', () => console.log('disconnecting'));
connection.on('close', () => console.log('close'));

await connect(config.db, {
  serverSelectionTimeoutMS: 5000,
});