import axios from "axios";
import { User } from "../auth/context";
import { API } from "../utils";

export interface NodeUpdateResponse {
  name: string;
  address: string;
}

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

export const updateNode = async (
  auth: User,
  name: string,
  address: string,
  id: string
): Promise<API<NodeUpdateResponse>> => {
  try {
    console.log("auth", auth);
    const { data } = await axios.put<API<NodeUpdateResponse>>(
      `${import.meta.env.VITE_API_URL}/device/${id}`,
      JSON.stringify({
        name: name,
        address: address,
      }),
      {
        headers: {
          Authorization: `Bearer ${auth.authentication_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    console.error("updateNode", error);
    return {
      code: 500,
      error: ["system error"],
    };
  }
};
