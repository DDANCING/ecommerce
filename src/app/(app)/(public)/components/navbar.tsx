"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavbarSidebar } from "./navbar-sidebar";


interface NavbarItemProps {
    href: string;
    children: React.ReactNode;
    isActive?: boolean;
}



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

export const Navbar = () => {
    


  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
   <nav className="h-20 flex border-b justify-between font-medium bg-background">
        <Link href="/" className="pl-6 flex items-center">
            <span className="text-5xl font-semibold m-6">
            Logo
            </span>
        </Link>
        <NavbarSidebar open={isSidebarOpen} items={navbarItems} onOpenChange={setIsSidebarOpen}/>
        <div className="items-center gap-4 hidden lg:flex">
            {navbarItems.map((item) => (
                <NavbarItem 
                key={item.href}
                href={item.href}
                isActive={pathname === item.href}
                >
                    {item.Children}
                </NavbarItem>
            ))}
        </div>
        <div className="hidden lg:flex">
           
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
           
        </div>
        <div className="flex lg:hidden items-center justify-center m-2">
            <Button className="size-12 border-transparent hover:bg-transparent" variant="ghost" onClick={() => setIsSidebarOpen(true)}>
                <MenuIcon/>
            </Button>
        </div>
   </nav>
  )
}

