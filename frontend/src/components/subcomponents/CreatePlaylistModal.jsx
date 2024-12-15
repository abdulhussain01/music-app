import { ListPlus, ListVideo } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import useOutsideClick from "./useOutsideClick";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchUser } from "../../store/slices/user.slice";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../lib/axios";

const CreatePlaylistModal = ({ isAuthenticated, popup, setPopUp }) => {
  const createPlaylistContainerRef = useRef(null);

  const dispatch = useDispatch();

  const [name, setName] = useState("");

  useOutsideClick(createPlaylistContainerRef, [setPopUp]);

  const handleSavePlaylist = async () => {
    try {
      const { data } = await axiosInstance.post(
        `/api/v1/playlist/createplaylist`,
        { name },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        dispatch(fetchUser());
        setName("");
        setPopUp(false);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <>
      {popup && (
        <div className="fixed  bottom-0 left-0 right-0  p-10 md:inset-0 z-10 w-full   md:bg-[#1b1919d5] bg-commonbackgroundtwo md:h-full">
          <div
            className="max-w-96 m-auto h-full flex flex-col justify-center bg-co"
            ref={createPlaylistContainerRef} // Reference to detect clicks outside
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex flex-col gap-5 md:bg-commonbackgroundtwo p-4 rounded-lg">
              <h2 className="text-xl">Create a New Playlist</h2>
              <input
                type="email"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block rounded-lg px-2.5 py-2.5  w-full text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none dark:text-commonwhite  focus:outline-none focus:ring-0  peer "
                placeholder=" Your Playlist Name "
              />

              <button
                className="px-4 py-3 bg-primary rounded-lg text-white text-lg font-bold"
                onClick={handleSavePlaylist}
              >
                Save
              </button>

              <button
                className="px-4 py-3 border rounded-lg text-white text-lg font-bold"
                onClick={() => setPopUp(false)}
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePlaylistModal;
