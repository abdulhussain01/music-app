import Trending from "../components/Trending";
import TopChart from "../components/TopChart";
import PopularAlbums from "../components/PopularAlbums";
import PopularPlaylist from "../components/PopularPlaylist";
import Container from "../components/subcomponents/Container";
import { useEffect, useState } from "react";
import { setLanguage } from "../store/slices/user.slice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const [homeInfo, setHomeInfo] = useState();
  const { language } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    let getLang = localStorage.getItem("lang");

    
    if (!getLang) {
      dispatch(setLanguage("hindi"));
      localStorage.setItem("lang", language);
      getLang = "hindi";
    } else {
      dispatch(setLanguage(getLang));
    }


    const fetchData = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_MUSIC_API}/modules?language=${getLang}`
      );

      setHomeInfo(data?.data);
    };

    fetchData();
  }, [dispatch, language]);

  return (
    <>
      <Container>
        <Trending trendingSongs={homeInfo?.trending} />
        <TopChart topChart={homeInfo?.charts} />
        <PopularAlbums popularAlbums={homeInfo?.albums} />
        <PopularPlaylist popularPlaylist={homeInfo?.playlists} />
      </Container>
    </>
  );
};

export default Home;
