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
