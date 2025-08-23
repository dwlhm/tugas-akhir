export interface ParsedNodeData {
  1?: string;
  0?: string;
  2?: string;
  3?: string;
  h?: string;
  t?: string;
  v?: string;
  a?: string;
  l?: string;
  o?: string;
}

export const parseNodeData = (data: string): ParsedNodeData | null => {
  if (data) {
    const item_parsed = JSON.parse(data || "");
    const [header, body] = item_parsed.data.split("|");
    const body_arr = body.split(",");
    let res: any = {};
    header.split("").forEach((v: any, i: number) => (res[v] = body_arr[i]));

    return res;
  } else {
    return null;
  }
};

export const getPM10Level = (value: number): { level: string; color: string; text: string } => {
  if (value > 75)
    return {
      level: "Tidak Aman",
      color: "bg-red-100",
      text: "text-red-900"
    }

  return {
    level: "Aman",
    color: "bg-green-100",
    text: "text-green-900"
  }
}

export const getPM25Level = (value_raw: string): { level: string; color: string; text: string } => {
  const value = parseFloat(value_raw);
  console.log(value, typeof value, 'value PM 2.5', value > 250.5);
  if (value > 250.5) {
    console.log('berbahaya');
    return {
      level: "Berbahaya",
      color: "bg-gray-300",
      text: "text-gray-900"
    }
  }

  if (value > 150.4) {
    console.log('sangat tidak sehat');
    return {
      level: "Sangat Tidak Sehat",
      color: "bg-red-100",
      text: "text-red-900"
    }
  }

  if (value > 55.4) {
    return {
      level: "Tidak Sehat",
      color: "bg-yellow-100",
      text: "text-yellow-900"
    }
  }

  if (value > 15.5) {
    return {
      level: "Sedang",
      color: "bg-blue-100",
      text: "text-blue-900"
    }
  }

  return {
    level: "Baik",
    color: "bg-green-100",
    text: "text-green-900"
  }
}

