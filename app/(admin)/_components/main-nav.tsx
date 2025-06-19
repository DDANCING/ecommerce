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

type Route = {
  href: string
  label: string
  active: boolean
}

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  let routes: Route[] = [];

  if (pathname?.startsWith("/dashboard/store")) {
    routes = [
      {
        href: `/dashboard/store/${params.storeId}/overview`,
        label: "Overview",
        active: pathname === `/dashboard/store/${params.storeId}/overview`
      },
      {
        href: `/dashboard/store/${params.storeId}/billboards`,
        label: "Billboards",
        active: pathname === `/dashboard/store/${params.storeId}/billboards`
      },
      {
        href: `/dashboard/store/${params.storeId}/categories`,
        label: "Categories",
        active: pathname === `/dashboard/store/${params.storeId}/categories`
      },
      {
        href: `/dashboard/store/${params.storeId}/sizes`,
        label: "Sizes",
        active: pathname === `/dashboard/store/${params.storeId}/sizes`
      },
      {
        href: `/dashboard/store/${params.storeId}/settings`,
        label: "Settings",
        active: pathname === `/dashboard/store/${params.storeId}/settings`
      },
      
    ];
  } else if (pathname === "/dashboard") {
    routes = [
      {
        href: "/dashboard",
        label: "Overview",
        active: pathname === "/dashboard"
      }
    ];
  }

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
  );
}
