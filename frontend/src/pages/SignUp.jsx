import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  const navigateTo = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/", { replace: true });
      // Refresh the page once after redirection
    }
  }, [isAuthenticated]);

  const handleSignUp = async () => {
    try {
      const { data } = await axiosInstance.post(
        `/api/v1/user/register`,
        {
          username,
          fullName,
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success(`${data.message} Please login in to your account.`);
        navigateTo("/login", { replace: true });
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className=" min-h-screen lg:min-h-full h-full flex  flex-col lg:flex-row-reverse items-center flex-1 ">
      <div className=" p-5 m-auto ">
        <img src="/signup.svg" alt="" className="w-72 h-72 lg:w-96 lg:h-96" />
      </div>
      <div className="w-full px-10 sm:p-0 sm:max-w-96  m-auto flex flex-col gap-4">
        <h1 className="text-center text-4xl font-bold">Sign Up</h1>

        <div className="relative">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            id="fullName"
            className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none dark:text-commonwhite  focus:outline-none focus:ring-0  peer"
            placeholder=" "
          />
          <label
            htmlFor="fullName"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4  origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Full Name
          </label>
        </div>
        <div className="relative">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            id="username"
            className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none dark:text-commonwhite  focus:outline-none focus:ring-0  peer"
            placeholder=" "
          />
          <label
            htmlFor="username"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4  origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Username
          </label>
        </div>
        <div className="relative">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none dark:text-commonwhite  focus:outline-none focus:ring-0  peer"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Email
          </label>
        </div>
        <div className="relative">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none dark:text-commonwhite  focus:outline-none focus:ring-0  peer"
            placeholder=" "
          />
          <label
            htmlFor="password"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4  origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Password
          </label>
        </div>

        <div className=" flex items-center justify-center gap-2">
          <p>Already have an account?</p>
          <Link to={"/login"} className="hover:text-primary font-bold">
            Log In
          </Link>
        </div>

        <button
          onClick={handleSignUp}
          className="px-4 py-3 bg-primary rounded-lg text-white text-lg font-bold"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default SignUp;
