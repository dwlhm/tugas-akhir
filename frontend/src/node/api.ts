import axios, { isAxiosError } from "axios";
import { User } from "../auth/context";
import { API, SuccessResponse } from "../utils";

export interface NodeUpdateResponse {
  name: string;
  address: string;
}

export interface Node {
  id: string;
  name: string;
  address: string;
  device_history: LatestDeviceValue[];
}

export interface NodeInformation {
  id: string;
  name: string;
  address: string;
  gateway_id: string;
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

export const getAllNodes = async (
  auth: User,
  gatewayId?: string,
): Promise<API<Node[]>> => {
  try {
    const { data } = await axios.get<API<Node[]>>(
      `${import.meta.env.VITE_API_URL}/device`,
      {
        headers: {
          Authorization: `Bearer $${auth.authentication_token}`,
        },
        params: {
          gateway: gatewayId,
        },
      },
    );

    return data;
  } catch (error) {
    return {
      code: 500,
      error: ["system error"],
    };
  }
};

export const addNode = async (
  auth: User,
  name: string,
  address: string,
  gateway_id: string,
): Promise<API<NodeInformation>> => {
  try {
    const { data } = await axios.post<API<NodeInformation>>(
      `${import.meta.env.VITE_API_URL}/device`,
      JSON.stringify({
        name: name,
        address: address,
        gateway_id: gateway_id,
      }),
      {
        headers: {
          Authorization: `Bearer ${auth.authentication_token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return data;
  } catch (error) {
    console.error("addNode", error);
    return {
      code: 500,
      error: ["system error"],
    };
  }
};

export const deleteNode = async (
  auth: User,
  nodeId: string,
): Promise<API<SuccessResponse>> => {
  try {
    const { data } = await axios.delete<API<SuccessResponse>>(
      `${import.meta.env.VITE_API_URL}/device/${nodeId}`,
      {
        headers: {
          Authorization: `Bearer ${auth.authentication_token}`,
        },
      },
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error("deleteNode", error.response.data);
      return error.response.data;
    }

    console.error("deleteNode", error);
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
  id: string,
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
      },
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
  offset: number,
  limit: number,
): Promise<API<HistoryDevice>> => {
  try {
    const { data } = await axios.get<API<HistoryDevice>>(
      `${import.meta.env.VITE_API_URL}/device/${id}/history`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: limit,
          from: date.from,
          to: date.to,
          offset: offset,
        },
      },
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

export interface LatestValueResponse {
  id: string;
  name: string;
  value: string;
  createdAt: string;
}

export const getAllLatestValue = async (
  token: string,
): Promise<API<LatestValueResponse[]>> => {
  try {
    const { data } = await axios.get<API<LatestValueResponse[]>>(
      `${import.meta.env.VITE_API_URL}/device/la`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error("getAllLatestValue", error.response.data);
      return error.response.data;
    }
    console.error("getHistoryDevice", error);
    return {
      code: 500,
      error: ["system error"],
    };
  }
};

export const getAllLatestValueGeneral = async (): Promise<API<Node[]>> => {
  try {
    const { data } = await axios.get<API<Node[]>>(
      `${import.meta.env.VITE_API_URL}/device`,
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error("getAllLatestValue", error.response.data);
      return error.response.data;
    }
    console.error("getHistoryDevice", error);
    return {
      code: 500,
      error: ["system error"],
    };
  }
};
