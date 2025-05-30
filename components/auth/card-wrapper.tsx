"use client";

import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader

 } from "@/components/ui/card"
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";
import { Separator } from "../ui/separator";


interface CardWrapperProps {
  children?: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
};

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial
}: CardWrapperProps  ) => {
  return(
<Card className="bg-background ">
  <CardHeader>
    <Header label={headerLabel}/>
  </CardHeader>
  <CardContent >
{children}
</CardContent>
<Separator withText text="ou"/>
{showSocial && (
<CardFooter>
  <Social />
</CardFooter>  
)}
<CardFooter>
<BackButton
label={backButtonLabel}
href={backButtonHref} 
/>
</CardFooter>  
</Card> 
  ) 
}