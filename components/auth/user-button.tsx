"use client"


import { User } from "lucide-react";
import { CiLogout } from "react-icons/ci";
import { BiUser } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import { logout } from "@/actions/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Avatar,
  AvatarFallback,
  AvatarImage 
  } from "@/components/ui/avatar";

import { useCurrentUser } from "@/data/hooks/use-current-user";



export const ProfileOptions = () => {
  const user = useCurrentUser();
  const userId = user?.id;
  const onClick = () => {
    logout();
  };
 

  return (
    <DropdownMenu>
  <div className="flex gap-4 ">

  <DropdownMenuTrigger className="rounded-full"> 
 
    <Avatar className="w-10 h-10 hover:border-2 hover:border-primary" >
    <AvatarImage src={user?.image || ""}/>
    <AvatarFallback>
  <User  className="hover:text-primary"/>
    </AvatarFallback>
    </Avatar>
  
 
    </DropdownMenuTrigger>
    </div>
  <DropdownMenuContent className="box-content mx-6">
  <DropdownMenuItem>
          
  <BiUser /> <a href={`/profile/${userId}`}> Profile </a>
         
             </DropdownMenuItem>
    
             <DropdownMenuSeparator />
           <DropdownMenuItem>
          
           <CiSettings />
           <a href="/settings"> Settings </a>
        
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem>
            <button className="flex " type="submit" onClick={onClick} >
            <CiLogout className="mr-2"/> Log out 
            </button>
            
        </DropdownMenuItem>
        
  </DropdownMenuContent>
</DropdownMenu>

  )
}