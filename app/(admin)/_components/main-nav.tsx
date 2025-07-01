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
        href: `/dashboard/store/${params.storeId}/products`,
        label: "Produtos",
        active: pathname === `/dashboard/store/${params.storeId}/Products`
      },
      {
        href: `/dashboard/store/${params.storeId}/billboards`,
        label: "Outdoors",
        active: pathname === `/dashboard/store/${params.storeId}/billboards`
      },
      {
        href: `/dashboard/store/${params.storeId}/categories`,
        label: "Categorias",
        active: pathname === `/dashboard/store/${params.storeId}/categories`
      },
      {
        href: `/dashboard/store/${params.storeId}/sizes`,
        label: "Tamanhos",
        active: pathname === `/dashboard/store/${params.storeId}/sizes`
      },
      {
        href: `/dashboard/store/${params.storeId}/colors`,
        label: "Cores",
        active: pathname === `/dashboard/store/${params.storeId}/colors`
      },
      {
        href: `/dashboard/store/${params.storeId}/settings`,
        label: "Configurações",
        active: pathname === `/dashboard/store/${params.storeId}/settings`
      },
      
    ];
  } else if (pathname?.startsWith("/dashboard")) {
    routes = [
      {
        href: "/dashboard",
        label: "Dashboard",
        active: pathname === "/dashboard"
      },
      {
        href: "/dashboard/overview",
        label: "Overview",
        active: pathname === "/dashboard/overview"
      },
      {
        href: "/dashboard/orders",
        label: "Pedidos",
        active: pathname === "/dashboard/orders"
      },
      {
        href: "/dashboard/buyers",
        label: "Clientes",
        active: pathname === "/dashboard/buyers"
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
