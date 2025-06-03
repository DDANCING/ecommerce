import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from 'nextjs-toploader';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { SettingsModalProvider } from "@/providers/profile-settings-provider";


const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ecommerce",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  return (
  <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body className={montserrat.className}>
          <NextTopLoader
            color="#fafafa"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #22c55e,0 0 5px #22c55e" />
         
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            
            {children}
         <SettingsModalProvider/>  
         <SpeedInsights />
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
