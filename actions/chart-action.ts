"use server";

import { db } from "@/lib/db";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

const NUMBER_OF_MONTHS = 12;

export const getMonthlySales = async () => {
  const now = new Date();
  const data: { month: string; actual: number; projected: number }[] = [];

  // Coletar dados reais
  for (let i = NUMBER_OF_MONTHS - 1; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(now, i));
    const monthEnd = endOfMonth(subMonths(now, i));
    const monthLabel = format(monthStart, "MMM");

    const orders = await db.order.findMany({
      where: {
        isPaid: true,
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      select: {
        totalAmount: true,
      },
    });

    const actual = orders.reduce((total, order) => {
      return total + (order.totalAmount?.toNumber() ?? 0);
    }, 0);

    data.push({
      month: monthLabel,
      actual,
      projected: 0, // será preenchido abaixo
    });
  }

  // Aplicar regressão linear sobre os dados reais
  const x = data.map((_, i) => i); // índices dos meses (0 a 11)
  const y = data.map((d) => d.actual); // valores reais

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
  const sumX2 = x.reduce((acc, val) => acc + val * val, 0);

  const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX); // coeficiente angular
  const b = (sumY - m * sumX) / n; // coeficiente linear

  // Calcular projeções com base na regressão
  const projectedData = x.map((xi) => Math.max(0, Math.round(m * xi + b)));

  for (let i = 0; i < data.length; i++) {
    data[i].projected = projectedData[i];
  }

  return data;
};

export async function getCurrentVsLastMonthSalesUntilToday() {
  const today = new Date();

  const startOfThisMonth = startOfMonth(today);
  const sameDayLastMonth = subMonths(today, 1);
  const startOfLastMonth = startOfMonth(sameDayLastMonth);

  const endOfThisPeriod = today;
  const endOfLastPeriod = new Date(
    startOfLastMonth.getFullYear(),
    startOfLastMonth.getMonth(),
    today.getDate()
  );

  const currentOrders = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: startOfThisMonth,
        lte: endOfThisPeriod,
      },
    },
    _sum: {
      totalAmount: true,
    },
  });

  const lastOrders = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: startOfLastMonth,
        lte: endOfLastPeriod,
      },
    },
    _sum: {
      totalAmount: true,
    },
  });

  const current = currentOrders._sum.totalAmount?.toNumber() || 0;
  const last = lastOrders._sum.totalAmount?.toNumber() || 0;

  const percentage =
    last > 0 ? ((current - last) / last) * 100 : current > 0 ? 100 : 0;

  return {
    current,
    last,
    percentage,
  };
}

export const getMonthlyBuyers = async () => {
  const now = new Date();
  const data: { month: string; actual: number; projected: number }[] = [];


  for (let i = NUMBER_OF_MONTHS - 1; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(now, i));
    const monthEnd = endOfMonth(subMonths(now, i));
    const monthLabel = format(monthStart, "MMM");

    const buyers = await db.buyer.count({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    data.push({
      month: monthLabel,
      actual: buyers,
      projected: 0, 
    });
  }

  
  const x = data.map((_, i) => i);
  const y = data.map((d) => d.actual);

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
  const sumX2 = x.reduce((acc, val) => acc + val * val, 0);

  const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const b = (sumY - m * sumX) / n;

  const projectedData = x.map((xi) => Math.max(0, Math.round(m * xi + b)));

  for (let i = 0; i < data.length; i++) {
    data[i].projected = projectedData[i];
  }

  return data;
};

export async function getTopSellingProducts(limit = 10) {
  const data = await db.orderItem.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: limit,
  });

  const productIds = data.map((item) => item.productId);

  const products = await db.product.findMany({
    where: {
      id: { in: productIds },
    },
    select: {
      id: true,
      name: true,
      color: {
        select: {
            value: true,
        }
      }
    },
  });

  return data.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      name: product?.name ?? "Produto desconhecido",
      quantity: item._sum.quantity ?? 0,
      color: product?.color.value,
    };
  });
}