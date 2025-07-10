"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Buyer } from "@prisma/client";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import { Trash } from "lucide-react";
import { cpfCnpjSchema } from "@/schemas/validationSchema";

const formSchema = z.object({
  fullName: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Telefone inválido"),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  cep: z.string().min(8),
  neighborhood: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  document: z.object({
    cpfCnpj: cpfCnpjSchema,
  }),
});

type BuyerFormValues = z.infer<typeof formSchema>;

interface BuyerFormProps {
  initialData: Buyer | null;
  buyerId?: string;
  isModal: boolean;
}

export const BuyerForm: React.FC<BuyerFormProps> = ({ initialData, buyerId, isModal }) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<BuyerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          fullName: initialData.fullName || "",
          email: initialData.email || "",
          phone: initialData.phone || "",
          address: initialData.address || "",
          city: initialData.city || "",
          state: initialData.state || "",
          cep: initialData.cep || "",
          neighborhood: initialData.neighborhood || "",
          number: initialData.number || "",
          complement: initialData.complement || "",
          document: {
            cpfCnpj: initialData.document || "",
          },
        }
      : {
          fullName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          cep: "",
          neighborhood: "",
          number: "",
          complement: "",
          document: {
            cpfCnpj: "",
          },
        },
  });

  const title = initialData ? "Editar comprador" : "Criar comprador";
  const description = initialData
    ? "Edite os dados do comprador"
    : "Adicione um novo comprador";
  const action = initialData ? "Salvar alterações" : "Criar";

  const normalizeDocument = (value: string) => value.replace(/[^\d]/g, "");
  const normalizeCep = (value: string) => value.replace(/[^\d]/g, "");

  const onSubmit = async (data: BuyerFormValues) => {
    try {
      setLoading(true);

      const payload = {
        ...data,
        cep: normalizeCep(data.cep),
        document: normalizeDocument(data.document.cpfCnpj),
      };

      if (initialData && buyerId) {
        await axios.patch(`/api/buyers/${buyerId}`, payload);
        toast.success("Comprador atualizado com sucesso!");
      } else {
        try {
          await axios.post("/api/buyers", payload);
          toast.success("Comprador cadastrado com sucesso!");
        } catch (error: any) {
          if (error.response?.status === 409) {
            toast.error(error.response.data.error);
          } else {
            toast.error("Erro ao cadastrar comprador.");
          }
          return;
        }
      }

      router.refresh();
      router.push("/dashboard/buyers");
    } catch (error) {
      toast.error("Erro ao salvar comprador: " + error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      if (buyerId) {
        await axios.delete(`/api/buyers/${buyerId}`);
        toast.success("Comprador deletado");
        router.push("/dashboard/buyers");
        router.refresh();
      }
    } catch (error) {
      toast.error("Delete todas as compras desse cliente antes de deletá-lo!");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const buyerFields: Array<{
    name: keyof Omit<BuyerFormValues, "document">;
    label: string;
  }> = [
    { name: "fullName", label: "Nome completo" },
    { name: "email", label: "Email" },
    { name: "phone", label: "Telefone" },
    { name: "address", label: "Rua" },
    { name: "neighborhood", label: "Bairro" },
    { name: "number", label: "Número" },
    { name: "complement", label: "Complemento" },
    { name: "city", label: "Cidade" },
    { name: "state", label: "Estado" },
    { name: "cep", label: "CEP" },
  ];

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div>
        {isModal ? (
          <div>

          </div>
        ) : (
          <div className="flex justify-between mb-4">
          <Heading title={title} description={description} />
          {initialData && (
            <Button
              disabled={loading}
              variant="destructive"
              size="icon"
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
        )}
        <Separator className="mb-4" />

        

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            <div className="grid md:grid-cols-2 gap-8">
              {buyerFields.map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          disabled={loading}
                          placeholder={`Digite ${label.toLowerCase()}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <FormField
                control={form.control}
                name="document.cpfCnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF ou CNPJ</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        disabled={loading}
                        placeholder="Digite o CPF ou CNPJ"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={loading} className="ml-auto" type="submit">
              {action}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
