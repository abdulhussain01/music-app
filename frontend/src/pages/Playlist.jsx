import React, { useEffect, useRef, useState } from "react";
import Container from "../components/subcomponents/Container";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentIndex,
  setCurrentPlaylist,
  setCurrentSong,
  setIsPlayerActive,
} from "../store/slices/player.slice";

import { CirclePlay, EllipsisVertical } from "lucide-react";
import { converDuration } from "../utils/durationconvertor";
import { decode } from "html-entities";
import useOutsideClick from "../components/subcomponents/useOutsideClick";
import { addSongToPlaylist } from "../utils/addSongsToPlaylist";
import Modal from "../components/subcomponents/Modal";

const Playlist = () => {
  const [playlistInfo, setPlaylistInfo] = useState();
  const [allPlaylists, setAllPlaylists] = useState();

  const [optionsMenu, setOptionsMenu] = useState("");

  const { id } = useParams();

  const { isplayerActive, currentSong, currentPlaylist } = useSelector(
    (state) => state.player
  );
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPlaylist = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_MUSIC_API}/playlists?id=${id}`
      );

      setPlaylistInfo(data.data);
    };

    fetchPlaylist();
  }, [id, dispatch]);

 

  const menuRef = useRef(null);
  useOutsideClick(menuRef, [setOptionsMenu, setAllPlaylists]);

  if (!playlistInfo) {
    return <h1>Loaing</h1>;
  }

  const handlePlaySong = (index, item) => {
    dispatch(setCurrentSong(item));
    dispatch(setCurrentIndex(index));
    !isplayerActive && dispatch(setIsPlayerActive());
    dispatch(setCurrentPlaylist(playlistInfo));
  };

  const handleCurrentSong = (index, item) => {
    dispatch(setCurrentSong(item));
    !isplayerActive && dispatch(setIsPlayerActive());
    dispatch(setCurrentIndex(index));
    currentPlaylist.id !== id && dispatch(setCurrentPlaylist(playlistInfo));
  };

  return (
    <Container>
      <div className=" flex flex-col items-center gap-8 md:flex-row min-w-64 border-b pb-5">
        <img
          src={playlistInfo?.image[2]?.link}
          alt=""
          className="w-[20rem] h-auto rounded-full"
        />

        <div className="text-center md:text-start ">
          <h1 className="text-2xl md:text-4xl font-bold mb-3">
            {decode(playlistInfo?.name)}
          </h1>
          <p className="text-xl mb-5">Total Songs: {playlistInfo?.songCount}</p>

          <div className="flex flex-col md:flex-row justify-between gap-5">
            <button
              onClick={() => {
                handlePlaySong(0, playlistInfo?.songs[0]);
              }}
              className="border px-4 py-2 rounded-lg bg-commonbackgroundtwo hover:text-primary hover:border-primary  text-lg flex items-center justify-center gap-3 w-32 mx-auto md:mx-0"
            >
              Play <CirclePlay size={20} />
            </button>

            <div
              className="relative"
              onClick={() => setAllPlaylists("fullplaylist")}
            >
              <button className="border px-4 py-2 rounded-lg bg-commonbackgroundtwo hover:text-primary hover:border-primary  text-lg flex items-center justify-center gap-3  mx-auto md:mx-0 text-nowrap ">
                Add to My Playlist
              </button>
              {allPlaylists === "fullplaylist" && (
                <div
                  className="absolute right-0 left-0 -bottom-24"
                  ref={menuRef}
                >
                  {user.myPlaylist.map((playlist) => (
                    <div
                      className="bg-commonbackgroundtwo rounded-lg border border-black text-center"
                      key={playlist.playlistId}
                    >
                      <h2 className="px-4 py-2 ">All Playlists</h2>
                      <button
                        onClick={() =>
                          addSongToPlaylist(
                            playlist.playlistId,
                            playlistInfo.songs
                          )
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
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl md:text-4xl font-bold ">All Songs</h2>
        <div className="flex flex-col gap-5">
          {playlistInfo?.songs?.map((item, index) => (
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
    </Container>
  );
};

export default Playlist;
