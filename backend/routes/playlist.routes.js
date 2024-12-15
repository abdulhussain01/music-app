import {
  getAllPlaylist,
  createPlaylist,
  addSongToPlaylist,
  deletePlaylist,
  deleteSingleSongFromPlaylist,
} from "../controllers/playlist.controllers.js";
import express from "express";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/getall", isAuthenticated, getAllPlaylist);
router.post("/createplaylist", isAuthenticated, createPlaylist);
router.delete("/deleteplaylist/:playlistId", isAuthenticated, deletePlaylist);
router.put("/deletesong", isAuthenticated, deleteSingleSongFromPlaylist);
router.post("/addsinglesongtoplaylist", isAuthenticated, addSongToPlaylist);

export default router;
