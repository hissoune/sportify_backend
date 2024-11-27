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
import { v4 as uuidv4 } from 'uuid'; // To generate unique filenames
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
          console.log(allowedMimeTypes);
          
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
    console.log(createEventDto);
    
    createEventDto.imagePath = file.filename; 
      console.log(createEventDto);
      
    return this.eventsService.createEvent(createEventDto);
  }

  @Get()
  getAllEvents() {
    return this.eventsService.getAllEvents();
  }

  

  @Get(':id')
  getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  @Patch(':id')
  updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.updateEvent(id, updateEventDto);
  }

  @Delete(':id')
  removeEvent(@Param('id') id: string) {
    return this.eventsService.removeEvent(id);
  }
}
