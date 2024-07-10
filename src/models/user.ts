import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Interface to represent a User document in MongoDB
export interface IUser extends Document {
  email: string;
  password: string;
  refreshToken: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Mongoose schema for the User model
const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
});

// Hash the password before saving the user document
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
