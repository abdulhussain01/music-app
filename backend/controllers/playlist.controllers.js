import mongoose from "mongoose";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import HandleErrors from "../middleware/handleError.js";
import { Playlist } from "../models/playlist.models.js";
import { User } from "../models/user.models.js";

export const getAllPlaylist = catchAsyncErrors(async (req, res, next) => {
  const { playlistId } = req.body;

  const playlist = await Playlist.findById(playlistId).populate("songs");

  res.status(200).json({
    success: true,
    playlist,
  });
});

export const createPlaylist = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;
  const userId = req.user._id;

  // Validate the 'name' field
  if (!name || name.trim() === "") {
    return next(new HandleErrors("Name is required.", 400));
  }

  // Create a new Playlist instance
  const newPlaylist = new Playlist({
    name: name.trim(),
    user: userId,
    songs: [], // Initialize with an empty array or as per your requirements
  });

  // Save the new playlist to the database
  const savedPlaylist = await newPlaylist.save();

  // Update the user's playlists array by pushing the new playlist ID
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $push: { myPlaylist: { name: name, playlistId: savedPlaylist._id } } },
    { new: true } // Returns the updated user document
  );

  // Check if the user was found and updated
  if (!updatedUser) {
    // Optionally, delete the created playlist if the user update fails
    await Playlist.findByIdAndDelete(savedPlaylist._id);
    return next(new HandleErrors("User not found.", 404));
  }

  // Respond with the created playlist
  res.status(201).json({
    success: true,
    message: "Playlist created successfully.",
  });
});

export const addSongToPlaylist = catchAsyncErrors(async (req, res, next) => {
  const { playlistId, songs } = req.body; // Get playlistId and songIds array from request body

  if (!playlistId || songs.length <= 0) {
    return res.status(400).json({
      success: false,
      message: "Playlist ID and song IDs are required.",
    });
  }

  // Check if the playlist exists and belongs to the user
  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    return next(new HandleErrors("Playlist not found or unauthorized.", 404));
  }

  // Use $addToSet and $each to add multiple songs, skipping any duplicates
  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $addToSet: { songs: { $each: songs } }, // Adds each song to the songs array, skipping duplicates
    },
    { new: true } // Return the updated document
  );

  res.status(200).json({
    success: true,
    message: "Songs added successfully to the playlist.",
    playlist: updatedPlaylist,
  });
});

export const deletePlaylist = catchAsyncErrors(async (req, res, next) => {
  const { playlistId } = req.params;
  const userId = req.user.id;

  if (!playlistId) {
    return next(new HandleErrors("PlaylistId is Required", 400));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new HandleErrors("User Not Found", 404));
  }

  // Step 2: Check if the playlist with the given `playlistId` exists in the user's `myPlaylist`
  const playlistExists = user.myPlaylist.some(
    (playlist) => playlist.playlistId.toString() === playlistId
  );

  if (!playlistExists) {
    return next(
      new HandleErrors("Playlist not found in your collection.", 404)
    );
  }

  // Step 3: Remove the playlist from the user's `myPlaylist` by matching the `playlistId`
  await User.updateOne(
    { _id: userId },
    { $pull: { myPlaylist: { playlistId: playlistId } } }
  );

  // Step 4: Optionally, delete the playlist from the global Playlist collection if necessary
  await Playlist.findByIdAndDelete(playlistId);

  // Step 5: Send success response
  res.status(200).json({
    success: true,
    message: "Playlist deleted successfully from your collection.",
  });
});

export const deleteSingleSongFromPlaylist = catchAsyncErrors(
  async (req, res, next) => {
    const { songId, playlistId } = req.body;

    if (!songId || !playlistId) {
      return next(new HandleErrors("songId And PlaylistId is Required", 400));
    }

    const songs = await Playlist.findById(playlistId);

    if (!songs) {
      return next(new HandleErrors("Playlist Not Found", 404));
    }

    const songExist = songs.songs.some((song) => song.id === songId);

    if (!songExist) {
      return next(new HandleErrors("song Not Found in Playlist", 404));
    }

    await Playlist.findByIdAndUpdate(playlistId, {
      $pull: { songs: { id: songId } },
    });

    res.status(200).json({
      success: true,
      message: "Song Deleted Successfully",
    });
  }
);
