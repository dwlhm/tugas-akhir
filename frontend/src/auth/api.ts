import axios, { AxiosError } from "axios";
import { API } from "../utils";
import { AuthContextInterface, User } from "./context";

export interface Profile {
  name: string;
  email: string;
  updatedAt: string;
  authentication_token: string;
}

export const getProfile = async (
  auth: User
): Promise<API<Profile>> => {
  try {
    console.log("auth",auth)
    const { data } = await axios.get<API<Profile>>(
      `${import.meta.env.VITE_API_URL}/user`,
      {
        headers: {
          Authorization: `Bearer ${auth.authentication_token}`,
        },
      }
    );
    return {
      ...data,
      autenticated_token: auth.authentication_token,
    } as API<Profile>;
  } catch (error) {
    return {
      code: 400,
      error: [error as string],
    };
  }
};

export const postLogin = async (
  username: string,
  password: string
): Promise<API<Profile>> => {
  try {
    const { data } = await axios.post<API<Profile>>(
      `${import.meta.env.VITE_API_URL}/user/login`,
      {},
      {
        auth: {
          username: username,
          password: password,
        },
      }
    );
  
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        code: 400,
        error: (error.response?.data as API<any>).error
      } as API<Profile>
    }
    return {
      code: 500,
      error: ["system error"]
    } as API<Profile>
  }
  
};
