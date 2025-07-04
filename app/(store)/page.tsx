
import Billboard from "@/components/billboard";
import ProductCard from "./_components/ui/product-card";
import { getBillboardData } from "@/actions/getBillboardData";


export default async function Home() {
  const { billboardData, firstProduct } = await getBillboardData();
  //await registerVisitor();
  return (
    <div className=" w-screen flex flex-col items-center justify-center">
      <Billboard data={billboardData} fistProducts={firstProduct} />
      <div className="w-full bg-muted h-20">

      </div>
    </div>
  );
}
