"use client";

import { useCurrentRole } from "@/data/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { FormError } from "@/components/form-error";
import { Card } from "../ui/card";

interface RoleGateProps {
  children?: React.ReactNode;
  allowedRole: UserRole;
};

export const RoleGate = ({
   children,
   allowedRole,
}: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <div className="flex justify-center m-20">
      <Card className="w-96 text-center p-4">
      <FormError message="Você não tem permissão para acessar este conteúdo. Por favor, verifique suas credenciais ou entre em contato com o administrador do sistema se acreditar que isso é um erro!"/>
      </Card>
       </div>
    )
  }

  return (
    <>
    {children}
    </>
  );
};
export const RoleGateNoMessage = ({
  children,
  allowedRole,
}: RoleGateProps) => {
 const role = useCurrentRole();

 if (role !== allowedRole) {
   return (
     <></>
   )
 }

 return (
   <>
   {children}
   </>
 );
};