
import { ProfileOptions } from "@/components/auth/user-button";
import { MainNav } from "@/app/(admin)/_components/main-nav";
import StoreSwitcher from "@/app/(admin)/_components/store-switcher";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";


const NavBar = async () => {
  const user = await auth();
  const userId = user?.user.id; 

  if(!userId) {
    redirect("/auth/login")
  }

  const stores = await db.store.findMany({
    where: {
      userId,
    }
  })

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher  items={stores}/>
        <MainNav className="mx-6"/>
        <div className="ml-auto flex items-center space-x-4">
          <ProfileOptions/>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;