import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document {

@Prop({ required: true })
  name: string;

@Prop({ required: true, unique: true })
  email: string;

@Prop({ required: true })
  password: string;

@Prop({ required: true,enum:['participant','organizer'],default:"participant" })
  role: string;

}

export const userSchema  = SchemaFactory.createForClass(User)
