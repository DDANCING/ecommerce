import { auth } from "@/auth";
import { RoleGate } from "@/components/auth/role-gate";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import React from 'react';
import NavBar from "@/app/(admin)/_components/admin-navbar";
import { ModalProvider } from "@/providers/modal-provider";
import { SettingsModalProvider } from "@/providers/profile-settings-provider";
import { BuyerModalProvider } from "@/providers/buyer-provider";

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

    if (user.user.role === "USER") {
       redirect(`/`)
    }

    if (!store) {
        redirect(`/newstore`);
    }

  return (
    <>
    <RoleGate allowedRoles={[UserRole.ADMIN, UserRole.SELLER, UserRole.OWNER]} >
      <NavBar/>
      <BuyerModalProvider/>
      <ModalProvider/>
      <SettingsModalProvider/>
      {children}
    </RoleGate>
    </>
  );
}