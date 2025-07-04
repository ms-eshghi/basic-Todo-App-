import mongoose, { Document, Schema } from "mongoose";

export interface ITodo {
  todo: string;
  checked?: boolean;
}

export interface IUser extends Document {
  name: string;
  todos: ITodo[];
}

const TodoSchema: Schema<ITodo> = new Schema({
  todo: { type: String, required: true },
  checked: { type: Boolean, default: false },
});

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  todos: [TodoSchema],
});

export const User = mongoose.model<IUser>("User", UserSchema);