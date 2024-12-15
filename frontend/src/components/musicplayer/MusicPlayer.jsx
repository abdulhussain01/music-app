import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import "./musicplayer.css";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/audio.css";

import { useEffect, useRef, useState } from "react"; // For the like button state
import {
  Heart,
  Download,
  ListPlus,
  X,
  EllipsisVertical,
  Loader2,
} from "lucide-react"; // Icons for like and download
import { useDispatch, useSelector } from "react-redux";

import {
  setCurrentIndex,
  setCurrentSong,
} from "../../store/slices/player.slice";
import { converDuration } from "../../utils/durationconvertor";
import { decode } from "html-entities";
import axios from "axios";

import { toast } from "react-toastify";
import useOutsideClick from "../subcomponents/useOutsideClick";
import { addSongToPlaylist } from "../../utils/addSongsToPlaylist";
import Modal from "../subcomponents/Modal";
import { axiosInstance } from "../../lib/axios";

const MusicPlayer = ({ theme }) => {
  const [optionsMenu, setOptionsMenu] = useState("");
  const [fullScreen, setFullScreen] = useState(false);
  const [allPlaylists, setAllPlaylists] = useState();
  const [downloadLoading, setDownloadLoading] = useState(false);

  const { currentSong, currentPlaylist, isplayerActive, currentIndex } =
    useSelector((state) => state.player);

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [liked, setLiked] = useState(); // Manage the like button state

  useEffect(() => {
    setLiked(user?.favouriteSongs);
  }, [user.favouriteSongs]);

 

  const handleDownload = async () => {
    const url1 =
      currentSong?.downloadUrl[4]?.link ||
      currentSong?.downloadUrl[3]?.link ||
      currentSong?.downloadUrl[2]?.link ||
      currentSong?.downloadUrl[1]?.link ||
      currentSong?.downloadUrl[0]?.link;

    try {
      // Fetch the file
      setDownloadLoading(true);

      const response = await fetch(url1);
      // Convert the response to a Blob
      const blob = await response.blob();

      // Create a temporary URL for the Blob object
      const url = window.URL.createObjectURL(blob);

      // Create a link element, trigger the download, and remove the element
      const link = document.createElement("a");
      link.href = url;
      link.download = currentSong.name; // Specify the file name
      document.body.appendChild(link);
      link.click(); // Programmatically click to start the download
      document.body.removeChild(link); // Remove the link element

      // Clean up the blob URL
      window.URL.revokeObjectURL(url);

      setDownloadLoading(false);
      toast.success("Download Complete");
    } catch (err) {
      setDownloadLoading(false);
      toast.error("Download Failed");
      // console.error("Download failed:", error);
    }
  };

  const player = document.querySelector(".vds-audio-layout");
  if (player) {
    player.classList = `vds-audio-layout ${theme}`;
  }

  const contentBoxRef = useRef(null);

  useOutsideClick(contentBoxRef, [setOptionsMenu]);

  if (fullScreen) {
    document.body.style.overflow = "hidden"; // Prevent scrolling when fullscreen
  } else {
    document.body.style.overflow = ""; // Restore scrolling when not fullscreen
  }

  const handleSongEnd = () => {
    if (currentIndex + 1 < currentPlaylist?.songs.length) {
      const nextSong = currentPlaylist?.songs[currentIndex + 1];
      dispatch(setCurrentIndex(currentIndex + 1)); // Set the next song as the current song
      dispatch(setCurrentSong(nextSong)); // Set the next song as the current song
    }
  };

  const handleCurrentSong = (index, item) => {
    dispatch(setCurrentSong(item));
    dispatch(setCurrentIndex(index));
  };

  const handleFavourite = async (item) => {
    if (isAuthenticated) {
      try {
        const { data } = await axiosInstance.post(
          `/api/v1/user/addtofavourite`,
          { song: item },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (data.success) {
          setLiked((prevData) => {
            return [...prevData, currentSong.id];
          });
          toast.success(data.message);
        }
      } catch (err) {
        toast.error(err.response.data.message);
      }
    } else {
      toast.warn("Please Login to Add to Favourite");
    }
  };

  return (
    <div
      className={`fixed ${
        fullScreen
          ? "inset-0 h-full grid md:grid-cols-2 overflow-y-auto md:content-center  "
          : "bottom-0 h-24 "
      }  w-full flex items-center gap-4 px-4 backdrop-filter backdrop-blur-lg backdrop-brightness-50 text-white cursor-pointer `}
    >
      <div
        className={`flex items-center  gap-4 w-full h-full  ${
          fullScreen ? "flex-col" : ""
        }`}
        onClick={() => {
          isplayerActive && setFullScreen(true);
        }}
      >
        <div className={`${fullScreen ? "block " : "hidden"} md:block`}>
          <div
            className={`  overflow-hidden ${fullScreen ? "p-10" : "w-[65px] "}`}
          >
            <img
              src={
                currentSong?.image
                  ? currentSong?.image[2].link
                  : "/songlogo.png"
              }
              alt={`song logo`}
              className={` aspect-square  rounded-full m-auto ${
                !fullScreen && isplayerActive ? "animate-slow " : "w-[20rem]"
              } animate-none`}
            />
          </div>
          <div className={`${fullScreen ? "block text-center" : "hidden"}`}>
            <h2 className="font-bold text-2xl">{decode(currentSong?.name)}</h2>
            <p className="text-wrap">
              {currentSong?.primaryArtists?.split().join(",")}
            </p>
          </div>
        </div>

        {/* Media Player */}
        <div
          className={`flex ${
            fullScreen ? "flex-col-reverse gap-4  customeWidth" : "w-full"
          }  justify-between items-center  `}
        >
          <MediaPlayer
            src={
              (currentSong?.downloadUrl && currentSong?.downloadUrl[4]?.link) ||
              (currentSong?.downloadUrl && currentSong?.downloadUrl[3]?.link) ||
              (currentSong?.downloadUrl && currentSong?.downloadUrl[2]?.link)
            }
            viewType="audio"
            streamType="on-demand"
            logLevel="warn"
            crossOrigin
            playsInline
            title={decode(currentSong?.name)}
            autoPlay
            poster={currentSong?.image && currentSong?.image[2].link}
            onEnded={handleSongEnd}
          >
            <MediaProvider />
            <DefaultAudioLayout icons={defaultLayoutIcons} />
          </MediaPlayer>

          <div
            className={`${
              fullScreen ? "flex rounded-lg px-2" : "hidden"
            } gap-2 md:flex  h-[60px] bggradient text-white`}
          >
            <button
              disabled={liked?.includes(currentSong.id) ? true : false}
              onClick={() => handleFavourite(currentSong)}
              className="flex items-center justify-center p-2 rounded-lg transition-colors duration-300"
            >
              <Heart
                size={20}
                color={
                  user?.favouriteSongs?.includes(currentSong.id) ||
                  liked?.includes(currentSong.id)
                    ? "red"
                    : "white"
                }
                fill={
                  user?.favouriteSongs?.includes(currentSong.id) ||
                  liked?.includes(currentSong.id)
                    ? "red"
                    : "none"
                }
              />
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center justify-center p-2 rounded-lg transition-colors duration-300"
            >
              {downloadLoading ? (
                <Loader2 size={20} color={` white `} className="animate-spin" />
              ) : (
                <Download size={20} color={` white `} />
              )}
            </button>

            <div
              className="flex items-center justify-center p-2 rounded-lg transition-colors duration-300 relative"
              onClick={() => setOptionsMenu("savesong")}
            >
              <button>
                <ListPlus size={20} color={` white `} />
              </button>

              {optionsMenu === "savesong" && (
                <div
                  className="absolute right-8 top-5 text-commonblack z-10 text-nowrap"
                  ref={contentBoxRef}
                >
                  {!allPlaylists && (
                    <div className="bg-commonbackgroundtwo rounded-lg border border-black text-center ">
                      {user?.myPlaylist?.map((playlist) => (
                        <div className="" key={playlist.playlistId}>
                          <h2 className="px-4 py-2 ">All Playlists</h2>
                          <button
                            onClick={() =>
                              addSongToPlaylist(playlist.playlistId, [
                                currentSong,
                              ])
                            }
                            className="w-full hover:bg-commonbackground  px-4 py-2"
                          >
                            {playlist.name}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Section */}
      <div
        className={`${
          fullScreen ? " flex flex-col " : "hidden"
        } h-full lg:w-[90%] lg:mx-10  `}
      >
        <h2 className="my-5 px-8 text-3xl font-bold">Playlist</h2>

        <div className="   px-6 flex flex-col  h-[70vh] overflow-scroll noscroll">
          {currentPlaylist?.songs?.map((item, index) => (
            <div
              className={` grid grid-cols-3  content-between border-b-2 py-2 relative ${
                currentSong?.id === item.id
                  ? "text-commonblack dark:text-primary"
                  : ""
              } `}
              key={item.id}
            >
              <button
                className={`col-start-1 col-end-3 flex gap-4 items-center w-full `}
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
              {/* {optionsMenu === item.id && (
                <div
                  className="absolute right-8 top-5 text-commonblack z-10"
                  ref={contentBoxRef}
                >
                  <div className=" bg-commonbackgroundtwo rounded-lg border border-black text-center">
                    <h3 className="text-lg font-bold border-b-2 border-commonbackground">
                      Options
                    </h3>
                    <div className="flex flex-col ">
                      {item.album && (
                        <Link
                          onClick={() => {}}
                          to={`/album/${item.album.id}`}
                          className="hover:bg-commonbackground  px-4 py-2"
                        >
                          Go to album
                        </Link>
                      )}
                      <button
                        onClick={() => handleFavourite(item)}
                        className="hover:bg-commonbackground px-4 py-2 rounded-b-lg"
                      >
                        Add to Favourite
                      </button>
                      <button className="hover:bg-commonbackground px-4 py-2 rounded-b-lg">
                        Add to Playlist
                      </button>
                    </div>
                  </div>
                </div>
              )} */}
              <Modal
                song={item}
                optionsMenu={optionsMenu}
                songId={item.id}
                albumId={item.album.id}
                setOptionsMenu={setOptionsMenu}
                allPlaylists={allPlaylists}
                setAllPlaylists={setAllPlaylists}
                user={user}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Toggle Button */}
      {fullScreen && (
        <div
          className="absolute top-5 right-5 p-2 cursor-pointer"
          onClick={() => setFullScreen(false)}
        >
          <X size={25} />
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
