import { ArrowLeft, Search } from "lucide-react";
import { languages } from "../utils/constents";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../store/slices/user.slice";

import useOutsideClick from "./subcomponents/useOutsideClick";
const SearchInput = () => {
  const [toggleSetting, setToggleSetting] = useState(false);
  const [toggleLanguage, setToggleLanguage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, user, language } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const settingRef = useRef(null);
  useOutsideClick(settingRef, [setToggleSetting, setToggleLanguage]);

  const handleSubmit = () => {
    window.location.href = `/search?query=${searchQuery}`;
  };

  return (
    <div className="flex w-full sm:w-auto items-center justify-between gap-5">
      <div className=" flex items-center w-full sm:w-96 gap-2 bg-commonbackgroundtwo rounded-lg p-2">
        <Search />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? handleSubmit() : "")}
          type="text"
          className="w-full h-6 outline-none  bg-transparent text-lg "
        />

        {/* <select name="" id="" value="all" className="bg-transparent outline-none">
          <option selected value="all">All</option>
          <option value="songs">Songs</option>
          <option value="playlists">Playlist</option>
          <option value="albums">Albums</option>
        </select> */}
      </div>
      {isAuthenticated && (
        <div className="hidden sm:block w-[1px] bg-commonblack h-5 my-auto" />
      )}
      {isAuthenticated && (
        <div
          className="flex  "
          onClick={() => {
            setToggleSetting(true);
          }}
        >
          {user?.image && user?.image ? (
            <img
              src="../../public/vite.svg"
              alt=""
              className="h-10 w-10  bg-white   p-1  rounded-full"
            />
          ) : (
            <h2 className=" capitalize text-primary  h-10 w-10  bg-white rounded-full  text-center text-4xl font-bold  m-auto">
              {user?.fullName[0]}
            </h2>
          )}
        </div>
      )}

      {toggleSetting && (
        <div
          className="absolute top-16 right-5 border z-10 bg-commonbackgroundtwo rounded-lg "
          ref={settingRef}
        >
          {!toggleLanguage && (
            <div className="">
              <div className="px-3 py-2 border-b ">
                <p className="">
                  Username:
                  <span className="ml-2 font-bold">{user?.username}</span>
                </p>
                <p className="">
                  Email:
                  <span className="ml-2 font-bold">{user?.email}</span>
                </p>
              </div>

              <div className="p-2">
                <Link
                  to={"/myprofile"}
                  className="flex items-center gap-4 text-lg  p-3 hover:bg-commonbackground rounded-xl dark:hover:text-commonblack"
                  onClick={() => {}}
                >
                  <span>My Profile</span>
                </Link>

                <button
                  to={"/"}
                  className="w-full flex items-center gap-4 text-lg p-3 hover:bg-commonbackground rounded-xl dark:hover:text-commonblack"
                  onClick={() => setToggleLanguage(true)}
                >
                  <span>Languages</span>
                </button>
              </div>
            </div>
          )}

          {toggleLanguage && (
            <div className="p-2">
              <button
                className=" my-2"
                onClick={() => setToggleLanguage(false)}
              >
                <ArrowLeft />
              </button>
              <div className="grid grid-cols-2 ">
                {languages.map((lang) => (
                  <div
                    className={` text-lg text-start m-1 p-2 hover:bg-commonbackground rounded-md dark:hover:text-commonblack  ${
                      language === lang ? "bg-commonbackground" : ""
                    }`}
                    key={lang}
                  >
                    {/* <Languages size={20} className="w-full" /> */}
                    <button
                      onClick={() => {
                        localStorage.setItem("lang", lang);
                        dispatch(setLanguage(lang));
                      }}
                      className={`w-full capitalize`}
                    >
                      {lang}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
