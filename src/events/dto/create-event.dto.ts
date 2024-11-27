import { IsString, IsNotEmpty, IsDateString, IsMongoId, IsArray, ArrayNotEmpty, IsOptional } from 'class-validator';

export class CreateEventDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  date: string; 

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsMongoId({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  participants?: string[]; 

  @IsString()
  imagePath: string; 

  @IsMongoId()
  @IsOptional()
  owner?: string;

}
