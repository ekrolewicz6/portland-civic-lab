"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  Cell,
} from "recharts";
import { LEVY_HISTORY } from "@/lib/fpdr/data";

export default function LevyGrowthChart() {
  const data = LEVY_HISTORY.map((d) => ({
    label: d.fy,
    value: d.levy,
    projected: !!d.projected,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 8, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="2 6" stroke="#d6d3d1" strokeOpacity={0.5} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 13, fill: "#44403c", fontFamily: "var(--font-mono)" }}
            tickLine={false}
            axisLine={{ stroke: "#d6d3d1", strokeOpacity: 0.5 }}
          />
          <YAxis
            tick={{ fontSize: 13, fill: "#78716c", fontFamily: "var(--font-mono)" }}
            tickLine={false}
            axisLine={false}
            width={52}
            tickFormatter={(v: number) => `$${v}M`}
          />
          <Tooltip
            cursor={{ fill: "rgba(15,36,25,0.04)" }}
            contentStyle={{
              backgroundColor: "#faf6f0",
              border: "1px solid #ebe5da",
              borderRadius: "2px",
              fontSize: "13px",
              fontFamily: "var(--font-mono)",
              boxShadow: "0 4px 16px rgba(15,36,25,0.1)",
              padding: "8px 12px",
            }}
            formatter={(value: number, _n: string, item: { payload?: { projected?: boolean } }) => [
              `$${value}M${item?.payload?.projected ? " (projected)" : ""}`,
              "FPDR levy",
            ]}
          />
          <Bar dataKey="value" radius={[3, 3, 0, 0]} animationDuration={900} maxBarSize={70}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.projected ? "#c8956c" : "#1a3a2a"} fillOpacity={d.projected ? 0.55 : 1} />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              formatter={(v: React.ReactNode) => `$${v}M`}
              style={{ fontSize: 12, fontFamily: "var(--font-mono)", fill: "#44403c", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
