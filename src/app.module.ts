import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { JwtModule } from '@nestjs/jwt';
import config  from './utils/config/config';
import { AuthGuard } from './guards/auth.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { User, userSchema } from './users/entities/user.entity';


@Module({
  imports: [
    MongooseModule.forFeature([{name:User.name,schema:userSchema}]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), 
      serveRoot: '/uploads', 
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache:true,
    load:[config]
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
      }),
      global:true,
      inject:[ConfigService]
    }),
    MongooseModule.forRootAsync({

      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.connectionString'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    EventsModule
  ],
  controllers: [],
  providers: [AuthGuard],
})
export class AppModule {}
