import axios, { AxiosError } from "axios";
import { API } from "../utils";
import { AuthContextInterface } from "./context";

export interface Profile {
  name: string;
  email: string;
  updatedAt: string;
  authenticated_token: string;
}

export const getProfile = async (
  auth: AuthContextInterface
): Promise<API<Profile>> => {
  try {
    const { data } = await axios.get<API<Profile>>(
      `${import.meta.env.VITE_API_URL}/user`,
      {
        headers: {
          Authorization: `Bearer ${auth.user?.token}`,
        },
      }
    );
    return {
      ...data,
    } as API<Profile>;
  } catch (error) {
    return {
      code: 400,
      error: [error as string],
    };
  }
};
