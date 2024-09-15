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

export interface HistoryDevice {
  list: LatestDeviceValue[];
  maximum: boolean;
  total: number;
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

export const getHistoryDevice = async (
  token: string,
  id: string,
  date: {
    from: string;
    to: string;
  },
  offset: number
): Promise<API<HistoryDevice>> => {
  try {
    const { data } = await axios.get<API<HistoryDevice>>(
      `${import.meta.env.VITE_API_URL}/device/${id}/history`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 100,
          from: date.from,
          to: date.to,
          offset: offset,
        },
      }
    );

    return data;
  } catch (error) {
    console.error("getHistoryDevice", error);
    return {
      code: 500,
      error: ["system error"],
    };
  }
};
