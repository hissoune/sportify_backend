import { Model } from "mongoose";
import { Event } from "./entities/event.entity";
import { getModelToken } from "@nestjs/mongoose";
import { EventsService } from "./events.service";
import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";

describe('EventsService', () => {
  let eventService: EventsService;
  let model: Model<Event>;

  const mockEvent = {
    _id: "674c406cc15a3175b4b5e354",
    name: "sitweb development",
    date: "2024-12-15T00:00:00.000Z",
    location: "ertyui",
    participants: [
      { _id: "6745c7a9882d90fe50c41a71", name: "ana", email: "pofamyrywe@mailvbnhinator.com", role: "organizer" },
      { _id: "6745ee021accaf64fc50f438", name: "gfdhjskqoP", email: "gfdh@jskqovP", role: "participant" }
    ],
    imagePath: "http://localhost:3000/uploads/image.jpg",
    owner: { _id: "6745a201987bd95c5d65e0a0", name: "ana", email: "owner@mail.com", role: "organizer" },
    createdAt: "2024-12-01T10:54:36.875Z",
    updatedAt: "2024-12-01T11:00:34.589Z",
    __v: 0
  };

  const mockQuery = {
    populate: jest.fn().mockReturnThis(), 
    exec: jest.fn().mockResolvedValue(mockEvent), 
  };

  const mockModel = {
    findById: jest.fn().mockReturnValue(mockQuery), 
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken(Event.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    eventService = module.get<EventsService>(EventsService);
    model = module.get<Model<Event>>(getModelToken(Event.name));
  });

  describe('getEventById', () => {
    it('should return an event with populated fields by its id', async () => {
      const result = await eventService.getEventById(mockEvent._id);
  
      expect(mockModel.findById).toHaveBeenCalledWith(mockEvent._id);
      expect(mockQuery.populate).toHaveBeenCalledWith({ path: 'participants', model: 'User' });
      expect(mockQuery.populate).toHaveBeenCalledWith('owner');
      expect(result).toEqual(mockEvent);
    });
  
    it('should throw a NotFoundException if the event is not found', async () => {
      const mockQuery = { populate: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(null) };
    
      mockModel.findById.mockReturnValue(mockQuery);
    
      await expect(eventService.getEventById('nonexistentId')).rejects.toThrowError(NotFoundException);
    
      expect(mockModel.findById).toHaveBeenCalledWith('nonexistentId');
      expect(mockQuery.populate).toHaveBeenCalledWith({ path: 'participants', model: 'User' });
      expect(mockQuery.populate).toHaveBeenCalledWith('owner');
    });
    
  });
  


});
