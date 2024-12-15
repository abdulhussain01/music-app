import { createSlice } from "@reduxjs/toolkit";

const playerSlice = createSlice({
  name: "player",
  initialState: {
    isPlaying: false,
    isSongLoaded: false,
    currentSong: {},
    currentPlaylist: {},
    currentIndex: 0,
    isplayerActive: false,
  },
  reducers: {
    setCurrentSong(state, action) {
      state.currentSong = action.payload;
      state.isSongLoaded = true;
    },
    setCurrentPlaylist(state, action) {
      state.currentPlaylist = action.payload;
    },
    setIsPlaying(state, action) {
      state.isPlaying = action.payload;
    },
    setIsPlayerActive(state, action) {
      state.isplayerActive = action.payload ? action.payload :true;
    },
    setCurrentIndex(state, action) {
      state.currentIndex = action.payload;
    },
  },
});

export const { setCurrentSong, setCurrentPlaylist, setIsPlaying,setIsPlayerActive,setCurrentIndex } =
  playerSlice.actions;

export default playerSlice.reducer;
