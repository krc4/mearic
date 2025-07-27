
"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LogIn, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, { message: "Kullanıcı adı en az 3 karakter olmalıdır." }),
  password: z.string().min(1, { message: "Şifre alanı boş bırakılamaz." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log(data);
    toast({
      title: "Giriş Başarılı!",
      description: "Hoş geldiniz! Ana sayfaya yönlendiriliyorsunuz.",
    });
    // Burada ana sayfaya yönlendirme yapılabilir.
    // router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-background/80 backdrop-blur-lg shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <LogIn className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">Giriş Yap</CardTitle>
              <CardDescription>
                Hesabınıza giriş yaparak yolculuğunuza devam edin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kullanıcı Adı</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Kullanıcı adınız" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Şifre</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full !mt-6 group" size="lg">
                    Giriş Yap
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex-col gap-4">
               <div className="text-center">
                 <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Şifrenizi mi unuttunuz?
                  </Link>
               </div>
              <p className="text-sm text-muted-foreground">
                Hesabınız yok mu?{' '}
                <Link href="/kayit" className="font-semibold text-primary hover:underline">
                  Kayıt Ol
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
