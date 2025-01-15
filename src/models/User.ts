import { Schema, Document, model } from 'mongoose';
const jwt = require('jsonwebtoken')

// Define an interface for the User document
export interface UserInterface extends Document {
    name: string;
    username: string;
    email: string;
    password: string,
    createdAt?: Date;
    updatedAt?: Date;
    generateAuthToken(): string, 
}

// Define the schema for the User model
const userSchema = new Schema<UserInterface>(
  {
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required'],
        minlength: [3, 'Username must be at least 3 characters long'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        validate: {
            validator: (v: string) => {
              // Regex to validate email format
              return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: (props: any) => `${props.value} is not a valid email address!`,
        },
    },
    password: {
        type: String,
        unique: true,
        required: [true, 'Password is required'],
    },
  },
  { timestamps: true }
);

// Add the method for generating JWT
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
      { _id: this._id },
      process.env.JWT_SEC as string
    );
};
  

// Export the User model
const User = model<UserInterface>('User', userSchema);
export default User;
