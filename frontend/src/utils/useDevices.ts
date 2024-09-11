import axios from "axios";
import { LatestDeviceValue } from "../node/api";

export type DeviceDetail = {
  id: string;
  name: string;
  value: DeviceValue;
  timestamp: string;
};

export type DeviceValue = {
  h: number;
  t: number;
  1: number;
  2: number;
  0: number;
  3: number;
  v: number;
  a: number;
  l: number;
  o: number;
  timestamp?: string;
};

export const useDevices = async (onChange: (data: any, error: any) => void) => {
  try {
    const { data, status } = await axios.get(
      `${import.meta.env.VITE_API_URL}/device`
    );

    console.log("data: ", data, status);

    onChange(data, null);
  } catch (error) {
    onChange(null, error);
  }
};

export type UseProfilDevice = {
  id?: string;
  name?: string;
  address?: string;
  createdAt?: string;
  latest_device_value: LatestDeviceValue[]
};

export const useProfilDevice = async (
  id: string,
  onChange: (data?: UseProfilDevice, error?: any) => void
) => {
  try {
    const { data, status } = await axios.get(
      `${import.meta.env.VITE_API_URL}/device/${id}`
    );

    console.log("profil device: ", data, status);

    onChange(data.body, null);
  } catch (error) {
    onChange(undefined, error);
  }
};

export const useDeviceValue = async (
  id: string,
  onChange: (data?: DeviceValue, error?: any) => void
) => {
  try {
    const { data, status } = await axios.get(
      `${import.meta.env.VITE_API_URL}/device/${id}/la`
    );

    console.log("value device: ", data, status);

    const item_parsed = JSON.parse(data.body.value);
    const [header, body] = item_parsed.data.split("|");
    const body_arr = body.split(",");
    let res: any = {
      timestamp: data.body.updatedAt,
    };
    header.split("").forEach((v: any, i: number) => (res[v] = body_arr[i]));

    onChange(res, null);
  } catch (error) {
    onChange(undefined, error);
  }
};
