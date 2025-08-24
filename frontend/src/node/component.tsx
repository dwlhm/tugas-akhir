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
import { useState } from "react";

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

export const TooltipComp = ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom + 10
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className="fixed z-50 px-4 py-3 text-sm text-white bg-gray-900 rounded-lg shadow-xl w-80 z-10"
          style={{
            left: `${position.x - 160}px`, // 160px is half of w-80 (320px)
            top: `${position.y}px`   // Position below the element
          }}
        >
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
          <div className="leading-relaxed">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};
