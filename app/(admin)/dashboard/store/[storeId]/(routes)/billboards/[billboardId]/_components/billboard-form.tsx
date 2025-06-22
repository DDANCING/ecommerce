"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
    initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => { 
    const params = useParams();
    const router = useRouter();
    
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: "",
            imageUrl: "",
        }
    }); 

    const title = initialData ? "Editar outdoor" : "Criar outdoor";
    const description = initialData ? "Edite um outdoor" : "Adicione um novo outdoor";
    const toastMessage = initialData ? "Outdoor atualizado." : "Outdoor criado.";
    const action = initialData ? "Salvar alterações" : "Criar outdoor";

    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
            await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
            } else {
            await axios.post(`/api/${params.storeId}/billboards`, data);
            }
            router.refresh();
            router.push(`/dashboard/store/${params.storeId}/billboards`);
            toast.success(toastMessage);
        } catch(error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.push("/dashboard");
            router.refresh();
            toast.success("Capa deletada.");
        } catch (error) {
            toast.error("certifique-se de que você removeu todas as categorias que usam essa capa primeiro.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
        <AlertModal 
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        />
        <div className="flex items-center justify-between">
            <Heading 
            title={title}
            description={description}
            />
           {initialData && (
            <Button
                disabled={loading}
                variant="destructive"
                size="icon"
                onClick={() => setOpen(true)}
            >
                <Trash className="h-4 w-4"/>
            </Button>
        )}
        </div>
        <Separator/>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                 <FormField 
                    control={form.control}
                    name="imageUrl"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Imagem de fundo
                            </FormLabel>
                            <FormControl>
                               <ImageUpload 
                               value={field.value ? [field.value] : []}
                               disable={loading}
                               onChange={(url) => field.onChange(url)}
                               onRemove={() => field.onChange("")}
                               />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                <div className="grid grid-cols-3 gap-8">
                    <FormField 
                    control={form.control}
                    name="label"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Nome
                            </FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Descrição" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                </div>
                <Button disabled={loading} className="ml-auto" type="submit">
                    {action}
                </Button>
            </form>
        </Form>

        </>
    )
}
