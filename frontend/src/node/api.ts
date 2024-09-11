import axios from "axios";
import { User } from "../auth/context";
import { API } from "../utils";

export interface Node {
  id: string;
  name: string;
  address: string;
  latest_device_value: LatestDeviceValue[];
}

export interface LatestDeviceValue {
  value: string;
  updatedAt: string;
}

export const getAllNodes = async (auth: User): Promise<API<Node[]>> => {
  try {
    const { data } = await axios.get<API<Node[]>>(
      `${import.meta.env.VITE_API_URL}/device`,
      {
        headers: {
          Authorization: `Bearer $${auth.authentication_token}`,
        },
      }
    );

    return data;
  } catch (error) {
    return {
      code: 500,
      error: ["system error"],
    };
  }
};
