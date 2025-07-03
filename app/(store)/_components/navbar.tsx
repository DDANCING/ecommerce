"use client";

import Link from "next/link"
import { useState } from "react";
import {  Home, LayoutDashboard, MenuIcon, Settings, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NavbarSidebar } from "./navbar-sidebar";


import { GlobalSearch } from "@/components/ui/global-search";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoginButton } from "@/components/auth/login-button";
import { RegisterButton } from "@/components/auth/register-button";
import { ExpandableTabs } from "./ui/expandebla-tabs";
import { CiSettings } from "react-icons/ci";
import { useSettingsModal } from "@/hooks/use-settings-modal";
import { CartButton } from "./ui/cart-button";

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


const navbarItems = [
    { href: "/", Children: "Home" },
    { href: "/about", Children: "About" },
    
];

export const Navbar = ({ user }: UserProps) => {
    
  const settings = useSettingsModal();
  const isMobile = useIsMobile();


const tabs = [

  {
    title: "Início",
    icon: Home,
    href: "/",
    content: <Link href="/">Home</Link>,
  },
  {
    title: "Carrinho",
    icon: ShoppingCart,
    href: "/carrinho",
    content: <CartButton/>,
  },
  {
    title: "Configurações",
    icon: Settings,
    content: "Configurações",
    onClick: () => settings.onOpen(),
  },
  

];


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
   <nav className="h-20 flex  justify-between font-medium bg-background">
        <Link href="/" className="pl-6 flex items-center">
            <span className="text-5xl font-semibold">
            Logo
            </span>
        </Link>
        <NavbarSidebar user={user} open={isSidebarOpen} items={navbarItems} onOpenChange={setIsSidebarOpen}/>
        <div className={isMobile ? ("mt-6 flex w-full justify-end ") : ("mx-auto mt-6 w-80")}>
  <GlobalSearch />
  </div>
        <div className="items-center gap-4 hidden lg:flex justify-around">



</div>
        <div className="hidden lg:flex">
           {user? (
           <ExpandableTabs tabs={tabs} activeColor="text-foreground" />
           ):(
            
            <div className="flex">
            <LoginButton mode="modal" asChild>
            <Button
            variant="secondary"
            className="border border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-background transition-colors text-lg font-bold"
            >
                Entrar
                
            </Button>
            </LoginButton>
            <RegisterButton mode="modal" asChild>
            <Button
            className="border border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-foreground transition-colors text-lg font-bold"
            >
                Criar Conta
                </Button>
                </RegisterButton>
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

