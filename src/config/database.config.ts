import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService) => {
  return {
    uri: configService.get<string>('MONGODB_URL'),
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectionFactory: (connection) => {
      connection.on('connected', () => {
        console.log('MongoDB connected successfully!');
      });

      connection.on('error', (err: Error) => {
        console.error('MongoDB connection error:', err);
      });

      connection.on('disconnected', () => {
        console.warn('MongoDB disconnected.');
      });

      if (connection.readyState === 1) {
        console.log('MongoDB is already connected.');
      } else {
        console.log('MongoDB is not connected.');
      }

      return connection;
    },
  };
};
