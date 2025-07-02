


import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { SalesBarChart } from "@/components/overview/chart-01";
import { NewBuyersChart } from "@/components/overview/chart-02";

import { Chart04 } from "@/components/overview/chart-04";
import { Chart05 } from "@/components/overview/chart-05";
import { Chart06 } from "@/components/overview/chart-06";
import { ActionButtons } from "@/components/overview/action-buttons";
import { getMonthlySales,  getMonthlyBuyers, getTopSellingProducts } from "@/actions/chart-action";
import { TopProductsChart } from "@/components/overview/chart-03";


 export default async function DashboardPage () {
  const salesData = await getMonthlySales();
  const buyersData = await getMonthlyBuyers();
  const topProducts = await getTopSellingProducts();;

  const total = salesData.reduce((sum, d) => sum + d.actual, 0);
  const projectedTotal = salesData.reduce((sum, d) => sum + d.projected, 0);

  const totalBuyers = buyersData.reduce((sum, item) => sum + item.actual, 0);
  const projected = buyersData.reduce((sum, item) => sum + item.projected, 0);
  const percentage = ((projected - total) / total) * 100;
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
                   totalLabel={`$${total.toLocaleString()}`}
                   percentageChange={`+${(((projectedTotal - total) / total) * 100).toFixed(1)}%`}
                 />
                 <NewBuyersChart
      data={buyersData}
      total={totalBuyers}
      percentageChange={percentage}
    />
                <TopProductsChart data={topProducts}  />
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


