import React from 'react';

import { Navbar } from './_components/navbar';
import { Footer } from './_components/footer';

import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';;

interface Props {
  children: React.ReactNode;
}



const Layout = async ({ children }: Props) => {
  const session = await auth();
  const userId = session?.user.id;


  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar user={userId ? { id: userId } : null} />
     
        <main className="flex-1">{children}</main>

        <Footer />
      </div>
    </SessionProvider>
  );
};

export default Layout;