import { auth } from "@/auth";
import { RoleGate } from "@/components/auth/role-gate";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
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
    <RoleGate allowedRole={UserRole.ADMIN} >
      {children}
      </RoleGate>
    </>
  );
}