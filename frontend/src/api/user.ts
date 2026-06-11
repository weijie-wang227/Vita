import { api } from ".";
import axios from "axios";

export async function updateMyProfile(data: {
  avatarUrl?: string;
  bio?: string;
  name?: string;
}) {
  try {
    const response = await api.put("/user/me", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
        console.log(error.response?.data)
    }
  }
}