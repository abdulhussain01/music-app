import {
  registerUser,
  loginUser,
  updateUserPassword,
  getUser,
  logoutUser,
  addSongToFavourites,
  getFavouriteSongs,
  removeFromFavourite,
  deleteUser,
  updateUserProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controllers.js";
import express from "express";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", isAuthenticated, getUser);
router.get("/logout", isAuthenticated, logoutUser);
router.get("/getfavouritesongs", isAuthenticated, getFavouriteSongs);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:token", resetPassword);
router.post("/addtofavourite", isAuthenticated, addSongToFavourites);
router.post("/removefromfavourite", isAuthenticated, removeFromFavourite);

router.put("/update/password", isAuthenticated, updateUserPassword);
router.put("/updateprofile", isAuthenticated, updateUserProfile);

router.delete("/delete", isAuthenticated, deleteUser);

export default router;
