
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged, User, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { KeyRound, User as UserIcon, ShieldAlert, Trash2, LogOut, LayoutDashboard } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";

const profileSchema = z.object({
  username: z.string().min(3, { message: "Kullanıcı adı en az 3 karakter olmalıdır." }),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Mevcut şifre gereklidir." }),
  newPassword: z.string().min(6, { message: "Yeni şifre en az 6 karakter olmalıdır." }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Yeni şifreler uyuşmuyor.",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/giris");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
        username: user?.displayName || ""
    }
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    try {
        await updateProfile(user, { displayName: data.username });
        toast({ title: "Başarılı!", description: "Kullanıcı adınız güncellendi." });
    } catch(error) {
        console.error(error);
        toast({ title: "Hata!", description: "Profil güncellenirken bir sorun oluştu.", variant: "destructive" });
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    if (!user || !user.email) return;

    const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
    
    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, data.newPassword);
      toast({ title: "Başarılı!", description: "Şifreniz başarıyla değiştirildi." });
      passwordForm.reset();
    } catch (error) {
      console.error(error);
      toast({ title: "Hata!", description: "Şifre değiştirilirken bir hata oluştu. Lütfen mevcut şifrenizi kontrol edin.", variant: "destructive" });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
        await deleteUser(user);
        toast({ title: "Hesap Silindi", description: "Hesabınız kalıcı olarak silindi." });
        router.push("/");
    } catch (error) {
        console.error(error);
        toast({ title: "Hata!", description: "Hesap silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin veya destek ile iletişime geçin.", variant: "destructive" });
    } finally {
        setIsDeleteDialogOpen(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
        </div>
        <div className="space-y-8">
            <Skeleton className="h-48 w-full rounded-xl"/>
            <Skeleton className="h-64 w-full rounded-xl"/>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <header className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-10">
          <Avatar className="h-24 w-24 border-4 border-primary/20">
             <AvatarImage 
                src={user.photoURL || `https://api.dicebear.com/7.x/thumbs/svg?seed=${user.uid}`} 
                alt={user.displayName || user.email || ''} 
            />
            <AvatarFallback className="text-3xl">{user.displayName ? user.displayName.substring(0, 2).toUpperCase() : user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.displayName || "Kullanıcı"}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
           <div className="sm:ml-auto flex gap-2">
              <Button asChild variant="outline">
                <a href="/admin"><LayoutDashboard /> Admin Paneli</a>
              </Button>
              <Button onClick={() => auth.signOut()} variant="ghost">
                <LogOut /> Çıkış Yap
              </Button>
           </div>
        </header>

        <main className="space-y-12">
          {/* Profile Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserIcon/> Profil Bilgileri</CardTitle>
              <CardDescription>
                Kullanıcı adınızı buradan güncelleyebilirsiniz.
              </CardDescription>
            </CardHeader>
            <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                    <CardContent>
                        <FormField
                            control={profileForm.control}
                            name="username"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kullanıcı Adı</FormLabel>
                                <FormControl>
                                <Input placeholder="Yeni kullanıcı adınız" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit">Değişiklikleri Kaydet</Button>
                    </CardFooter>
                </form>
            </Form>
          </Card>

          {/* Change Password Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><KeyRound/> Şifre Değiştir</CardTitle>
              <CardDescription>
                Güvenliğiniz için güçlü bir şifre seçin.
              </CardDescription>
            </CardHeader>
            <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mevcut Şifre</FormLabel>
                                <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Yeni Şifre</FormLabel>
                                <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Yeni Şifre (Tekrar)</FormLabel>
                                <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit">Şifreyi Değiştir</Button>
                    </CardFooter>
                </form>
            </Form>
          </Card>
           {/* Delete Account Card */}
           <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive"><ShieldAlert/> Tehlikeli Bölge</CardTitle>
              <CardDescription>
                Bu işlem geri alınamaz. Lütfen dikkatli olun.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Hesabınızı silmek, tüm gönderilerinizi, yorumlarınızı ve kişisel bilgilerinizi kalıcı olarak ortadan kaldıracaktır. Bu işlemi yapmak istediğinizden eminseniz devam edin.
              </p>
            </CardContent>
            <CardFooter className="border-t border-destructive/20 px-6 py-4">
              <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4"/>
                Hesabımı Kalıcı Olarak Sil
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
}

    