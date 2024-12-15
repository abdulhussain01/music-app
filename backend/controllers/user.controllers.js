import { User } from "../models/user.models.js";
import { Playlist } from "../models/playlist.models.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import HandleErrors from "../middleware/handleError.js";
import { generateToken } from "../utils/generateToken.js";
import { Song } from "../models/song.models.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { fullName, email, username, password } = req.body;

  if (!fullName || !email || !username || !password) {
    return next(new HandleErrors("All Fields Are Required", 400));
  }

  const user = await User.create({
    fullName,
    email,
    username,
    password,
  });

  await user.save();

  res.status(201).json({
    success: true,
    message: "User Registered",
  });
});

export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new HandleErrors("All Fields Are Required", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new HandleErrors("User Not Found", 404));
  }

  const isPasswordCorrect = await user.verifyPassword(password);

  if (!isPasswordCorrect) {
    return next(new HandleErrors("Invalid Email or Password", 400));
  }

  generateToken(user, "Loggin Successfull", 200, res);
});

export const updateUserPassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new HandleErrors("All Field Are Required", 400));
  }

  if (newPassword !== confirmNewPassword) {
    return next(
      new HandleErrors(
        "New Password and Confirm New Password Does Not Match",
        400
      )
    );
  }

  const user = await User.findById(req.user.id).select("+password");

  const isPasswordCorrect = await user.verifyPassword(currentPassword);

  if (!isPasswordCorrect) {
    return next(new HandleErrors("Current Password Does Not Match", 400));
  }

  user.password = newPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Updated",
  });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

export const updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const { fullName, username, email } = req.body;

  const newData = {
    fullName,
    username,
    email,
  };
  const userId = req.user.id;

  await User.findByIdAndUpdate(userId, newData);

  res.status(200).json({
    success: true,
    message: "Profile Updated",
  });
});

export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      message: "Logged Out",
    });
});

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId);

  const playlist = await Playlist.deleteMany({ user: userId });

  await user.deleteOne();

  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      message: "User Deleted Successfully",
    });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new HandleErrors("User With This Email Not Found", 404));
  }

  const resetPasswordToken = crypto.randomBytes(20).toString("hex");
  const resetPasswordExpireAt = Date.now() + 60 * 60 * 1000;

  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpire = resetPasswordExpireAt;

  await user.save();

  await sendEmail(user.email, resetPasswordToken);

  res.status(200).json({
    success: true,
    message: "Password Reset Link Has Been Send To Your Email",
  });
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;

  const { newPassword, confirmNewPassword } = req.body;

  if (!newPassword || !confirmNewPassword) {
    return next(new HandleErrors("All Fields Required", 400));
  }
  if (newPassword !== confirmNewPassword) {
    return next(
      new HandleErrors(
        "New Password and Confirm New Password Does Not Match",
        400
      )
    );
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new HandleErrors("Invalid Or Expired Token", 400));
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Reset Successfull",
  });
});

export const addSongToFavourites = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id; // Assuming req.user contains the authenticated user's info
  const { song } = req.body; // Assuming the client sends the song object

  // Validate incoming song data
  if (!song || !song.id) {
    return res.status(400).json({
      success: false,
      message: "Invalid song data.",
    });
  }

  // Step 1: Check if the song already exists in the Song collection
  let existingSong = await Song.findOne({ id: song.id });

  // Step 2: If the song doesn't exist, create it
  if (!existingSong) {
    existingSong = new Song(song);
    try {
      await existingSong.save();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error saving the song to the database.",
        error: error.message,
      });
    }
  }

  // Step 3: Fetch the user without populating favouriteSongs
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // Step 4: Check if the song is already in favorites
  const songExists = user.favouriteSongs.includes(existingSong.id);

  if (songExists) {
    return res.status(400).json({
      success: false,
      message: "Song is already in your favourites.",
    });
  }

  // Step 5: Add the song's id to favouriteSongs
  user.favouriteSongs.push(existingSong.id);

  try {
    await user.save();
    return res.status(200).json({
      success: true,

      message: "Song added to favourites.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding song to favourites.",
      error: error.message,
    });
  }
});

export const getFavouriteSongs = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id; // Assuming req.user is populated by the authentication middleware

  // Step 1: Fetch the user without populating favouriteSongs
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // Step 2: Retrieve all songs where id is in favouriteSongs array
  const favouriteSongs = await Song.find({ id: { $in: user.favouriteSongs } });

  res.status(200).json({
    success: true,
    favouriteSongs: favouriteSongs,
  });
});

export const removeFromFavourite = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id; // Assuming req.user contains the authenticated user's info
  const { songId } = req.body; // Assuming the client sends the song object

  // Validate incoming song data

  const user = await User.findByIdAndUpdate(userId, {
    $pull: {
      favouriteSongs: {
        $in: [songId],
      },
    },
  });

  res.status(200).json({
    success: true,
    message: "Song Removed From Favourite",
  });
});
