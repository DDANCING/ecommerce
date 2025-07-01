"use client";

import { useId } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TopProduct {
  name: string;
  quantity: number;
  color?: string;
}

interface Props {
  data: TopProduct[];
}

export function TopProductsChart({ data }: Props) {
  const id = useId();

  const totalSales = data.reduce((sum, item) => sum + item.quantity, 0);
  const topProduct = data[0];

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="">
            <CardTitle>Top Produtos Vendidos</CardTitle>
            <div className="flex items-start gap-2">
              <div className="font-semibold text-2xl">
                {totalSales} unidades
              </div>
              <Badge className="mt-1.5 bg-emerald-500/24 text-emerald-500 border-none">
                +{((topProduct.quantity / totalSales) * 100).toFixed(1)}%
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
     <CardContent>
  <div className="w-full h-[250px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          width={50}
        />
        <Bar dataKey="quantity">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
        <Tooltip
          formatter={(value: number) => `${value} unidades`}
          labelFormatter={() => ""}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</CardContent>
    </Card>
  );
}
