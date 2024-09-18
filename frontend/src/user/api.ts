import axios, { isAxiosError } from "axios";
import { API } from "../utils";

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface RegisterResponse {
  email: string;
  name: string;
  createdAt: string;
}

export const registUser = async (
  token: string,
  user: RegisterRequest
): Promise<API<RegisterResponse>> => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/user/register`,
      JSON.stringify({
        ...user,
      }),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error("registUser", error.response?.data);
      return error.response.data;
    }

    console.error("registUser", error);
    return {
      code: 500,
      error: ["system error"],
    };
  }
};
