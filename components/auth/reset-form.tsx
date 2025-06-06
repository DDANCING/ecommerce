"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition } from "react";


import { ResetSchema } from "@/schemas/index";

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
import { reset } from "@/actions/reset";


export const ResetForm = ()  => {
 
  const [error , setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition(); 

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
     
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
   setError("");
   setSuccess("");

    

    startTransition(() => {
    reset(values)
     .then((data) => {
      setError(data?.error);
      setSuccess(data?.success);
     })
    });
  };

  return(
    <CardWrapper
    headerLabel="Esqueceu sua senha?"
    backButtonLabel="Voltar para o login"
    backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form   
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 "
        >
          <div className="space-y-2">
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
                <FormMessage/>
              </FormItem>
            )}
            />
           
          </div>
       
          <FormSuccess message={success}/>
          <Button 
          disabled={isPending} 
          type="submit"
          className="w-72"
          >  
          Enviar email de redefinição<ol></ol>
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};