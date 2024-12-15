/* eslint-disable react/prop-types */


const Container = ({ children }) => {
  return (
    <div className="my-5 mx-5 md:mx-20 flex flex-col gap-10 flex-1 ">
      {children}
    </div>
  );
};

export default Container;
