"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Color, Image, Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  originalPrice: z.coerce.number().optional(),
  sku: z.coerce.number().optional(),
  rating: z.coerce.number().optional(),
  reviewCount: z.coerce.number().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

export type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: {
    id: string;
    name: string;
    sku?: number;
    storeId: string;
    categoryId: string;
    price: number;
    originalPrice?: number;
    rating?: number;
    reviewCount?: number;
    description?: string;
    isFeatured: boolean;
    isArchived: boolean;
    sizeId: string;
    colorId: string;
    images: Image[];
    createdAt: Date;
    updatedAt: Date;
  } | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  colors,
  sizes,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: initialData.price,
          originalPrice: initialData.originalPrice ?? undefined,
          sku: initialData.sku,
          rating: initialData.rating,
          reviewCount: initialData.reviewCount,
          description: initialData.description ?? "",
        }
      : {
          name: "",
          images: [],
          price: 0,
          originalPrice: undefined,
          sku: undefined,
          rating: undefined,
          reviewCount: undefined,
          description: "",
          categoryId: "",
          colorId: "",
          sizeId: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  const title = initialData ? "Editar produto" : "Criar produto";
  const description = initialData ? "Edite um produto" : "Adicione um novo produto";
  const toastMessage = initialData ? "Produto atualizado." : "Produto criado.";
  const action = initialData ? "Salvar alterações" : "Criar produto";

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      router.refresh();
      router.push(`/dashboard/store/${params.storeId}/products`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Algo deu errado." + error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.push(`/dashboard/store/${params.storeId}/products`);
      router.refresh();
      toast.success("Produto deletado.");
    } catch (error) {
      toast.error("Algo deu errado, tente novamente mais tarde.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
      <Card className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                  <Button type="button" disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Separator />
            </CardHeader>
            <CardContent>
                 <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Imagens</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value.map((image) => image.url)}
                                        disable={loading}
                                        onChange={(url) => {
                                            const currentImages = form.getValues("images");
                                            field.onChange([...currentImages, { url }]);
                                        }}
                                        onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                       
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Nome do produto" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Preço</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Selecione uma categoria" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sizeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tamanho</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Selecione um tamanho" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes.map((size) => (
                                                <SelectItem key={size.id} value={size.id}>
                                                    {size.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="colorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cor</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Selecione uma cor" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map((color) => (
                                                <SelectItem key={color.id} value={color.id}>
                                                    <div className="flex items-center gap-x-2">
                                                        {color.name}
                                                        <div
                                                            className="h-6 w-6 rounded-full border"
                                                            style={{ backgroundColor: color.value }}
                                                        />
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                   <FormControl>
                                    <Checkbox 
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                   </FormControl>
                                   <div className="space-y-1 leading-none">
                                    <FormLabel>
                                     em destaque
                                    </FormLabel>
                                    <FormDescription>
                                     Esse produto aparecerá na página inicial
                                    </FormDescription>
                                   </div>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                   <FormControl>
                                    <Checkbox 
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                   </FormControl>
                                   <div className="space-y-1 leading-none">
                                    <FormLabel>
                                     Arquivar
                                    </FormLabel>
                                    <FormDescription>
                                     Esse produto não aparecerá em nenhum lugar da loja
                                    </FormDescription>
                                   </div>
                                </FormItem>
                            )}
                        />
                        <FormField
  control={form.control}
  name="sku"
  render={({ field }) => (
    <FormItem>
      <FormLabel>SKU</FormLabel>
      <FormControl>
        <Input
          type="number"
          disabled={loading}
          placeholder="SKU do produto"
          {...field}
          value={field.value ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            field.onChange(val === "" ? undefined : Number(val));
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

   <FormField
  control={form.control}
  name="originalPrice"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Preço original</FormLabel>
      <FormControl>
        <Input
          type="number"
          disabled={loading}
          placeholder="Preço antes do desconto"
          {...field}
          value={field.value ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            field.onChange(val === "" ? undefined : Number(val));
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

 <FormField
  control={form.control}
  name="rating"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Avaliação</FormLabel>
      <FormControl>
        <Input
          type="number"
          disabled={loading}
          placeholder="Ex: 5"
          min={0} max={5} {...field} 
          value={field.value ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            field.onChange(val === "" ? undefined : Number(val));
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
    control={form.control}
    name="reviewCount"
    render={({ field }) => (
        <FormItem>
            <FormLabel>Quantidade de avaliações</FormLabel>
            <FormControl>
                <Input type="number" disabled={loading} placeholder="Ex: 120" {...field} />
            </FormControl>
            <FormMessage />
        </FormItem>
    )}
/>

<FormField
    control={form.control}
    name="description"
    render={({ field }) => (
        <FormItem className="col-span-full">
            <FormLabel>Descrição</FormLabel>
            <FormControl>
                <textarea
                    disabled={loading}
                    placeholder="Descrição detalhada do produto"
                    className="w-full border rounded-md p-2"
                    rows={4}
                    {...field}
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    )}
/>
                    </div>
            </CardContent>
            <CardFooter>
              <Button disabled={loading} className="ml-auto" type="submit">
                {action}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
};
