"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, LogOut, Settings, ShoppingCart } from "lucide-react";
import { BiMenuAltRight } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { NavbarSidebar } from "./navbar-sidebar";
import { GlobalSearch } from "@/components/ui/global-search";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSettingsModal } from "@/hooks/use-settings-modal";
import { ExpandableTabs } from "./ui/expandebla-tabs";
import { LoginExpandableTabs } from "./ui/login-expandable-tabs";
import useCart from "@/hooks/use-cart";
import { logout } from "@/actions/logout";
import { Blocks } from "@/public/icons/Blocks";
import { AnimatedCartIcon } from "@/public/icons/AnimatedCartIcon";
import { Boxes } from "@/public/icons/Boxes";
import { SwatchBook } from "@/public/icons/SwatchBook";
import { Heart } from "@/public/icons/Heart";
import { User } from "@/public/icons/User";

interface UserProps {
  user: {
    id: string;
  } | null;
}

const navbarItems = [
  { href: "/", Children: "Home" },
  { href: "/about", Children: "About" },
];

export const Navbar = ({ user }: UserProps) => {
  const settings = useSettingsModal();
  const isMobile = useIsMobile();
  const cart = useCart();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (!isMounted) return null;

  const tabs = [
     {
      title: "Produtos",
      icon: Boxes,
      href: "/products",
      content: <Link href="/products">Produtos</Link>,
    },
    {
      title: "Categorias",
      icon: Blocks,
      href: "/category",
      content: <Link href="/category">Categorias</Link>,
    },
    {
      title: "Cores",
      icon: SwatchBook,
      href: "/color",
      content: <Link href="/color">Cores</Link>,
    },
    {
      title: `Carrinho (${cart.items.length})`,
      icon: AnimatedCartIcon ,
      href: "/cart",
      content: <Link href="/cart" className="flex gap-1">
      Carrinho
       </Link>,
    },
    {
      title: "Wishlist",
      icon: Heart,
      href: "/wishlist",
      content: <Link href="/wishlist">Wishlist</Link>,
    },
    {
      title: "Perfil",
      icon: User ,
      href: "/perfil",
      content: <Link href="/perfil">Perfil</Link>,
    },
  ];

  const loginTabs = [
    {
      title: "Produtos",
      icon: Boxes,
      href: "/products",
      content: <Link href="/products">Produtos</Link>,
    },
    {
      title: "Categorias",
      icon: Blocks,
      href: "/category",
      content: <Link href="/category">Categorias</Link>,
    },
    {
      title: "Cores",
      icon: SwatchBook,
      href: "/color",
      content: <Link href="/color">Cores</Link>,
    },
     {
      title: `Carrinho (${cart.items.length})`,
      icon: AnimatedCartIcon ,
      href: "/cart",
      content: <Link href="/cart" className="flex gap-1">
      Carrinho
       </Link>,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 w-full h-20 flex justify-between items-center font-medium bg-background/40 shadow-sm backdrop-blur-lg">
      {/* Logo */}
      <Link href="/" className="pl-6 flex items-center w-80">
        <span className="text-5xl font-semibold">Logo</span>
      </Link>

      {/* Sidebar (mobile) */}
      <NavbarSidebar
        user={user}
        open={isSidebarOpen}
        items={navbarItems}
        onOpenChange={setIsSidebarOpen}
      />

      {/* Barra de busca central */}
      <div className={isMobile ? "mt-6 flex w-full justify-end" : "mx-auto mt-3 w-96"}>
        <GlobalSearch />
      </div>

      {/* Tabs de usuário (desktop) */}
      <div className="hidden lg:flex">
        {user ? (
          <ExpandableTabs tabs={tabs} activeColor="text-foreground" />
        ) : (
          <LoginExpandableTabs tabs={loginTabs} />
        )}
      </div>

      {/* Menu hamburguer (mobile) */}
      <div className="flex lg:hidden items-center justify-center m-4">
        <Button
          className="size-12 border-transparent hover:bg-transparent"
          variant="ghost"
          onClick={() => setIsSidebarOpen(true)}
        >
          <BiMenuAltRight className="size-6" />
        </Button>
      </div>
    </nav>
  );
};
