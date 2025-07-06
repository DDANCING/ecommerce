// app/page.tsx (ou app/home/page.tsx dependendo da estrutura)

import Billboard from "@/components/billboard";
import { getBillboardData } from "@/actions/getBillboardData";
import { db } from "@/lib/db";
import { registerVisitor } from "@/actions/register-visitor";

export default async function Home() {
  const { billboardData } = await getBillboardData();
  await registerVisitor();

  const categories = await db.category.findMany({
    include: {
      billboard: {
        select: {
          imageUrl: true,
        },
      },
    },
  });

  return (
    <div className="w-screen flex flex-col items-center justify-center">
      {/* Corrigido: Sem 'firstProduct' */}
      <Billboard data={billboardData} />

     
      <div className="w-full bg-muted/20 py-6 flex items-center justify-center gap-8 overflow-x-auto">
        
      </div>
    </div>
  );
}
