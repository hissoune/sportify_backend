import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports:[
    MongooseModule.forFeature([{name:User.name,schema:userSchema}]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), 
        signOptions: { expiresIn: '1h' },
      })
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,AuthGuard],
  exports:[AuthGuard]
})
export class AuthModule {}
