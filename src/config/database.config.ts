import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService) => ({
  uri: configService.get<string>('MONGODB_URL'),
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
