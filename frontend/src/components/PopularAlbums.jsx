/* eslint-disable react/prop-types */
import React from "react";
import Card from "./subcomponents/Card";
import CarouselWraper from "./subcomponents/CarouselWraper";

const PopularAlbums = ({ popularAlbums }) => {
  return (
    <CarouselWraper heading={"Popular Albums"}>
      {popularAlbums?.map((item) => (
          <Card item={item} key={item.id} />
        ))}
    </CarouselWraper>
  );
};

export default PopularAlbums;
