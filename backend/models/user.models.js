import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Define the User schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: [5, "Username must contain at least 5 characters"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password must contain at least 8 characters"],
    select: false,
  },

  // Favourite songs array storing Song references
  favouriteSongs: [
    {
      type: String,
      ref: "Song", // Referencing the Song model
    },
  ],

  // Playlists that contain an array of Song references
  myPlaylist: [
    {
      name: String,
      playlistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
      },
    },
  ],

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const hashPassword = await bcrypt.hash(this.password, 10);
  this.password = hashPassword;
});

// Method to generate a JWT token
userSchema.methods.generateJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Method to verify the password
userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Export the User model
export const User = mongoose.model("User", userSchema);
