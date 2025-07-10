"use client";
import {
  LogOut,
  Headphones,
  ShoppingBag,
  MapPin,
  KeyRound,
  CreditCard,
  Archive,
  Heart,
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { logout } from "@/actions/logout";
import { User } from "@/public/icons/User";
import { useRouter, usePathname } from "next/navigation";

interface SidebarProps {
  name: string;
  email: string;
}

const navLinks = [
  {
    name: "Perfil",
    icon: User,
    href: "/profile",
  },
  {
    name: "My orders",
    icon: ShoppingBag,
    href: "/profile/orders",
  },
  {
    name: "Your addresses",
    icon: MapPin,
    href: "#",
  },
  {
    name: "Login & security",
    icon: KeyRound,
    href: "/profile/login-security",
  },
  {
    name: "Payments",
    icon: CreditCard,
    href: "#",
  },
  {
    name: "Saved items",
    icon: Heart,
    href: "/profile/wishlist",
  },
];

const onClick = () => {
  logout();
};

export function Sidebar({ name, email }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="bg-background rounded-xl shadow-sm py-8 px-6 flex flex-col h-full max-h-screen border">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Your Account</h2>
        <div className="mt-1 text-muted-foreground text-sm">
          {name && <span>{name}</span>}
        </div>
      </div>
      <ul className="flex flex-col gap-1 mb-6 flex-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li key={link.name}>
              <button
                onClick={() => router.push(link.href)}
                className={clsx(
                  "flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-foreground text-background font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                )}
                tabIndex={0}
                type="button"
              >
                <link.icon size={20} />
                <span>{link.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col gap-1 pt-2 border-t">
        <button
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
          tabIndex={0}
          type="button"
        >
          <Headphones size={20} />
          <span>Customer support</span>
        </button>
        <button
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
          tabIndex={0}
          type="button"
        >
          <LogOut size={20} />
          <span onClick={onClick}>Log out</span>
        </button>
      </div>
    </nav>
  );
}
