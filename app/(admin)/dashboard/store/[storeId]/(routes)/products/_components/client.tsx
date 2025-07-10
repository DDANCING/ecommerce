"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { ProductColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

import { PlusIcon } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { ApiList } from "@/components/ui/api-list"
import { RoleGate, RoleGateNoMessage } from "@/components/auth/role-gate"
import { UserRole } from "@prisma/client"



interface ProductClientProps {
  data: ProductColumn[],
}

export const ProductClient: React.FC<ProductClientProps> = ({ 
  data
}) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
    <div className="flex items-center justify-between">
      <Heading
      title={`Produtos (${data.length})`}
      description="Gerencie produtos da sua loja"
      />
      <Button onClick={() => router.push(`/dashboard/store/${params.storeId}/products/new`)}>
        <PlusIcon className="mr-2 h-4 w-4"/>
        Novo produto
      </Button>
    </div>
    <Separator/>
    <DataTable placeholder="Buscar por produtos..." searchKey="name" columns={columns} data={data}/>
    <RoleGateNoMessage allowedRoles={[UserRole.ADMIN]}>
    <Heading
    title="API"
    description="API calls for products"
    />
    <Separator />
    <ApiList 
    entityName="products"
    entityIdName="productId"
    />
    </RoleGateNoMessage>
    </>
  )
}

