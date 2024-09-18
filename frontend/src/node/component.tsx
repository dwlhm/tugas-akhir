import {
  LineChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";
import { DeviceValue } from "../utils";
import { BarChart2 } from "react-feather";

export function ValueByGraph(props: {
  title: string;
  item: DeviceValue[];
  dataKey: string;
}) {
  return (
    <div className="grafik bg-white rounded p-2">
      <h3 className="p-2 rounded flex items-center gap-2 text-sm mb-2">
        <span className="p-2 bg-blue-100 rounded">
          <BarChart2 className="stroke-blue-900 size-4" />
        </span>
        {props.title}
      </h3>
      <ResponsiveContainer maxHeight={200} className="h-80">
        <LineChart
          data={props.item.map((v) => ({
            ...v,
            timestamp: new Date(v?.timestamp as string).toLocaleTimeString(),
          }))}
        >
          <CartesianGrid strokeOpacity={0.5} />
          <XAxis dataKey="timestamp" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip formatter={(v) => [v, props.title]} />
          <Line type={"monotone"} dataKey={props.dataKey} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
