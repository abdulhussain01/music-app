import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../lib/axios";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleChangePassword = async () => {
    try {
      const { data } = await axiosInstance.put(
        `/api/v1/user/update/password`,
        { currentPassword, newPassword, confirmNewPassword },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className=" md:max-w-screen-sm m-auto py-10  flex flex-col justify-center gap-5">
      <h1 className="text-4xl font-bold">Change Password</h1>

      <div className="relative">
        <label htmlFor="currentpassword" className="">
          Current Password
        </label>
        <input
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          type="password"
          id="currentpassword"
          className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none dark:text-commonwhite  focus:outline-none focus:ring-0  peer"
          placeholder="Current Password"
        />
      </div>

      <div className="relative">
        <label htmlFor="newpassword" className="">
          New Password
        </label>
        <input
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
          id="newpassword"
          className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none dark:text-commonwhite  focus:outline-none focus:ring-0  peer"
          placeholder="New Password"
        />
      </div>
      <div className="relative">
        <label htmlFor="confirmnewpassword" className="mb-2">
          Confirm New Password
        </label>
        <input
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          type="password"
          id="confirmnewpassword"
          className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none dark:text-commonwhite  focus:outline-none focus:ring-0  peer"
          placeholder="Confirm New Password"
        />
      </div>

      <button
        onClick={handleChangePassword}
        className="px-4 py-3 bg-primary rounded-lg text-white text-lg font-bold"
      >
        Change Password
      </button>
    </div>
  );
};

export default ChangePassword;
