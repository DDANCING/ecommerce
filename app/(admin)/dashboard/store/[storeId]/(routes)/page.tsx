
import { db } from "@/lib/db";

interface DashboardStorePageProps {
  params: { storeId: string };
}

const DashboardStorePage = async ({ params }: DashboardStorePageProps) => {
  
  const { storeId } = await Promise.resolve(params);

  const store = await db.store.findFirst({
    where: {
      id: storeId, 
    },
  });

  return <div>active store: {store?.name}</div>;
};

export default DashboardStorePage;