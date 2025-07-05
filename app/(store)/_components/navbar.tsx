"use client";

import Link from "next/link";
import { useState } from "react";
import { Home, LogOut, Settings, ShoppingCart } from "lucide-react";
import { BiMenuAltRight } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { NavbarSidebar } from "./navbar-sidebar";
import { GlobalSearch } from "@/components/ui/global-search";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoginButton } from "@/components/auth/login-button";
import { RegisterButton } from "@/components/auth/register-button";
import { ExpandableTabs } from "./ui/expandebla-tabs";
import { useSettingsModal } from "@/hooks/use-settings-modal";
import { CartButton } from "./ui/cart-button";
import { logout } from "@/actions/logout";
import { LoginExpandableTabs } from "./ui/login-expandable-tabs";

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

  const onLogout = () => {
    logout();
  };

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
      href: "/cart",
      content: <CartButton />,
    },
    {
      title: "Configurações",
      icon: Settings,
      content: "Configurações",
      onClick: () => settings.onOpen(),
    },
    {
      title: "Logout",
      icon: LogOut,
      content: "Sair",
      onClick: () => onLogout(),
    },
  ];

  const loginTabs = [
  {
    title: "Início",
    icon: Home,
    href: "/",
    content: <Link href="/">Home</Link>,
  },

];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full h-20 flex justify-between font-medium bg-transparent shadow-sm backdrop-blur-lg">
      <Link href="/" className="pl-6 flex items-center w-80">
        <span className="text-5xl font-semibold">Logo</span>
      </Link>

      <NavbarSidebar
        user={user}
        open={isSidebarOpen}
        items={navbarItems}
        onOpenChange={setIsSidebarOpen}
      />

      <div className={isMobile ? "mt-6 flex w-full justify-end" : "mx-auto mt-6 w-96"}>
        <GlobalSearch />
      </div>

      <div className="items-center gap-4 hidden lg:flex justify-around"></div>

      <div className="hidden lg:flex">
        {user ? (
          <ExpandableTabs tabs={tabs} activeColor="text-foreground" />
        ) : (
          <LoginExpandableTabs tabs={loginTabs} />
        )}
      </div>

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
