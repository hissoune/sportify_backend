import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/guards/auth.guard';

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
  controllers: [UsersController],
  providers: [UsersService,AuthGuard],
  exports:[AuthGuard]
})
export class UsersModule {}
