import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from 'react';

interface LayoutComponentProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: LayoutComponentProps) { 
  const user = await auth();
  const userId = user?.user.id;

  if (!userId) {
    redirect("/auth/login");
  }


    const store = await db.store?.findFirst({
        where: {
            userId
        }
    })

    if (!store) {
        redirect(`/newstore`);
    }

  return (
    <>
      {children}
    </>
  );
}