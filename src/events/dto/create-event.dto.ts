import { IsString, IsNotEmpty, IsDateString, IsMongoId, IsArray, ArrayNotEmpty, IsOptional, Validate } from 'class-validator';


function IsDateAfter24Hours(date: string): boolean {
    const inputDate = new Date(date);
    const currentDate = new Date();
    const twentyFourHoursLater = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    
    return inputDate > twentyFourHoursLater;
  }


export class CreateEventDto {

  @IsString()
  @IsNotEmpty()
  name: string;

 @IsDateString()
  @IsNotEmpty()
  @Validate(IsDateAfter24Hours, {
    message: 'The date must be at least 24 hours later than the current time',
  })
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
