import { IsEmail, IsString, MinLength } from "class-validator";


export class CreateUserDto {
    @IsString()
    name: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsString()
    gender?:string

    @IsString()
    role?:string

    @IsString()
    imagePath:string
}
