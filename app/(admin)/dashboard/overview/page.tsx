
import { SalesBarChart } from "@/app/(admin)/dashboard/overview/_components/chart-01";
import { NewBuyersChart } from "@/app/(admin)/dashboard/overview/_components/chart-02";

import { Chart04 } from "@/app/(admin)/dashboard/overview/_components/chart-04";
import { Chart05 } from "@/app/(admin)/dashboard/overview/_components/chart-05";
import { Chart06 } from "@/app/(admin)/dashboard/overview/_components/chart-06";
import { ActionButtons } from "@/app/(admin)/dashboard/overview/_components/action-buttons";
import { getMonthlySales,  getMonthlyBuyers, getTopSellingProducts, getCurrentVsLastMonthSalesUntilToday } from "@/actions/chart-action";
import { TopProductsChart } from "@/app/(admin)/dashboard/overview/_components/chart-03";


export default async function OverviewPage() {
  const salesData = await getMonthlySales();
  const buyersData = await getMonthlyBuyers();
  const topProducts = await getTopSellingProducts();
  const dailySalesComparison = await getCurrentVsLastMonthSalesUntilToday();


  const totalSalesThisMonth = dailySalesComparison.current;
  const percentageChange = dailySalesComparison.percentage;

  const totalBuyers = buyersData.reduce((sum, item) => sum + item.actual, 0);
  const lastMonth = buyersData[buyersData.length - 1];
  const buyersTotal = lastMonth.actual;
  const buyersProjected = lastMonth.projected;

  const buyersPercentage =
    buyersProjected !== 0
      ? ((buyersTotal - buyersProjected) / buyersProjected) * 100
      : 0;

  return (
    <div className="px-4 md:px-6 lg:px-8 @container max-h-[50vh]">
      <div className="w-full mx-auto">
        <header className="flex flex-wrap gap-3 min-h-20 py-4 shrink-0 items-center transition-all ease-linear ">
          <ActionButtons />
        </header>
        <div className="overflow-hidden">
          <div className="grid gap-4 auto-rows-min @2xl:grid-cols-4 *:-ms-px *:-mt-px -m-px">
            <SalesBarChart
              title="Vendas por Mês"
              data={salesData}
              totalLabel={`$${totalSalesThisMonth.toLocaleString()}`}
              percentageChange={percentageChange.toFixed(1)}
            />
            <NewBuyersChart
              data={buyersData}
              total={totalBuyers}
              percentageChange={buyersPercentage}
            />
            <TopProductsChart data={topProducts} />
            <Chart04 />
            <Chart05 />
            <Chart06 />
            <Chart05 />
            <Chart06 />
          </div>
        </div>
      </div>
    </div>
  );
}