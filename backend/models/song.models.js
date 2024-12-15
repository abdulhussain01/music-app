import mongoose from "mongoose";

// Define the Song schema
const songSchema = new mongoose.Schema({
  // Optional: Mongoose provides _id by default

  id: {
    type: String, // Assuming this is an external ID, if needed
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  type: {
    type: String,
  },
  album: {
    id: String,
    name: String,
    url: {
      type: String,
    },
  },
  year: {
    type: String, // Consider changing this to a Number if storing actual year
  },
  releaseDate: {
    type: Date, // It's better to store dates as Date objects
  },
  duration: {
    type: Number, // Store duration in seconds for easier calculations
  },
  label: String,
  primaryArtists: String,
  primaryArtistsId: String,
  featuredArtists: String,
  featuredArtistsId: String,
  explicitContent: {
    type: Boolean, // Boolean is more suitable for explicit content flags
    default: false,
  },
  playCount: {
    type: Number, // Use Number instead of String for play counts
    default: 0,
  },
  language: String,
  hasLyrics: {
    type: Boolean, // Boolean is better for a flag
    default: false,
  },
  url: {
    type: String,
  },
  copyright: String,
  image: [
    {
      quality: String,
      link: {
        type: String,
      },
    },
  ],
  downloadUrl: [
    {
      quality: String,
      link: {
        type: String,
      },
    },
  ],
});

// Create and export the Song model
export const Song = mongoose.model("Song", songSchema);
