
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}


const Layout = async ({ children }: Props) => {
  const session = await auth()
  const userId = session?.user.id;
  
  return (
    <SessionProvider session={session}>
    <div className="flex flex-col min-h-screen">
      <Navbar user={userId ? { id: userId } : null} />
      <div className="flex-1 bg-foreground/2">
    
      {children}
  
      </div>
      <Footer/>
    </div>
    </SessionProvider>
  )
}

export default Layout;