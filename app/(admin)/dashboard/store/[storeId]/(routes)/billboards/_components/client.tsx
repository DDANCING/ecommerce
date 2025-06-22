"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { BillboardColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

import { PlusIcon } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { ApiList } from "@/components/ui/api-list"
import { RoleGate, RoleGateNoMessage } from "@/components/auth/role-gate"
import { UserRole } from "@prisma/client"



interface BillboardClientProps {
  data: BillboardColumn[],
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ 
  data
}) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
    <div className="flex items-center justify-between">
      <Heading
      title={`Outdoors (${data.length})`}
      description="Gerencie outdoors para sua loja"
      />
      <Button onClick={() => router.push(`/dashboard/store/${params.storeId}/billboards/new`)}>
        <PlusIcon className="mr-2 h-4 w-4"/>
        Novo outdoor
      </Button>
    </div>
    <Separator/>
    <DataTable placeholder="Buscar por Banner..." searchKey="label" columns={columns} data={data}/>
    <RoleGateNoMessage allowedRoles={[UserRole.ADMIN]}>
    <Heading
    title="API"
    description="API calls for billboards"
    />
    <Separator />
    <ApiList 
    entityName="billboards"
    entityIdName="billboardId"
    />
    </RoleGateNoMessage>
    </>
  )
}

