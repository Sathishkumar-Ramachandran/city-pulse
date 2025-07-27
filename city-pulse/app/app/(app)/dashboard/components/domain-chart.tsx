"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Traffic", issues: 456, fill: "var(--color-traffic)" },
  { name: "Infra", issues: 321, fill: "var(--color-infra)" },
  { name: "Utilities", issues: 102, fill: "var(--color-utilities)" },
  { name: "Sanitation", issues: 189, fill: "var(--color-sanitation)" },
  { name: "Safety", issues: 234, fill: "var(--color-safety)" },
  { name: "Env", issues: 87, fill: "var(--color-env)" },
  { name: "Health", issues: 55, fill: "var(--color-health)" },
]

const chartConfig = {
  issues: {
    label: "Issues",
  },
  traffic: {
    label: "Traffic",
    color: "hsl(var(--chart-1))",
  },
  infra: {
    label: "Infrastructure",
    color: "hsl(var(--chart-2))",
  },
  utilities: {
    label: "Utilities",
    color: "hsl(var(--chart-3))",
  },
  sanitation: {
    label: "Sanitation",
    color: "hsl(var(--chart-4))",
  },
  safety: {
    label: "Public Safety",
    color: "hsl(var(--chart-5))",
  },
  env: {
    label: "Environment",
    color: "hsl(var(--chart-1))",
  },
  health: {
    label: "Health",
    color: "hsl(var(--chart-2))",
  },
}

export default function DomainChart() {
  return (
    <div className="h-[350px]">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} accessibilityLayer margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis
              dataKey="name"
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="issues" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
