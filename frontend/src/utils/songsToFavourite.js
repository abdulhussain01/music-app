import axios from "axios";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

export const addSongsToFavourite = async (item) => {
  try {
    const { data } = await axiosInstance.post(
      `/api/v1/user/addtofavourite`,
      { song: item },
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
