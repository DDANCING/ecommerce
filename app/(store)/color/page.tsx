
import { db } from "@/lib/db";
import ColorGrid from "./_components/ColorGrid";


export default async function ColorsPage() {
  const color = await db.color.findMany({
    where: {
      products: {
        some: {},
      },
    },
  });

  return <ColorGrid color={color} />;
}
