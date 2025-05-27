"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  return (
   <nav className="h-20 flex border-b justify-between font-medium bg-background">
        <Link href="/" className="pl-6 flex items-center">
            <span className="text-5xl font-semibold">
            Logo
            </span>
        </Link>
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
   </nav>
  )
}

