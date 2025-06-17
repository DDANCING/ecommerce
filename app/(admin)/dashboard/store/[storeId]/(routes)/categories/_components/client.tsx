"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { CategoriesColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

import { PlusIcon } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { ApiList } from "@/components/ui/api-list"
import { RoleGate, RoleGateNoMessage } from "@/components/auth/role-gate"
import { UserRole } from "@prisma/client"



interface BillboardClientProps {
  data: CategoriesColumn[],
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
      title={`Categorias (${data.length})`}
      description="Gerencie categorias para sua loja"
      />
      <Button onClick={() => router.push(`/dashboard/store/${params.storeId}/billboards/new`)}>
        <PlusIcon className="mr-2 h-4 w-4"/>
        Add new
      </Button>
    </div>
    <Separator/>
    <DataTable placeholder="Buscar por Categorias..." searchKey="label" columns={columns} data={data}/>
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

