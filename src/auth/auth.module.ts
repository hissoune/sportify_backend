import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../users/entities/user.entity';

import { AuthGuard } from 'src/guards/auth.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports:[
    MongooseModule.forFeature([{name:User.name,schema:userSchema}]),
    
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
