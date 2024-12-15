/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import {decode} from "html-entities"
const Card = ({ item }) => {
  return (
    <Link
      to={`/${item.type}/${item.id}`}
      className="bg-commonsecondarybackdround p-3 rounded-lg flex flex-col gap-2  hover:text-primary hover:scale-105 relative "
      key={item.id}
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
        <h3 className="line-clamp-1 font-bold w-44 ">{decode(item?.name || item?.title)}</h3>
        <p className="line-clamp-1 text-sm  ">
          {item.primaryArtists &&
            item?.primaryArtists?.map((item) => item.name).join(",")}
          {item?.artists && item?.artists?.map((item) => item.name).join(",")}
          {item?.songCount && item?.songCount + " songs"}
        </p>
      </div>
    </Link>
  );
};

export default Card;
