"use client"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { useParams, usePathname } from "next/navigation"
import Link from "next/link"

export function MainNav({ className, ...props } : React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();

  const routes = [
    {
      href: `/dashboard/store/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/dashboard/store/${params.storeId}/settings`
    },
    {
      href: `/dashboard/store/${params.storeId}/billing`,
      label: "Billing",
      active: pathname === `/dashboard/store/${params.storeId}/billing`
    }
  ];

  return (
    <NavigationMenu className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <NavigationMenuList>
        {routes.map((route) => (
          <NavigationMenuItem key={route.href}>
            <NavigationMenuLink asChild>
              <Link
                href={route.href}
                className={cn(
                  navigationMenuTriggerStyle(),
                  route.active ? "font-bold text-primary" : "text-muted-foreground"
                )}
              >
                {route.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
