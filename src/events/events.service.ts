import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel, ModelDefinition } from '@nestjs/mongoose';
import { Event } from './entities/event.entity';
import { Model } from 'mongoose';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private readonly EventModel:Model<Event>){}
  createEvent(createEventDto: CreateEventDto) {
   
    
    const newEvent =new this.EventModel({
      name:createEventDto.name,
      date:createEventDto.date,
      location:createEventDto.location,
      imagePath:createEventDto.imagePath,
      owner:createEventDto.owner
        });
    return newEvent.save();
  }

  getAllEvents(owner:string) {
    return this.EventModel.find({owner:owner}).exec();
  }

  getEventById(id: string) {
    return `This action returns a #${id} event`;
  }

  updateEvent(id: string, updateEventDto: UpdateEventDto) {
    return this.EventModel.findByIdAndUpdate(
      id,
      { $set: updateEventDto }, 
      { new: true }, 
    ).exec();
  }

  removeEvent(id: string) {
    return this.EventModel.findByIdAndDelete(id);
  }
}
