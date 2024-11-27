import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  createEvent(createEventDto: CreateEventDto) {
    return 'This action adds a new event';
  }

  getAllEvents() {
    return `This action returns all events`;
  }

  getEventById(id: string) {
    return `This action returns a #${id} event`;
  }

  updateEvent(id: string, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  removeEvent(id: number) {
    return `This action removes a #${id} event`;
  }
}
