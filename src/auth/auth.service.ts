import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";
import { comparePassword, hashPassword } from "src/utils/password.util";


@Injectable()
export class AuthService {
  
    constructor(@InjectModel(User.name) private userModel: Model<User>,
            private readonly jwtService: JwtService

){}

    async register(createUserDto:CreateUserDto) {

   
   
        const existUser = await this.userModel.findOne({email:createUserDto.email}).exec();
      
        if (existUser) {
      
          throw new UnauthorizedException('this email allredy exist ');
        }
          const hashedPassword = await hashPassword(createUserDto.password);
          createUserDto.password = hashedPassword;
        
          const newUser = new this.userModel(createUserDto);
        
          
          return newUser.save();
        }
        async login (createUserDto: CreateUserDto):Promise<{token:string,user:User}>{

            const existUser = await this.userModel.findOne({email:createUserDto.email}).exec();
        
            if (!existUser) {
        
              throw new UnauthorizedException('Invalid email or password');
            }
            const isPasswordValid = await comparePassword(createUserDto.password, existUser.password);
        
            if (!isPasswordValid) {
        
              throw new UnauthorizedException('Invalid email or password');
            }
        
            const token = this.jwtService.sign({id: existUser._id, name: existUser.name, email: existUser.email,role:existUser.role });
        
           
            return { token ,user:existUser};
            
        
          }

}