"use client";

import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/data/hooks/use-current-user";
import { SettingsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import UrlTabs from "../urltabs";

import { SyncLoader } from "react-spinners";
import { ModeToggle } from "../ui/mode-toggle";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { Modal } from "../modal";
import { useSettingsModal } from "@/hooks/use-settings-modal";
import { TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

export const SettingsModal = () => {
const [error, setError] = useState<string | undefined>(); 
const [success, setSuccess] = useState<string | undefined>();   
const [isPending, startTransition] = useTransition();
const user =  useCurrentUser();
const { update } = useSession();
const settingsModal = useSettingsModal();

const form = useForm<z.infer<typeof SettingsSchema>>({
  resolver: zodResolver(SettingsSchema),
  defaultValues: {
    password: undefined,
    newPassword: undefined,
    name: user?.name || undefined,
    email: user?.email || undefined,
    isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
  }
});

const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
   startTransition(() => {
   settings(values)
   .then((data) => {
    if (data.error) {
      setError(data.error)
      toast(data.error, {
        
        action: {
          label: "Close",
          onClick: () => console.log("Undo"),
        },
      })
    }

    if (data.success) {
      update(); 
      setSuccess(data.success);
      toast(data.success, {
        
        action: {
          label: "Close",
          onClick: () => console.log("Undo"),
        },
      })
    }
    
   })
   .catch(() => setError("Something went wrong!"));
   
  });
}

  return (
   <Modal 
       title="Editar perfil"
       description=""
       isOpen={settingsModal.isOpen}
       onClose={settingsModal.onClose}
       >
      
         <div className="flex h-full w-full">
    <UrlTabs defaultValue="account">
      <TabsList className={cn(
        "grid w-full grid-cols-3",
        user?.isOAuth !== false && "grid w-full grid-cols-3"
      )}
      >  
        <TabsTrigger value="account">Account</TabsTrigger>
        {user?.isOAuth === false &&(
        <TabsTrigger value="password">Password</TabsTrigger>
        )}
        <TabsTrigger value="configs">Preferences</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
          
          <Form {...form}>
            <form 
            className="space-y-6" 
            onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="space-y-4" >
              <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
            <FormItem>
              <FormLabel> Name </FormLabel>
              <FormControl>
                <Input
                {...field}
                placeholder={user?.name || ""} 
                disabled={isPending}
                />
              </FormControl>
            </FormItem>
            )}
              />
              {user?.isOAuth === false &&(
              <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
            <FormItem>
              <FormLabel> Email </FormLabel>
              <FormControl>
                <Input
                {...field}
                placeholder={user?.email || ""} 
                disabled={isPending}
                />
              </FormControl>
            </FormItem>
            )}
              />
            )} 
              {user?.isOAuth === false && (
              <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>  Two Factor Authentication  </FormLabel>
                <FormDescription>
                  Enable two factor authentication for your account
                </FormDescription>
              </div>
              <FormControl>
                <Switch 
                disabled={isPending}
                checked={field.value}
                onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
            )}
              />
          )}
           </div>
           <DialogFooter className="border-t border-border px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
           <Button  disabled={isPending} type="submit" > 
            {isPending? <SyncLoader size={6}/> : "Save"}
           </Button>
        </DialogFooter>
          
            </form>
          </Form>
          
          </CardContent>
          <CardFooter>
           
          </CardFooter>
        </Card>
      </TabsContent>
      {user?.isOAuth === false &&(
      <TabsContent value="password">
        
      <Form {...form}>
            <form 
            className="space-y-6" 
            onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="space-y-4" >
            <Card className="p-6 shadow-none"> 
                <>
              <FormField
              control={form.control}
              
              name="password"
              render={({ field }) => (
            <FormItem>
              <FormLabel> Password </FormLabel>
              <FormControl>
                <Input
                {...field}
                placeholder="******" 
                type="password"
                disabled={isPending}
                />
              </FormControl>
            </FormItem>
            )}
              />
              <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
            <FormItem>
              <FormLabel> New Password </FormLabel>
              <FormControl>
                <Input
                {...field}
                placeholder="******" 
                type="password"
                disabled={isPending}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
            )}
              />
              </>
               <DialogFooter className="border-t border-border px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
            <Button disabled={isPending} type="submit" > 
            {isPending? <SyncLoader size={6} /> : "Charge your password"}
           </Button>
        </DialogFooter>
              </Card> 
              
           </div>
          
           
            </form>
          </Form>
      </TabsContent>
 )} 
      <TabsContent value="configs">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
           <ModeToggle/>
          </CardContent>
        
        </Card>
      </TabsContent>
    
    
      </UrlTabs>
    </div>
      </Modal>
  );
}
