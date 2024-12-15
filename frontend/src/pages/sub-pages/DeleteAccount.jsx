import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchUser, logoutUser } from "../../store/slices/user.slice";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";

const DeleteAccount = () => {
  const [deleteUser, setDeleteUser] = useState(false);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleDeleteUser = async () => {
    try {
      const { data } = await axiosInstance.delete(`/api/v1/user/delete`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (data.success) {
        toast.success(data.message);
        dispatch(logoutUser());
        navigateTo("/");
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className=" md:max-w-screen-sm m-auto py-10  flex flex-col justify-center gap-5">
      <h1 className="text-4xl font-bold">Delete Account</h1>
      <div className="relative">
        <p className="my-2">Delete Your Account Permanently</p>

        <button
          onClick={() => setDeleteUser(true)}
          className="px-4 py-3 border text-red-500 border-red-500 rounded-lg  text-lg font-bold"
        >
          Delete
        </button>
      </div>

      {deleteUser && (
        <div className="fixed  bottom-0 left-0 right-0  p-10 md:inset-0 z-10  bg-[#1b1919d5] flex flex-col  ">
          <div className=" m-auto flex flex-col gap-5 bg-commonbackgroundtwo p-10 rounded-lg">
            <p className="text-2xl">Do You Want To Delete Your Account ? </p>

            <button
              onClick={handleDeleteUser}
              className="px-4 py-3 bg-red-500 rounded-lg text-white text-lg font-bolds"
            >
              Delete
            </button>
            <button
              onClick={() => setDeleteUser(false)}
              className="px-4 py-3 border rounded-lg text-white text-lg font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
