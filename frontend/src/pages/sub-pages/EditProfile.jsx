import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchUser } from "../../store/slices/user.slice";
import { axiosInstance } from "../../lib/axios";

const EditProfile = () => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [email, setEmail] = useState(user.email);
  const [fullName, setFullName] = useState(user.fullName);
  const [username, setUsername] = useState(user.username);

  const handleUserUpdate = async () => {
    try {
      const { data } = await axiosInstance.put(
        `/api/v1/user/updateprofile`,
        {
          email,
          fullName,
          username,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        dispatch(fetchUser());
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className=" md:max-w-screen-sm m-auto py-10  flex flex-col justify-center gap-5">
      <h1 className="text-4xl font-bold">Edit Profile</h1>
      <div className="relative">
        <label htmlFor="fullName" className="">
          Full Name
        </label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          type="text"
          id="fullName"
          className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none dark:text-commonwhite  focus:outline-none focus:ring-0  peer"
          placeholder=" "
        />
      </div>
      <div className="relative">
        <label htmlFor="username" className="">
          Username
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          id="email"
          className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none dark:text-commonwhite  focus:outline-none focus:ring-0  peer"
          placeholder=" "
        />
      </div>
      <button
        onClick={handleUserUpdate}
        className="px-4 py-3 bg-primary rounded-lg text-white text-lg font-bold"
      >
        Save
      </button>
    </div>
  );
};

export default EditProfile;
