import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@Schema({timestamps:true})

export class Event extends Document {

    @Prop({ required: true })
    name: string;
  
    @Prop({ required: true })
    date: Date;
  
    @Prop({ required: true })
    location: string;

    @Prop({ type: [{ type: Types.ObjectId, ref:'User' }] })

    participants: Types.ObjectId[];
    
    @Prop({required:true})
    imagePath:string
    @Prop({ type: Types.ObjectId, ref: 'User', required: true }) 
     owner: Types.ObjectId;

 
}
export const eventSchema = SchemaFactory.createForClass(Event)
