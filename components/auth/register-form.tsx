"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition } from "react";

import { RegisterSchema } from "@/schemas/index";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { CardWrapper } from "@/components/auth/card-wrapper"

import { FormSuccess } from "@/components/form-sucess";
import { register } from "@/actions/register"; // Assuming this is your server action
import { toast } from "sonner";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
            
            toast.error(data.error, {
          action: {
            label: "Fechar",
            onClick: () => console.log("Undo"),
          },
        })
          }

          if (data?.success) {
            setSuccess(data.success);
            toast.success(data.success); 
          }
        })
        .catch(() => {
          setError("Something went wrong!"); 
          toast.error("Something went wrong!"); 
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Crie uma conta"
      backButtonLabel="Já tem uma conta?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 "
        >
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-72">
                  <FormLabel>usuário</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="your username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-72">
                  <FormLabel>email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="email@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-72">
                  <FormLabel>senha</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* You can still keep FormSuccess and FormError for other visual cues */}
          <FormSuccess message={success} />
          {/* You might want a FormError here as well if you have specific error displays */}
          {/* <FormError message={error} /> */}
          <Button
            variant="outline"
            disabled={isPending}
            type="submit"
            className="w-full"
          >
            Criar
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};