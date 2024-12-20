import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel, ModelDefinition } from '@nestjs/mongoose';
import { Event } from './entities/event.entity';
import { Model } from 'mongoose';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private readonly EventModel:Model<Event>){}
  createEvent(createEventDto: CreateEventDto):Promise<Event> {
   
    
    const newEvent =this.EventModel.create(createEventDto);
     return newEvent;
  }

  getAllEvents(owner:string) {
    return this.EventModel.find({owner:owner}).populate({ path: 'participants', model: 'User' }).populate('owner').exec();
  }

  async getEventById(id: string) {

    const event = await this.EventModel.findById(id).populate({ path: 'participants', model: 'User' }).populate('owner').exec();

    if (!event) {
      throw new NotFoundException('Event not found');

    }
    return event;
  }
 async getEventsForParticipant(participantId:string){
    console.log(participantId);
    

    return await this.EventModel.find({participants:participantId}).populate({ path: 'participants', model: 'User' }).populate('owner').exec();

 }

  async updateEvent(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.EventModel.findById(id);
    if (!event) {
        throw new NotFoundException('Event not found');
    }

    if (updateEventDto.participants) {
        const uniqueParticipants = new Set([
            ...event.participants.map((p) => p.toString()),
            ...updateEventDto.participants, 
        ]);
        updateEventDto.participants = Array.from(uniqueParticipants);
    }

    return this.EventModel.findByIdAndUpdate(
        id,
        { $set: updateEventDto },
        { new: true }
    );
}


  removeEvent(id: string) {
    return this.EventModel.findByIdAndDelete(id);
  }
 async removeParticipant(id:string,participantId:any){
    const event = await this.EventModel.findById(id);
    if (!event) {
        throw new Error('Event not found');
    }

    if (!event.participants.includes(participantId)) {
      throw new Error('Participant not found in event');
  }

  return await this.EventModel.findByIdAndUpdate(
    { _id: id },              
    { $pull: { participants: participantId } } ,
    {new:true}

);

  
  }
}
