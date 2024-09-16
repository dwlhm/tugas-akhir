import axios from "axios";
import { API } from "../utils";

export interface Gateway {
  id: string;
  name: string;
  address: string;
  maintainer: number;
  updatedAt: string;
}

export const getAllGateway = async (token: string): Promise<API<Gateway[]>> => {
  try {
    const { data } = await axios.get<API<Gateway[]>>(
      `${import.meta.env.VITE_API_URL}/gateway`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data
  } catch (error) {
    console.error("getAllGateway", error);
    return {
      code: 500,
      error: ["system error"],
    };
  }
};
