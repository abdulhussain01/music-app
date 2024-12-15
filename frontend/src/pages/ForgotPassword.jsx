import { Link, useNavigate } from "react-router-dom";
import Container from "../components/subcomponents/Container";
import { toast } from "react-toastify";
import { fetchUser } from "../store/slices/user.slice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated, navigateTo]);

  const handleForgotPassword = async () => {
    try {
      const { data } = await axiosInstance.post(
        `/api/v1/user/forgotpassword`,
        { email },
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
    <Container>
      <div className=" min-h-screen lg:min-h-full h-full flex  flex-col lg:flex-row-reverse items-center flex-1 ">
        <div className=" p-5 m-auto ">
          <img
            src="/forgotpassword.svg"
            alt=""
            className="w-72 h-72 lg:w-96 lg:h-96"
          />
        </div>
        <div className="w-full px-10 sm:p-0 sm:max-w-96  m-auto flex flex-col gap-4">
          <h1 className="text-center text-4xl font-bold">
            Forgot Your Password
          </h1>

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
              Enter your email
            </label>
          </div>

          <Link to={"/login"} className="hover:text-primary">
            Remembered your password !
          </Link>

          <button
            onClick={handleForgotPassword}
            className="px-4 py-3 bg-primary rounded-lg text-white text-lg font-bold"
          >
            Send Link
          </button>
        </div>
      </div>
    </Container>
  );
};

export default ForgotPassword;
