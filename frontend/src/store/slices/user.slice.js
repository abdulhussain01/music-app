import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosInstance } from "../../lib/axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    isAuthenticated: false,
    language: "hindi",
  },
  reducers: {
    loginUser(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logoutUser(state, action) {
      state.isAuthenticated = false;
      state.user = {};
      state.language = state.language;
    },
    setLanguage(state, action) {
      state.language = action.payload;
    },
  },

  // {
  //   // login user
  //   loginRequest(state, action) {
  //     state.loading = true;
  //     state.isAuthenticated = false;
  //     state.user = {};
  //     state.error = null;
  //   },
  //   loginSuccess(state, action) {
  //     state.loading = false;
  //     state.isAuthenticated = true;
  //     state.user = action.payload;
  //     state.error = null;
  //   },
  //   loginFailed(state, action) {
  //     state.loading = false;
  //     state.isAuthenticated = false;
  //     state.user = {};
  //     state.error = action.payload;
  //   },

  //   //get user
  //   getUserRequest(state, action) {
  //     state.loading = true;
  //     state.isAuthenticated = state.isAuthenticated;
  //     state.user = {};
  //     state.error = null;
  //   },
  //   getUserSuccess(state, action) {
  //     state.loading = false;
  //     state.isAuthenticated = true;
  //     state.user = action.payload;
  //     state.error = null;
  //   },
  //   getUserFailed(state, action) {
  //     state.loading = false;
  //     state.isAuthenticated = false;
  //     state.user = {};
  //     state.error = action.payload;
  //   },

  //   //logout user

  //   logoutUserSuccess(state, action) {
  //     state.loading = false;
  //     state.isAuthenticated = false;
  //     state.user = {};
  //     state.error = null;
  //     state.message = action.payload;
  //   },
  //   logoutUserFailed(state, action) {
  //     state.loading = false;
  //     state.isAuthenticated = state.isAuthenticated;
  //     state.user = state.user;
  //     state.error = action.payload;
  //   },

  //   // update Password

  //   updatePasswordRequest(state, action) {
  //     state.loading = true;
  //     state.isUpdated = false;
  //     state.message = null;
  //     state.error = null;
  //   },
  //   updatePasswordSuccess(state, action) {
  //     state.loading = false;
  //     state.isUpdated = true;
  //     state.message = action.payload;
  //     state.error = null;
  //   },
  //   updatePasswordFailed(state, action) {
  //     state.loading = false;
  //     state.isUpdated = false;
  //     state.message = null;
  //     state.error = action.payload;
  //   },

  //   // update profile

  //   updateProfileRequest(state, action) {
  //     state.loading = true;
  //     state.isUpdated = false;
  //     state.message = null;
  //     state.error = null;
  //   },
  //   updateProfileSuccess(state, action) {
  //     state.loading = false;
  //     state.isUpdated = true;
  //     state.message = action.payload;
  //     state.error = null;
  //   },
  //   updateProfileFailed(state, action) {
  //     state.loading = false;
  //     state.isUpdated = false;
  //     state.message = null;
  //     state.error = action.payload;
  //   },
  //   // update profile and reset after update
  //   updateProfileResetAfterUpdate(state, action) {
  //     state.isUpdated = false;
  //     state.message = null;
  //     state.error = null;
  //   },

  //   // clear function
  //   clearAllErrors(state, action) {
  //     state.error = null;
  //     state.user = state.user;
  //   },
  // },
});

// export const addFavouriteSongs = async (song) => {
//   try {
//     const { data } = await axios.post(
//       `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/addtofavourite`,
//       { song },
//       {
//         withCredentials:true,
//         headers:{
//           "Content-Type":"application/json"
//         }
//       }
//     );

export const fetchUser = () => async (dispatch) => {
  // Fetch the user from the token
  const { data } = await axiosInstance.get(`/api/v1/user/me`, {
    withCredentials: true,
  });

  dispatch(userSlice.actions.loginUser(data.user));
};

export const { loginUser, logoutUser, setLanguage } = userSlice.actions;

export default userSlice.reducer;
