"use client";

import { ProfileOptions } from "@/components/auth/user-button";
import { MainNav } from "@/app/(admin)/_components/main-nav";

const NavBar = () => {
  
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div>
          store switcher
        </div>
        <MainNav className="mx-6"/>
        <div className="ml-auto flex items-center space-x-4">
          <ProfileOptions/>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;