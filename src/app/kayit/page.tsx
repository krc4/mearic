
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { UserPlus, ArrowRight, AlertTriangle } from "lucide-react";
import { auth } from "@/lib/firebase/config"; 
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";

const registerSchema = z.object({
  username: z.string().min(3, { message: "Kullanıcı adı en az 3 karakter olmalıdır." }),
  email: z.string().email({ message: "Lütfen geçerli bir e-posta adresi girin." }),
  password: z.string().min(6, { message: "Şifre en az 6 karakter olmalıdır." }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Şifreler uyuşmuyor.",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // const onSubmit = async (data: RegisterFormValues) => {
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
  //     const user = userCredential.user;

  //     if (user) {
  //        await updateProfile(user, {
  //           displayName: data.username
  //        });
  //     }
      
  //     toast({
  //       title: "Kayıt Başarılı!",
  //       description: "Hesabınız başarıyla oluşturuldu. Hoş geldiniz!",
  //     });
  //     router.push('/');
  //   } catch (error: any) {
  //       console.error("Firebase registration error:", error);
  //       let description = "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.";
  //       if (error.code === 'auth/email-already-in-use') {
  //           description = "Bu e-posta adresi zaten kullanılıyor. Lütfen başka bir e-posta ile deneyin veya giriş yapın."
  //       } else if (error.code === 'auth/configuration-not-found') {
  //           description = "Firebase yapılandırması bulunamadı. Lütfen yönetici ile iletişime geçin."
  //       }
  //       toast({
  //           title: "Kayıt Hatası",
  //           description,
  //           variant: "destructive"
  //       });
  //   }
  // };

  // Dummy function for now
   const onSubmit = async (data: RegisterFormValues) => {
     console.log(data);
     toast({
       title: "Kayıt Devre Dışı",
       description: "Lütfen önce giriş sayfasını test edin.",
       variant: "destructive"
     })
   };

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-background/80 backdrop-blur-lg shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <UserPlus className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">Hesap Oluştur</CardTitle>
              <CardDescription>
                Aramıza katılın ve İslam'ı anlama yolculuğuna başlayın.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6" role="alert">
                    <div className="flex">
                        <div className="py-1"><AlertTriangle className="h-5 w-5 text-yellow-500 mr-3"/></div>
                        <div>
                            <p className="font-bold">Test Modu</p>
                            <p className="text-sm">Lütfen Firebase konsolundan manuel olarak bir test kullanıcısı (test@mail.com / 123456) oluşturun ve Giriş sayfasından giriş yapmayı deneyin.</p>
                        </div>
                    </div>
                </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kullanıcı Adı</FormLabel>
                        <FormControl>
                          <Input placeholder="Kullanıcı adınızı belirleyin" {...field} disabled/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-posta Adresi</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="ornek@mail.com" {...field} disabled/>
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
                          <Input type="password" placeholder="••••••••" {...field} disabled/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Şifre Tekrarı</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} disabled/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full !mt-6 group" size="lg" disabled>
                    Kayıt Ol
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Zaten bir hesabınız var mı?{' '}
                <Link href="/giris" className="font-semibold text-primary hover:underline">
                  Giriş Yap
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
