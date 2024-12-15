import Card from "./subcomponents/Card";
import CarouselWraper from "./subcomponents/CarouselWraper";
import {
  setCurrentPlaylist,
  setCurrentSong,
  setIsPlayerActive,
} from "../store/slices/player.slice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import {decode} from "html-entities"
const Trending = (trendingSongs) => {
  const dispatch = useDispatch();

  const [songInfo, setSongInfo] = useState();

  const fetchFetch = async (id) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_MUSIC_API}/songs?id=${id}`
    );

    setSongInfo(data?.data[0]);
  };

  useEffect(() => {
    if (songInfo !== undefined) {
      dispatch(setCurrentSong(songInfo));
      dispatch(setIsPlayerActive());
      dispatch(setCurrentPlaylist({ songs: [{ ...songInfo }] }));
    }
  }, [songInfo,dispatch]);

  const handleFetchSong = async (item) => {
    await fetchFetch(item.id);
  };

  return (
    <CarouselWraper heading={"Trending"}>
      {trendingSongs?.trendingSongs?.songs?.map((item) => (
        <div
          to={`${item.type}/${item.id}`}
          className="w-full h-full bg-commonsecondarybackdround p-3 rounded-lg flex flex-col gap-2  hover:text-primary hover:scale-105 "
          key={item.id}
          onClick={() => handleFetchSong(item)}
        >
          <div className="relative w-44 h-44 ">
            <img
              src={item?.image[2]?.link}
              alt=""
              className="absolute left-0 top-0 rounded-lg"
              width="100%"
              height="100%"
            />
          </div>
          <div className="">
            <h3 className="line-clamp-1 font-bold">
              {decode(item?.name || item?.title)}
            </h3>
            <p className="line-clamp-1 text-sm">
              {item.primaryArtists &&
                item?.primaryArtists?.map((item) => item?.name).join(",")}
              {item?.artists &&
                item?.artists?.map((item) => item?.name).join(",")}
              {item?.songCount && item?.songCount + " songs"}
            </p>
          </div>
        </div>
      ))}
      {trendingSongs?.trendingSongs?.albums?.map((item) => (
        <Card item={item} key={item.id} />
      ))}
    </CarouselWraper>
  );
};

export default Trending;
