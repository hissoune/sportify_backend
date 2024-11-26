import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {  hashPassword } from 'src/utils/password.util';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
 constructor(@InjectModel(User.name) private userModel: Model<User>,
          
){}

 async create(createUserDto: CreateUserDto) {


  const existUser = await this.userModel.findOne({email:createUserDto.email}).exec();

  if (existUser) {

    throw new UnauthorizedException('this email allredy exist ');
  }
    const hashedPassword = await hashPassword(createUserDto.password);
    createUserDto.password = hashedPassword;
  
    const newUser = new this.userModel(createUserDto);
  
    
    return newUser.save();
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
  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
