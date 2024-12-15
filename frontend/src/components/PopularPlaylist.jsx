import React from 'react'
import CarouselWraper from './subcomponents/CarouselWraper'
import Card from './subcomponents/Card'

const PopularPlaylist = ({popularPlaylist}) => {
  return (
    <CarouselWraper heading={"Popular Playlists"}>
      {popularPlaylist?.map((item)=>(
        <Card item={item} key={item.id}/>
      ))}
    </CarouselWraper>
  )
}

export default PopularPlaylist