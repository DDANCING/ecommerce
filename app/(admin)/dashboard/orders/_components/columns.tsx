"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { Badge } from "@/components/ui/badge";

export type OrderColumn = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isPaid: boolean;
  method: string;
  totalAmount: string;
  sent: string;
  createdAt: string;
  installments: number;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "fullName",
    header: "Nome"
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "phone",
    header: "Telefone"
  },
 {
  accessorKey: "method",
  header: "Método",
  cell: ({ row }) => {
    const { method, installments } = row.original;

    return (
      <div className="flex items-center gap-x-2">
        {method === "credit-card" && installments ? (
          <h1>{method + " " + installments}X</h1> 
        ) : (
          <h1>{method}</h1> 
        )}
      </div>
    );
  }
},
  {
    accessorKey: "totalAmount",
    header: "Valor total"
    
  },
  {
    accessorKey: "isPaid",
    header: "Pagamento",
     cell: ({ row }) => (
    <div className="flex items-center gap-x-2">
      {row.original.isPaid ? (
        <Badge className="bg-emerald-500 text-white">Pago</Badge>
      ) : (
        <Badge className="bg-rose-500 text-white">Pendente</Badge>
      )}
    </div>
  )
  },
  {
    accessorKey: "sent",
    header: "Envio",
     cell: ({ row }) => (
    <div className="flex items-center gap-x-2">
      
        <Badge className="bg-muted text-white">
            {row.original.sent}
        </Badge>
     
      
    </div>
  )
  },
  {
    accessorKey: "createdAt",
    header: "Data",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  },
]
