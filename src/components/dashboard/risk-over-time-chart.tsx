"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { date: "2024-06-01", riskScore: 65 },
  { date: "2024-06-02", riskScore: 68 },
  { date: "2024-06-03", riskScore: 62 },
  { date: "2024-06-04", riskScore: 75 },
  { date: "2024-06-05", riskScore: 72 },
  { date: "2024-06-06", riskScore: 55 },
  { date: "2024-06-07", riskScore: 48 },
  { date: "2024-06-08", riskScore: 45 },
  { date: "2024-06-09", riskScore: 42 },
  { date: "2024-06-10", riskScore: 35 },
  { date: "2024-06-11", riskScore: 38 },
  { date: "2024-06-12", riskScore: 37 },
]

const chartConfig = {
  riskScore: {
    label: "Risk Score",
    color: "hsl(var(--primary))",
  },
}

export default function RiskOverTimeChart() {
  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={[20, 90]}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            dataKey="riskScore"
            type="monotone"
            stroke="var(--color-riskScore)"
            strokeWidth={2}
            dot={true}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
