import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className=" md:max-w-screen-sm m-auto py-10  flex flex-col justify-center gap-5">
    <h1 className="text-4xl font-bold">Profile</h1>
      <div className="relative">
        <label htmlFor="fullName" className="">
          Full Name
        </label>
        <input
          value={user.fullName}
          readOnly
          type="text"
          id="fullName"
          className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none dark:text-commonwhite  focus:outline-none focus:ring-0  peer"
          placeholder=" "
          disabled
        />
      </div>
      <div className="relative">
        <label htmlFor="username" className="">
          Username
        </label>
        <input
          value={user.username}
          readOnly
          type="text"
          id="username"
          className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none dark:text-commonwhite  focus:outline-none focus:ring-0  peer"
          placeholder=" "
        />
      </div>
      <div className="relative">
        <label htmlFor="email" className="">
          Email
        </label>
        <input
          value={user.email}
          readOnly
          type="email"
          id="email"
          className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none dark:text-commonwhite  focus:outline-none focus:ring-0  peer"
          placeholder=" "
        />
      </div>
    </div>
  );
};

export default Profile;
