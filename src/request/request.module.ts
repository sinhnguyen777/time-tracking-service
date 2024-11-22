import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from 'src/shared/schema/request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
    AuthModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
