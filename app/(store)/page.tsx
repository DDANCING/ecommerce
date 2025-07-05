
import Billboard from "@/components/billboard";
import { getBillboardData } from "@/actions/getBillboardData";
import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";



export default async function Home() {
  const { billboardData, firstProduct } = await getBillboardData();
  //await registerVisitor();

  const categories = await db.category.findMany({
    include: {
      billboard: {
        select: {
          imageUrl: true,
        }
      }
    }
  })
  return (
    <div className=" w-screen flex flex-col items-center justify-center">
      <Billboard data={billboardData} fistProducts={firstProduct} />
      <div className="w-full bg-muted/20 h-40 flex items-center ">
           {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`}>
           <Image
             key={category.id}
             src={category.billboard?.imageUrl}
             alt={category.name}
             width={150}
             height={150}
             className="rounded-full w-32 h-32 mx-20"
           />
           </Link>
         ))}
      </div>

    </div>
  );
}
