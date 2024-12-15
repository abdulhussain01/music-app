import {
  Heart,
  Home,
  ListPlus,
  ListVideo,
  LogIn,
  Menu,
  Moon,
  Sun,
  User,
  UserPlus,
} from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { changeTheme } from "../store/slices/theme.slice";
import SearchInput from "./SearchInput";
import { logoutUser } from "../store/slices/user.slice";
import { toast } from "react-toastify";
import axios from "axios";
import CreatePlaylistModal from "./subcomponents/CreatePlaylistModal";
import useOutsideClick from "./subcomponents/useOutsideClick";
import { axiosInstance } from "../lib/axios";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  const [popup, setPopUp] = useState(false);
  const { theme } = useSelector((state) => state.theme);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const toggleMenuRef = useRef(null);
  useOutsideClick(toggleMenuRef, [setToggleMenu]);

  const handleThemeChange = () => {
    if (theme === "dark") {
      dispatch(changeTheme("light"));
      localStorage.setItem("theme", "light");
    } else {
      dispatch(changeTheme("dark"));
      localStorage.setItem("theme", "dark");
    }
  };

  const handleLogout = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/v1/user/logout`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        dispatch(logoutUser());

        toast.success(data.message);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <nav
      className=" w-full flex justify-between items-center py-3 px-5 border-b border-commonbackgroundtwo gap-5 "
      ref={toggleMenuRef}
    >
      <div className=" cursor-pointer flex gap-5 items-center">
        <Menu onClick={() => setToggleMenu(!toggleMenu)} />

        <Link to={"/"} className="hidden sm:flex w-32 h-full">
          <img
            src="/musikodark.png"
            alt="MusiKoLogo"
            className="hidden dark:block"
          />
          <img
            src="/musikolight.png"
            alt="MusiKoLogo"
            className="dark:hidden"
          />
          {/* <h1 className="  text-3xl font-bold">Musiko</h1> */}
        </Link>
      </div>
      <SearchInput />
      <div
        className={`${
          !toggleMenu ? "-translate-x-[350px]" : ""
        } fixed left-0 w-60 sm:72 md:w-80 inset-0 bg-commonbackgroundtwo p-2  flex flex-col transition-all duration-300 ease-in-out z-20 overflow-y-scroll noscroll`}
      >
        <div className="h-[3.7rem] flex border-b border-commonbackground justify-center items-center ">
          <img
            src="/musikodark.png"
            alt="MusiKoLogo"
            className="hidden dark:block h-10"
          />
          <img
            src="/musikolight.png"
            alt="MusiKoLogo"
            className="dark:hidden h-10"
          />
        </div>

        <ul className="text-center my-4 flex-1">
          <li>
            <Link
              to={"/"}
              className="flex items-center gap-4 text-lg p-3 hover:bg-commonbackground rounded-xl dark:hover:text-commonblack"
              onClick={() => setToggleMenu(false)}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              to={`${isAuthenticated ? "/favourite" : "/login"}`}
              className="flex items-center gap-4 text-lg p-3 hover:bg-commonbackground rounded-xl dark:hover:text-commonblack"
              onClick={() => setToggleMenu(false)}
            >
              <Heart size={20} />
              <span>Favourite Songs</span>
            </Link>
          </li>

          <li onClick={() => setToggleMenu(false)}>
            <button
              className="flex items-center gap-4 w-full text-lg p-3 hover:bg-commonbackground rounded-xl dark:hover:text-commonblack"
              onClick={() => setPopUp(true)}
            >
              <ListPlus size={20} />
              <span>Create A Playlist</span>
            </button>
          </li>

          {user?.myPlaylist?.map((item) => (
            <li key={item.playlistId}>
              <Link
                to={`${
                  isAuthenticated ? `/myplaylist/${item.playlistId}` : "/login"
                }`}
                className="flex items-center gap-4 text-lg p-3 hover:bg-commonbackground rounded-xl dark:hover:text-commonblack"
                onClick={() => setToggleMenu(false)}
              >
                <ListVideo size={20} />
                <span>{item?.name}</span>
              </Link>
            </li>
          ))}

          <div
            to={"/"}
            className="flex items-center gap-4 text-lg  p-3 hover:bg-commonbackground rounded-xl dark:hover:text-commonblack cursor-pointer"
            onClick={handleThemeChange}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            <span>{theme === "light" ? "Dark" : "Light"}</span>
          </div>
        </ul>

        {isAuthenticated && (
          <div className="border-t ">
            <button
              className=" w-full flex items-center gap-4 text-lg p-3 hover:bg-commonbackground rounded-xl dark:hover:text-commonblack mt-3"
              onClick={handleLogout}
            >
              <LogIn />
              <span>Logout</span>
            </button>
          </div>
        )}

        {!isAuthenticated && (
          <div className=" flex justify-center ">
            <Link
              to={"/signup"}
              className="flex items-center gap-4 text-lg justify-center p-3 hover:bg-commonbackground rounded-xl dark:hover:text-commonblack w-full"
              onClick={() => setToggleMenu(false)}
            >
              <UserPlus size={20} />
              <span className=" text-sm md:text-base">Sign Up</span>
            </Link>

            <Link
              to={"/login"}
              className="flex items-center gap-4 text-lg justify-center p-3 hover:bg-commonbackground rounded-xl   dark:hover:text-commonblack w-full"
              onClick={() => setToggleMenu(false)}
            >
              <User size={20} />
              <span className=" text-sm md:text-base">Log In</span>
            </Link>
          </div>
        )}
      </div>
      <CreatePlaylistModal
        isAuthenticated={isAuthenticated}
        popup={popup}
        setPopUp={setPopUp}
      />
    </nav>
  );
};

export default Navbar;
