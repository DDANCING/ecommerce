import Link from "next/link";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { RoleGateNoMessage } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";
import { DashboardIcon } from "@radix-ui/react-icons";


interface NavbarItem {
    href: string;
    Children: React.ReactNode;
}

interface Props {
    items: NavbarItem[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: {
    id: string;
  } | null;
}

export const NavbarSidebar = ({ items, onOpenChange, open, user }: Props) => {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
            side="left"
            className="p-0 transition-all"
            >
                <SheetHeader className="p-4 border-b">
                    <div className="flex items-center">
                        <SheetTitle>
                            Menu
                        </SheetTitle>
                    </div>
                </SheetHeader>
                <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                    {items.map((item) => (
                        <Link 
                        onClick={() => onOpenChange(false)}
                        key={item.href}
                        href={item.href}
                        className="w-full text-left p-4 hover:bg-foreground hover:text-background flex items-center text-base font-medium"
                        >
                            {item.Children}
                        </Link>
                    ))}
                    <div className="border-t">
                {user? (
                    <RoleGateNoMessage allowedRoles={[UserRole.ADMIN, UserRole.SELLER, UserRole.OWNER]} >
                          <Link 
                onClick={() => onOpenChange(false)}
                href="/dashboard"
                 className="w-full gap-2 text-left p-4 hover:bg-foreground hover:text-background flex items-center text-base font-medium"
                 >
                  <DashboardIcon/> <h1> Dashboard </h1> 
                 </Link>
                    </RoleGateNoMessage>
                ):(
                    <div>
              <Link 
                onClick={() => onOpenChange(false)}
                href="/auth/login"
                 className="w-full text-left p-4 hover:bg-foreground hover:text-background flex items-center text-base font-medium"
                 >
                 Log in
                
                  </Link>
                  <Link
                   onClick={() => onOpenChange(false)} 
                  href="/auth/register"
                  className="w-full text-left p-4 hover:bg-foreground hover:text-background flex items-center text-base font-medium"
                  >
                 Start selling
                  </Link>
                    </div>
                )}
                
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
};