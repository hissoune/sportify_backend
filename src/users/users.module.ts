import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './entities/user.entity';

import { AuthGuard } from 'src/guards/auth.guard';

@Module({
  imports:[
    MongooseModule.forFeature([{name:User.name,schema:userSchema}]),
    
  ],
  controllers: [UsersController],
  providers: [UsersService,AuthGuard],
  exports:[AuthGuard]
})
export class UsersModule {}
