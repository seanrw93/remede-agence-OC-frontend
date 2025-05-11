import axiosInstance from "../../utils/axiosInstance";

export const fetchUserProfileData = async (token) => {
    const response = await axiosInstance.post("user/profile", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });
    return response.data.body;
}