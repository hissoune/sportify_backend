import { Body, Controller, Post, Req, UnauthorizedException, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';



@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
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
    async register(@Body() createUserDto: CreateUserDto,   @Req() req, @UploadedFile() file: Express.Multer.File,){
  console.log(createUserDto);
  
      if (!file) {
        throw new UnauthorizedException('Image is required');
      }

      const serverUrl = `${req.protocol}://${req.get('host')}`; 
      createUserDto.imagePath = `${serverUrl}/uploads/${file.filename}`;
      console.log(createUserDto);
      
    return this.authService.register(createUserDto)
    }

    @Post('login')
    async login(@Body() createUserDto: CreateUserDto){
      return this.authService.login(createUserDto);
    }

}