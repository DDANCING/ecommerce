import React from 'react';

import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import { SafeOrder } from '@/app/types';
import { db } from '@/lib/db';
import { Sidebar } from './_components/sidebar';
import NotFound from '@/app/not-found';
import { notFound } from 'next/navigation';
;

interface Props {
  children: React.ReactNode;
}


 
const ProfileLayout = async ({ children }: Props) => {
  const session = await auth();
  const userEmail = session?.user.email;


  
  
  
    const buyerWithOrders = await db.buyer.findUnique({
      where: {
        email: userEmail || "",
      },
    });

    if (!buyerWithOrders) {
      return notFound();
    }

    const buyerName = buyerWithOrders?.fullName || session?.user.name || "";
    const buyerEmailSafe = buyerWithOrders?.email || session?.user.email || "";
  


  return (
    <SessionProvider session={session}>
        <div className="container mx-auto px-4 py-8 mt-14">
       <div className="flex flex-col md:flex-row gap-8">
            
            <aside className="w-full md:w-64 flex-shrink-0">
              <Sidebar name={buyerName} email={buyerEmailSafe} />
            </aside>
            
      <main className="flex-1">
        {children}
      </main>
    </div>
    </div>
    </SessionProvider>
  );
};

export default ProfileLayout;