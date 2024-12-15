import Container from "../components/subcomponents/Container";

import { Link, useSearchParams } from "react-router-dom";

import { EllipsisVertical } from "lucide-react";
import CarouselWraper from "../components/subcomponents/CarouselWraper";
import Card from "../components/subcomponents/Card";
import {
  setCurrentPlaylist,
  setCurrentSong,
  setIsPlayerActive,
} from "../store/slices/player.slice";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {decode} from "html-entities"


const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("query");

  const dispatch = useDispatch();

  const [searchResult, setSearchResult] = useState();
  const [playningSong, setPlayingSong] = useState();

  const [optionsMenu, setOptionsMenu] = useState("");

  useEffect(() => {
    const fetchSearchResults = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_MUSIC_API}/search/all?query=${query}`
      );

      setSearchResult(data?.data);
    };

    fetchSearchResults();
  }, [query]);

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

  useEffect(() => {
    if (playningSong !== undefined) {
      dispatch(setCurrentSong(playningSong));
      dispatch(setIsPlayerActive());
      dispatch(setCurrentPlaylist({ songs: [{ ...playningSong }] }));
    }
  }, [playningSong]);

  const fetchFetch = async (id) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_MUSIC_API}/songs?id=${id}`
    );

    setPlayingSong(data?.data[0]);
  };

  const handleFetchSong = async (item) => {
    
    await fetchFetch(item.id);
  };
  return (
    <Container>
      <div className=" flex flex-col gap-5">
        <h2 className="text-3xl font-bold">Songs</h2>
        {searchResult?.songs?.results?.map((item) => (
          <div
            className={` grid grid-cols-3  content-between border-b-2 py-2 relative  `}
            key={item.id}
          >
            <button
              className="col-start-1 col-end-3 flex gap-4 items-center w-full"
              onClick={() => {
                handleFetchSong(item);
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
                  {decode(item?.name || item?.title)}
                </h3>
                <p className="text-sm line-clamp-1 overflow-x-clip max-w-72 lg:max-w-full">
                  {item?.primaryArtists}
                </p>
              </div>
            </button>
            <div className="col-start-3  flex sm:gap-5 justify-end items-center">
              <div className="">
                {/* <p>{converDuration(item.duration)}</p> */}
              </div>
              <button className="p-2 " onClick={() => setOptionsMenu(item.id)}>
                <EllipsisVertical />
              </button>
            </div>
            {optionsMenu === item.id && (
              <div className="absolute right-8 -top-5  " ref={contentBoxRef}>
                <div className=" bg-commonbackgroundtwo rounded-lg border border-black text-center">
                  <h3 className="text-lg font-bold border-b-2 border-commonbackground">
                    Options
                  </h3>
                  <div className="flex flex-col ">
                    {item.favourite && (
                      <Link
                        onClick={() => {}}
                        to={`/favourite/${item.favourite.id}`}
                        className="hover:bg-commonbackground  px-4 py-2"
                      >
                        Go to favourite
                      </Link>
                    )}
                    <button className="hover:bg-commonbackground px-4 py-2 rounded-b-lg">
                      Add to Playlist
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {searchResult?.playlists?.results.length > 0 && (
        <CarouselWraper heading={"Playlists"}>
          {searchResult?.playlists?.results?.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </CarouselWraper>
      )}

      {searchResult?.albums?.results.length > 0 && (
        <CarouselWraper heading={"Albums"}>
          {searchResult?.albums?.results?.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </CarouselWraper>
      )}

      {searchResult?.artists?.results.length > 0 && (
        <CarouselWraper heading={"Artists"}>
          {searchResult?.artists?.results?.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </CarouselWraper>
      )}
    </Container>
  );
};

export default Search;
