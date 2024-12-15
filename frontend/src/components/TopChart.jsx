import { CirclePlayIcon } from "lucide-react";
import { Link } from "react-router-dom";

const TopChart = (topChart) => {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-3xl font-bold">Top Chart</h2>
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-4 p-2">
        {topChart?.topChart?.map((item, index) => (
          <Link
            to={`${item.type}/${item.id}`}
            className="p-2 bg-commonsecondarybackdround rounded-lg flex items-center justify-between hover:scale-105 hover:text-primary"
            key={item.id}
          >
            <div className="flex items-center gap-4">
              <p className="text-2xl">{index + 1}</p>
              <div className="w-20 h-20 relative" style={{ minWidth: "80px" }}>
                <img
                  src={item?.image[1]?.link}
                  alt=""
                  className="absolute w-full h-full object-cover left-0 top-0 rounded-lg"
                  style={{ minWidth: "80px" }} // Ensure the image keeps its width
                />
              </div>
              <div className="">
                <div className="line-clamp-1 font-bold">{item.title}</div>
                <div className="line-clamp-1 capitalize">{item.language}</div>
              </div>
            </div>
            <CirclePlayIcon className="min-w-[24px]" width={25} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopChart;
