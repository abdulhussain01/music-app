import { useEffect, useRef, useState } from "react";
import Container from "../components/subcomponents/Container";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentIndex,
  setCurrentPlaylist,
  setCurrentSong,
  setIsPlayerActive,
} from "../store/slices/player.slice";

import { EllipsisVertical } from "lucide-react";
import { converDuration } from "../utils/durationconvertor";
import { decode } from "html-entities";
import { toast } from "react-toastify";
import Modal from "../components/subcomponents/Modal";
import { axiosInstance } from "../lib/axios";

const Favourite = () => {
  const [favouriteInfo, setFavouriteInfo] = useState();

  const [optionsMenu, setOptionsMenu] = useState("");
  const [allPlaylists, setAllPlaylists] = useState();
  const { user } = useSelector((state) => state.user);

  const { isplayerActive, currentSong } = useSelector((state) => state.player);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFavourite = async () => {
      const { data } = await axiosInstance.get(
        `/api/v1/user/getfavouritesongs`,

        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setFavouriteInfo(data.favouriteSongs);
    };

    fetchFavourite();
  }, []);

  const contentBoxRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contentBoxRef.current &&
        !contentBoxRef.current.contains(event.target)
      ) {
        setOptionsMenu("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOptionsMenu]);

  const handleCurrentSong = (index, item) => {
    dispatch(setCurrentSong(item));
    !isplayerActive && dispatch(setIsPlayerActive());
    dispatch(setCurrentIndex(index));
    dispatch(setCurrentPlaylist({ songs: favouriteInfo }));
  };

  const handleRemoveFavourite = async (id) => {
    const { data } = await axiosInstance.post(
      `/api/v1/user/removefromfavourite`,
      { songId: id },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      // Update the favorite songs list by filtering out the removed song
      setFavouriteInfo((prev) => prev.filter((song) => song.id !== id));
      // Close the options menu
      setOptionsMenu("");
      // If the removed song is the current song, handle accordingly
      if (currentSong.id === id) {
        dispatch(setIsPlayerActive(false));
        dispatch(setCurrentSong({}));
        dispatch(setCurrentPlaylist({}));
      }
    } else {
      toast.error(data.message || "Failed to remove the song.");
    }
  };

  if (!favouriteInfo) {
    return <h1>Loaing</h1>;
  }
  return (
    <Container>
      <div className=" flex flex-col gap-8 border-b">
        {/* <img
          src={favouriteInfo?.image[2]?.link}
          alt=""
          className="w-[20rem] h-auto rounded-full"
        /> */}

        <div className="">
          <h1 className="text-4xl md:text-6xl font-bold mb-3">Favourites</h1>

          <p className="text-xl mb-5">
            Total Songs: {favouriteInfo?.length || 0}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl md:text-4xl font-bold ">All Songs</h2>
        {favouriteInfo ? (
          <div className="flex flex-col gap-5">
            {favouriteInfo?.map((item, index) => (
              <div
                className={` grid grid-cols-3  content-between border-b-2 py-2 relative ${
                  currentSong.id === item.id ? "text-primary" : ""
                } `}
                key={item.id}
              >
                <button
                  className="col-start-1 col-end-3 flex gap-4 items-center w-full"
                  onClick={() => {
                    handleCurrentSong(index, item);
                  }}
                >
                  <div
                    className="w-[75px] h-[75px] relative"
                    style={{ minWidth: "80px" }}
                  >
                    <img
                      src={item?.image[1]?.link}
                      alt=""
                      className="absolute w-full h-full object-cover left-0 top-0 rounded-lg"
                      style={{ minWidth: "80px" }} // Ensure the image keeps its width
                    />
                  </div>
                  <div className="text-start">
                    <h3 className="sm:text-xl font-bold line-clamp-1 text-wrap ">
                      {decode(item?.name)}
                    </h3>
                    <p className="text-sm line-clamp-1 overflow-x-clip max-w-72 lg:max-w-full">
                      {item?.primaryArtists}
                    </p>
                  </div>
                </button>
                <div className="col-start-3  flex sm:gap-5 justify-end items-center">
                  <div className="">
                    <p>{converDuration(item.duration)}</p>
                  </div>
                  <button
                    className="p-2 "
                    onClick={() => setOptionsMenu(item.id)}
                  >
                    <EllipsisVertical />
                  </button>
                </div>
                {optionsMenu === item.id && (
                  <Modal
                    song={item}
                    optionsMenu={optionsMenu}
                    songId={item.id}
                    albumId={item.album.id}
                    setOptionsMenu={setOptionsMenu}
                    allPlaylists={allPlaylists}
                    setAllPlaylists={setAllPlaylists}
                    user={user}
                    handleDeleteFromFavourite={handleRemoveFavourite}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className=" text-center text-xl">No Favourite Songs </div>
        )}
      </div>
    </Container>
  );
};

export default Favourite;
