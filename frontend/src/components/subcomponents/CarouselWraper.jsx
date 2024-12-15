/* eslint-disable react/prop-types */


const CarouselWraper = ({children,heading}) => {
  return (
    <div className=" flex flex-col gap-5">
      <h2 className="text-3xl font-bold">{heading}</h2>
      <div className="flex overflow-y-scroll gap-6 noscroll p-2">
            {children}
      </div>
    </div>
  )
}

export default CarouselWraper