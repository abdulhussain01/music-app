import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Favourite from "./pages/Favourite";
import Album from "./pages/Album";
import MyPlaylist from "./pages/MyPlaylist";
import Playlist from "./pages/Playlist";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "./store/slices/theme.slice";
import MusicPlayer from "./components/musicplayer/MusicPlayer";
import ProtectedRoutes from "./components/ProtectedRoutes";

import Search from "./pages/Search";
import Songs from "./pages/Songs";
import axios from "axios";
import { loginUser } from "./store/slices/user.slice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyProfile from "./pages/MyProfile";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import { axiosInstance } from "./lib/axios";

function App() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  const [loading, setLoading] = useState(true);
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
  // Fetch loading state for user

  // Fetch and set the theme
  useEffect(() => {
    const getTheme = localStorage.getItem("theme");
    if (getTheme) {
      dispatch(changeTheme(getTheme));
      document.body.classList = getTheme;
    } else {
      dispatch(changeTheme("dark"));
      localStorage.setItem("theme", "dark");
      document.body.classList = "dark";
    }
  }, [theme, dispatch]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch the user from the token

        const { data } = await axiosInstance.get(
          `/api/v1/user/me`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (data.success) {
          dispatch(loginUser(data.user));
          setIsAuthenticatedUser(true);
        }
      } catch (err) {
        toast.error(err.response.data.message);
        setIsAuthenticatedUser(false);
      }

      setLoading(false);
    };
    fetchUser();
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-[calc(100vh-4.2rem)] relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/song/:id" element={<Songs />} />
          <Route path="/album/:id" element={<Album />} />
          <Route path="/playlist/:id" element={<Playlist />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
          <Route
            element={
              <ProtectedRoutes
                loading={loading}
                isAuthenticated={isAuthenticatedUser}
              />
            }
          >
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/favourite" element={<Favourite />} />
            <Route path="/myplaylist/:id" element={<MyPlaylist />} />
          </Route>
        </Routes>
        <ToastContainer position="bottom-right" theme="dark" />

        <div className="h-20" />
        <MusicPlayer theme={theme} />
      </main>
    </>
  );
}

export default App;
