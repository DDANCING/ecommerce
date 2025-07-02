"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavbarSidebar } from "./navbar-sidebar";
import { ProfileOptions } from "@/components/auth/user-button";
import { DashboardIcon } from "@radix-ui/react-icons";
import { RoleGateNoMessage } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";
import Conteiner from "./ui/conteiner";


interface NavbarItemProps {
    href: string;
    children: React.ReactNode;
    isActive?: boolean;
}
type UserProps = {
  user: {
    id: string;
  } | null;
};

const NavbarItem = ({
    href,
    children,
    isActive,
}: NavbarItemProps ) => {
    return (
        <Button
         asChild
         className={cn(
         "bg-transparent hover:bg-transparent rounded-full text-foreground hover:border px-3.5 text-lg py-6",
         isActive && "bg-foreground text-background"
        )}>
            <Link
            href={href}
            >
            {children}
            </Link>
        </Button>
    )
}

const navbarItems = [
    { href: "/", Children: "Home" },
    { href: "/about", Children: "About" },
    { href: "/features", Children: "Features" },
    { href: "/pricing", Children: "Pricing" },
    { href: "/contact", Children: "Contact" },
];

export const Navbar = ({ user }: UserProps) => {
    


  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
   <nav className="h-20 flex border-b justify-between font-medium bg-background">
        <Link href="/" className="pl-6 flex items-center">
            <span className="text-5xl font-semibold">
            Logo
            </span>
        </Link>
        <NavbarSidebar user={user} open={isSidebarOpen} items={navbarItems} onOpenChange={setIsSidebarOpen}/>
         <div className="items-center gap-4 hidden lg:flex">
        <Conteiner>
       
            {navbarItems.map((item) => (
                <NavbarItem 
                key={item.href}
                href={item.href}
                isActive={pathname === item.href}
                >
                    {item.Children}
                </NavbarItem>
            ))}
     
        </Conteiner>
           </div>
        <div className="hidden lg:flex">
           {user? (
            <div className="flex mx-8 items-center gap-4">
                <RoleGateNoMessage allowedRoles={[UserRole.ADMIN, UserRole.SELLER, UserRole.OWNER]} >
                <Link href="/dashboard">
                <Button variant="outline">
                <DashboardIcon/>
                <h1> Dashboard </h1>
                </Button>
                </Link>
                </RoleGateNoMessage>
                <ProfileOptions/>
            </div>
           ):(
            
            <div className="flex">
            <Button
            variant="secondary"
            className="border border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-background transition-colors text-lg font-bold"
            >
                Log in
                
            </Button>
            <Button
            className="border border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-foreground transition-colors text-lg font-bold"
            >
                Start selling
                </Button>
            </div>
           )}
            
           
        </div>
        <div className="flex lg:hidden items-center justify-center m-4">
            <Button className="size-12 border-transparent hover:bg-transparent" variant="ghost" onClick={() => setIsSidebarOpen(true)}>
                <MenuIcon className="size-6"/>
            </Button>
        </div>
   </nav>
  )
}

