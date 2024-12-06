import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Controller('events')
@UseGuards(AuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}


  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
        }
      },
    }),
  )
  createEvent(
    @Body() createEventDto: CreateEventDto,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {

    
    if (!file) {
      throw new UnauthorizedException('Image is required');
    }
    
  
    const owner = req.user.id;
    createEventDto.owner = owner;
  
    const serverUrl = `${req.protocol}://${req.get('host')}`; 
    createEventDto.imagePath = `${serverUrl}/uploads/${file.filename}`;
  
    return this.eventsService.createEvent(createEventDto);
  }
  

  @Get()
  getAllEvents( @Req() req) {
    const owner = req.user.id; 
    return this.eventsService.getAllEvents(owner);
  }



  @Get(':id')
  getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
        }
      },
    }),
  )
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      const serverUrl = `${req.protocol}://${req.get('host')}`;
      updateEventDto.imagePath = `${serverUrl}/uploads/${file.filename}`;
    }
  
    return this.eventsService.updateEvent(id, updateEventDto);
  }
    

  @Delete(':id')
  removeEvent(@Param('id') id: string) {
    return this.eventsService.removeEvent(id);
  }

  @Delete('removeParticipant/:id')
  
  removeParticipant(@Param('id') id: string, @Body() body){
   
    
    
   const  participantId = body.participantId
    return this.eventsService.removeParticipant(id,participantId);

  }
}
