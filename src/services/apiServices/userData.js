import axiosInstance from "../../utils/axiosInstance";

export const fetchUserProfileData = async () => {
  const response = await axiosInstance.post("user/profile");
  return response.data.body;
};