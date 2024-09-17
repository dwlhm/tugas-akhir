import axios from "axios";
import { API } from "../utils";
import { User } from "../auth/context";

export interface Gateway {
  id: string;
  name: string;
  address: string;
  maintainer: number;
  updatedAt?: string;
  device?: {
    id: string,
    name: string
  }[]
}

export interface MqttCredential {
  credential: string[],
  topic_data: string,
  topic_action: string,
  gateway_id: string
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

export const getGateway = async (token: string, id: string): Promise<API<Gateway>> => {
  try {
    const { data } = await axios.get<API<Gateway>>(
      `${import.meta.env.VITE_API_URL}/gateway/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data
  } catch (error) {
    console.error("getGateway", error);
    return {
      code: 500,
      error: ["system error"],
    };
  }
};

export const getMqttCredential = async (token: string, id: string): Promise<API<MqttCredential>> => {
  try {
    const { data } = await axios.get<API<MqttCredential>>(
      `${import.meta.env.VITE_API_URL}/gateway/${id}/mqtt`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data
  } catch (error) {
    console.error("getMqttCredential", error);
    return {
      code: 500,
      error: ["system error"],
    };
  }
};

export const addgateway = async (
  auth: User,
  name: string,
  address: string
): Promise<API<Gateway>> => {
  try {
    const { data } = await axios.post<API<Gateway>>(
      `${import.meta.env.VITE_API_URL}/gateway`,
      JSON.stringify({
        name: name,
        address: address
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
    console.error("addGateway", error);
    return {
      code: 500,
      error: ["system error"],
    };
  }
};

export const editgateway = async (
  auth: User,
  gatewayId: string,
  name: string,
  address: string
): Promise<API<Gateway>> => {
  try {
    const { data } = await axios.put<API<Gateway>>(
      `${import.meta.env.VITE_API_URL}/gateway/${gatewayId}`,
      JSON.stringify({
        name: name,
        address: address
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
    console.error("addGateway", error);
    return {
      code: 500,
      error: ["system error"],
    };
  }
};