import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { comparePassword, hashPassword } from 'src/utils/password.util';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
 constructor(@InjectModel(User.name) private userModel: Model<User>,
            private readonly jwtService: JwtService
){}

 async create(createUserDto: CreateUserDto) {
    const hashedPassword = await hashPassword(createUserDto.password);
    createUserDto.password = hashedPassword;
  
    const newUser = new this.userModel(createUserDto);
  
    
    return newUser.save();
  }
  async login (createUserDto: CreateUserDto):Promise<{token:string}>{

    const existUser = await this.userModel.findOne({email:createUserDto.email}).exec();

    if (!existUser) {

      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await comparePassword(createUserDto.password, existUser.password);

    if (!isPasswordValid) {

      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({  name: existUser.name, email: existUser.email });

   
    return { token };
    

  }

  findAll() {
    return this.userModel.find().exec();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, {new:true})
  }
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
