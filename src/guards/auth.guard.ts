import { ExecutionContext, NotAcceptableException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/users/entities/user.entity";



export  class AuthGuard {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>,
               private readonly jwtService: JwtService,
               
) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
          throw new UnauthorizedException('No token provided');
        }
        try {
            const decoded = this.jwtService.verify(token);

            const user = await this.userModel.findOne({email:decoded.email}); 
                
                
               if (user.role != 'organizer') {
                   
                throw new NotAcceptableException(user.role+'doesnt have this access');
               }

            request.user = user;

            return true
        } catch (error) {
             
        }
    
    }
}