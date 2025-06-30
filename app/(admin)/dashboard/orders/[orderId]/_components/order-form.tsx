/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { z } from "zod";
import { Buyer } from "@prisma/client";
import { Check, ChevronsUpDown, Trash, User, UserPlus } from "lucide-react";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { ProductSelectorFormField } from "./product-select";
import { SafeOrder, SafeProduct } from "@/app/types";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";

const formSchema = z.object({
  BuyerId: z.string().min(1, "Cliente é obrigatório"),
  product: z.object({ 
  id: z.string(), 
  quantity: z.number().min(1) 
}).array(),
  status: z.string().min(1, "Status é obrigatório"),
  isPaid: z.boolean().default(false).optional(),
  installments: z.coerce.number().min(1).optional(),
  totalAmount: z.coerce.number().min(1 , "É necessário adicionar produtos à encomenda"),
  paymentMethod: z.string().min(1, "Método é obrigatório"),
});

type OrderFormValues = z.infer<typeof formSchema>;

interface OrderFormProps {
  initialData: SafeOrder | null;
  buyers: Buyer[];
  products: SafeProduct[];
  isModal?: boolean;
  orderId: string;
}

export function OrderForm({ initialData, buyers, products, isModal, orderId }: OrderFormProps) {
  const router = useRouter();
  const params = useParams();

  const numberOfInstallments = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [couponPercent, setCouponPercent] = useState(0);
  

const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
  defaultValues: initialData
  ? {
      BuyerId: initialData.buyerId || '',
      product: initialData.orderItems.map(item => ({
        id: item.product.id,
        quantity: item.quantity ?? 1,
      })),
      status: initialData.status || '',
      isPaid: initialData.isPaid ?? false,
      installments: initialData.installments ?? 1,
      totalAmount: initialData.totalAmount ?? 0,
      paymentMethod: initialData.paymentMethod || '',
    }
  : {
      BuyerId: '',
      product: [],
      status: '',
      isPaid: false,
      installments: 1,
      totalAmount: 0,
      paymentMethod: '',
    },
  });

  const title = initialData ? "Editar pedido" : "Criar pedido";
  const description = initialData
    ? "Edite um pedido existente"
    : "Adicione um novo pedido";
  const action = initialData ? "Salvar alterações" : "Criar pedido";
  const toastMessage = initialData ? "Pedido atualizado." : "Pedido criado.";

  const getDiscountedTotal = () => {
    const couponDiscount = (couponPercent > 0) ? total * (couponPercent / 100) : 0;
    return total - (couponDiscount || discountValue);
  };

const onSubmit = async (data: OrderFormValues) => {
  try {
    setLoading(true);

    const selectedBuyer = buyers.find((b) => b.id === data.BuyerId);

    const payload = {
      storeId: params.storeId,
      buyer: {
        email: selectedBuyer?.email || "",
        document: selectedBuyer?.document || "",
        fullName: selectedBuyer?.fullName || "",
        phone: selectedBuyer?.phone || "",
        address: selectedBuyer?.address || "",
        number: selectedBuyer?.number || "",
        complement: selectedBuyer?.complement || "",
        neighborhood: selectedBuyer?.neighborhood || "",
        city: selectedBuyer?.city || "",
        state: selectedBuyer?.state || "",
        cep: selectedBuyer?.cep || "",
      },
      order: {
        isPaid: data.isPaid,
        paymentMethod: data.paymentMethod,
        installments: data.installments,
        status: data.status,
        totalAmount: data.totalAmount,
      },
      orderItems: data.product.map((p) => ({
  productId: p.id,
  quantity: p.quantity,
})),
    };

    console.log("Payload enviado:", payload);

    if (initialData && orderId) {
      await axios.patch(`/api/orders/${params.orderId}`, payload);
    } else {
      await axios.post(`/api/orders`, payload);
    }

    router.refresh();
    router.push(`/dashboard/orders`);
    toast.success(toastMessage);
  } catch (error) {
    console.error("Erro ao enviar:", error);
    toast.error("Erro ao criar pedido. Verifique os dados.");
  } finally {
    setLoading(false);
  }
};

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/orders/${params.orderId}`);
            router.push(`/dashboard/orders`);
            router.refresh();
            toast.success("Produto deletado.");
        } catch (error) {
            toast.error("Algo deu errado, tente novamente mais tarde")
        } finally {
            setLoading(false)
            setOpenDelete(false)
        }
    }

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <Card className="flex flex-col h-[calc(95vh-100px)] bg-transparent border-none p-4">
        {!isModal && (
          <CardHeader className="flex justify-between border p-4 rounded-xl">
            <Heading title={title} description={description} />
            {initialData && (
              <Button
                disabled={loading}
                variant="destructive"
                size="icon"
                onClick={() => setOpenDelete(true)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
        )}

        <div className="grid flex-1 gap-4 overflow-auto mt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid sm:flex w-full gap-4"
            >
    
              <Card className="p-4 flex-1 flex flex-col">
                <CardHeader className="flex justify-between border p-4 rounded-xl">
                  <Heading title="Cliente e Pagamento" description="Dados da compra" />
                </CardHeader>

                <div className="grid gap-6 flex-1">
                  <FormField
  control={form.control}
  name="BuyerId"
  render={({ field }) => {
    const selectedBuyer = buyers.find((b) => b.id === field.value);

    return (
      <FormItem>
        <FormLabel>Cliente</FormLabel>
        <Popover >
          <PopoverTrigger asChild disabled={!!initialData}>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selectedBuyer ? selectedBuyer.fullName : "Selecione um comprador"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Buscar comprador..." />
              <CommandList>
                <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                <CommandGroup heading="Compradores">
                  {buyers.map((buyer) => (
                    <CommandItem
                      key={buyer.id}
                      value={buyer.fullName}
                      onSelect={() => {
                        form.setValue("BuyerId", buyer.id);
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      {buyer.fullName}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          buyer.id === field.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setCreateModalOpen(true);
                    }}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Criar novo comprador
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    );
  }}
/>


                   <FormField
                            control={form.control}
                            name="isPaid"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pagamento</FormLabel>
                                    <Select
  disabled={loading}
  onValueChange={(value) => {
    const booleanValue = value === "true";
    field.onChange(booleanValue);
  }}
  value={form.watch("isPaid")?.toString() ?? "false"}
  defaultValue={form.watch("isPaid")?.toString() ?? "false"}
>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue defaultValue={form.watch("isPaid")?.toString() ?? "false"} placeholder="Selecione uma cor" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                           <SelectItem value="true">
                          <Badge className="bg-emerald-500">Pago</Badge>
                        </SelectItem>
                        <SelectItem value="false">
                          <Badge className="bg-gray-500">Não pago</Badge>
                        </SelectItem>
                          </SelectContent>
                           </Select>
                          <FormMessage />
                                </FormItem>
                            )}
                        />

            
                   <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Método de pagamento</FormLabel>
                                    <Select disabled={loading} onValueChange={(value) => (setPaymentMethod(value), field.onChange(value))} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue defaultValue={field.value} placeholder="Selecione uma cor" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="pix">Pix</SelectItem>
                                                <SelectItem value="credit-card">Cartão de crédito</SelectItem>
                                                <SelectItem value="Installments">Parcelamento na loja</SelectItem>
                                                <SelectItem value="money">Dinheiro</SelectItem>
                                                <SelectItem value="check">Cheque bancário</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                  
               {(paymentMethod === "credit-card" || paymentMethod === "Installments") && (
                  <FormField
                            control={form.control}
                            name="installments"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parcelas</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={(value) => {
                                          setPaymentMethod(value);
                                          field.onChange(parseInt(value)); 
                                        }}
                                        value={field.value?.toString()}
                                        defaultValue={field.value?.toString()}
                                      >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue defaultValue={field.value} placeholder="Selecione uma cor" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                             <SelectGroup>
                                          <SelectLabel>Parcelas</SelectLabel>
                                           {numberOfInstallments.map((installment) => (
                                             <SelectItem key={installment} value={installment.toString()}>
                                               {installment}x
                                             </SelectItem>
                                           ))}
                                         </SelectGroup>
                                         </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
 )}
                         <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue defaultValue={field.value} placeholder="Status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>  
                                        <SelectItem value="waiting">Aguardando envio</SelectItem>
                                        <SelectItem value="sent">Enviado</SelectItem>
                                        <SelectItem value="Delivered">Entregue</SelectItem>
                                        <SelectItem value="Returned">Devolvido</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                </div>
              </Card>

              {/* Produtos e descontos */}
              <Card className="p-4 flex-1 flex flex-col justify-between">
                <CardHeader className="flex justify-between border p-4 rounded-xl">
                  <Heading title="Produtos e Descontos" description="Quantidades, cupons e descontos" />
                </CardHeader>
                <CardContent className="overflow-y-auto scrollbar-none">
                  <ProductSelectorFormField
                  products={products}
                  control={form.control}
                  setValue={form.setValue}
                  getValues={form.getValues}
                  setPrice={setTotal}
                />
                </CardContent>
                <CardFooter className="flex justify-between gap-4 flex-wrap">
                  <div className="flex flex-col gap-1">
                    <Label className="text-sm font-medium">Cupom (%)</Label>
                    <Input
                      type="number"
                      step="any"
                      className="border px-2 py-1 rounded w-32"
                      value={couponPercent}
                      onChange={(e) => {
                        const percent = Number(e.target.value);
                        setCouponPercent(percent);
                        const calculatedDiscount = Number(((total * percent) / 100).toFixed(2));
                        setDiscountValue(calculatedDiscount);
                      }}
                      placeholder="0%"
                      min={0}
                      max={100}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label className="text-sm font-medium">Desconto (R$)</Label>
                    <Input
                      type="number"
                      step="any"
                      className="border px-2 py-1 rounded w-32"
                      value={discountValue}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setDiscountValue(value);
                        const calculatedPercent = total > 0 ? Number(((value / total) * 100).toFixed(2)) : 0;
                        setCouponPercent(calculatedPercent);
                      }}
                      placeholder="0.00"
                      min={0}
                      max={total}
                    />
                  </div>
<FormField
  control={form.control}
  name="totalAmount"
  render={({ field }) => {
    const total = getDiscountedTotal();
    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

   useEffect(() => {
  const hasProducts = form.getValues("product")?.length > 0;
  if (hasProducts && total > 0) {
    form.setValue("totalAmount", total);
  }
}, [total]);

    const displayedValue = field.value > 0 ? formatter.format(field.value) : formatter.format(total);

    return (
      <FormItem>
        <FormLabel>Total (R$)</FormLabel>
        <FormControl>
          <Input
            disabled
            value={displayedValue}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  }}
/>
                  <Button disabled={loading} type="submit" className="w-40 h-10 self-end">
                    {action}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      </Card>
    </>
  );
}
