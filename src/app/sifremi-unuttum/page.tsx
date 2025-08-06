
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
import { MailQuestion, ArrowRight, ChevronLeft } from "lucide-react";
import { auth } from "@/lib/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Lütfen geçerli bir e-posta adresi girin." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast({
        title: "Sıfırlama E-postası Gönderildi!",
        description: `Şifrenizi sıfırlamak için lütfen ${data.email} adresindeki gelen kutunuzu kontrol edin.`,
      });
      router.push('/giris');
    } catch (error: any) {
      console.error("Password reset error:", error);
      let description = "Şifre sıfırlama e-postası gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
       if (error.code === 'auth/user-not-found') {
            description = "Bu e-posta adresine sahip bir kullanıcı bulunamadı. Lütfen e-postanızı kontrol edin."
        }
      toast({
        title: "Hata",
        description,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-background/80 backdrop-blur-lg shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <MailQuestion className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">Şifreni mi Unuttun?</CardTitle>
              <CardDescription>
                Sorun değil. E-posta adresinizi girin, size şifrenizi sıfırlamanız için bir bağlantı gönderelim.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-posta Adresi</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="ornek@mail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full !mt-6 group" size="lg" disabled={form.formState.isSubmitting}>
                    Sıfırlama Linki Gönder
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
               <Button variant="link" asChild>
                  <Link href="/giris">
                    <ChevronLeft className="w-4 h-4 mr-1"/>
                    Giriş ekranına geri dön
                  </Link>
                </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
