import { auth } from "@/auth";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface SettingsPageProps {
  params: Promise<{ storeId: string }>
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const { storeId } = await params;
  const user = await auth();
  const userId = user?.user.id;

  if(!userId) {
    redirect("/auth/login")
  }

  const store = await db.store.findFirst({
    where: {
      id: storeId,
      userId,
    }
  })

  if(!store) {
    redirect("/dashboard")
  }

  return (
    <div></div>
  )
}

export default SettingsPage