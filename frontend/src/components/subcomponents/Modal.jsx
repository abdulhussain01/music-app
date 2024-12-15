import React, { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { addSongToPlaylist } from "../../utils/addSongsToPlaylist";
import useOutsideClick from "./useOutsideClick";
import { addSongsToFavourite } from "../../utils/songsToFavourite";

const Modal = ({
  user,
  song,
  albumId,
  playlistId,
  songId,
  optionsMenu,
  setOptionsMenu,
  allPlaylists,
  setAllPlaylists,
  handleDeleteFromPlaylist,
  handleDeleteFromFavourite,
}) => {
  const location = useLocation();

  const modalRef = useRef(null);
  useOutsideClick(modalRef, [setOptionsMenu, setAllPlaylists]);

  return (
    <>
      {optionsMenu === songId && (
        <div
          className="absolute right-8 top-5 text-commonblack z-10 text-nowrap"
          ref={modalRef}
        >
          {!allPlaylists ? (
            <div className=" bg-commonbackgroundtwo rounded-lg border border-black text-center">
              <h3 className="text-lg font-bold border-b-2 border-commonbackground">
                Options
              </h3>
              <div className="flex flex-col ">
                <Link
                  onClick={() => {}}
                  to={`/album/${albumId}`}
                  className="hover:bg-commonbackground  px-4 py-2 "
                >
                  Go to album
                </Link>

                {location.pathname.includes("favourite") ? (
                  <button
                    onClick={() => {
                      handleDeleteFromFavourite(song.id)}}
                    className="hover:bg-commonbackground px-4 py-2 rounded-b-lg"
                  >
                    Remove From Favourite
                  </button>
                ) : (
                  <button
                    onClick={() => addSongsToFavourite(song)}
                    className="hover:bg-commonbackground px-4 py-2 rounded-b-lg"
                  >
                    Add to Favourite
                  </button>
                )}
                {location.pathname.includes("myplaylist") ? (
                  <button
                    onClick={() => handleDeleteFromPlaylist(song.id)}
                    className="hover:bg-commonbackground px-4 py-2 rounded-b-lg"
                  >
                    Remove From Playlist
                  </button>
                ) : (
                  <button
                    onClick={() => setAllPlaylists(true)}
                    className="hover:bg-commonbackground px-4 py-2 rounded-b-lg"
                  >
                    Add to Playlist
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-commonbackgroundtwo rounded-lg border border-black text-center ">
              <h2 className="px-4 py-2 ">All Playlists</h2>
              {user?.myPlaylist?.length > 0 ? (
                user?.myPlaylist?.map((playlist) => (
                  <div className="" key={playlist.playlistId}>
                    <button
                      onClick={() =>
                        addSongToPlaylist(playlist.playlistId, [song])
                      }
                      className="w-full hover:bg-commonbackground  px-4 py-2"
                    >
                      {playlist.name}
                    </button>
                  </div>
                ))
              ) : (
                <div className="">
                  <h2 className="px-4 py-2 ">All Playlists</h2>
                  <p className="px-4 py-2 ">No Playlists</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Modal;
