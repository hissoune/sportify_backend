import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/users/entities/user.entity';
import { Event, eventSchema } from './entities/event.entity';


@Module({
  imports: [
    MongooseModule.forFeature([{name:User.name,schema:userSchema},{name:Event.name,schema:eventSchema}]),
  
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
