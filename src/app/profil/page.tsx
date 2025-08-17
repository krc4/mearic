
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { auth, db } from "@/lib/firebase/config";
import { onAuthStateChanged, User, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
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
import { KeyRound, User as UserIcon, ShieldAlert, Trash2, LogOut, LayoutDashboard, Image as ImageIcon, ChevronLeft } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import NextImage from "next/image";
import { isAdmin, getUserDoc, updateUserDoc } from "@/lib/firebase/services";

const profileSchema = z.object({
    displayName: z.string()
        .min(3, { message: "Kullanıcı adı en az 3 karakter olmalıdır." })
        .max(20, { message: "Kullanıcı adı en fazla 20 karakter olabilir." })
        .regex(/^[a-zA-Z0-9_]+$/, { message: "Sadece harf, rakam ve alt çizgi (_) kullanabilirsiniz." }),
});

const photoSchema = z.object({
    photoURL: z.string().url({ message: "Lütfen geçerli bir URL girin." }).min(1, { message: "URL alanı boş bırakılamaz." }),
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
type PhotoFormValues = z.infer<typeof photoSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [canChangeUsername, setCanChangeUsername] = useState(false);
  const [timeUntilNextChange, setTimeUntilNextChange] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const adminStatus = await isAdmin(currentUser.uid);
        setIsUserAdmin(adminStatus);
        
        const userDocData = await getUserDoc(currentUser.uid);
        if (userDocData && userDocData.displayNameLastChanged) {
          const lastChanged = userDocData.displayNameLastChanged.toDate();
          const now = new Date();
          const diff = now.getTime() - lastChanged.getTime();
          const hoursPassed = diff / (1000 * 60 * 60);
          
          if (hoursPassed < 24) {
            setCanChangeUsername(false);
            const hoursLeft = 24 - hoursPassed;
            const minutesLeft = (hoursLeft % 1) * 60;
            setTimeUntilNextChange(`${Math.floor(hoursLeft)} saat ${Math.floor(minutesLeft)} dakika sonra`);
          } else {
            setCanChangeUsername(true);
          }
        } else {
            setCanChangeUsername(true);
        }

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
        displayName: user?.displayName || ""
    }
  });

  const photoForm = useForm<PhotoFormValues>({
    resolver: zodResolver(photoSchema),
    values: {
        photoURL: user?.photoURL || ""
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
  
  const watchedPhotoURL = photoForm.watch("photoURL");

  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!user || !canChangeUsername) return;
    try {
        await updateProfile(user, { displayName: data.displayName });
        await updateUserDoc(user.uid, { 
            displayName: data.displayName,
            displayNameLastChanged: serverTimestamp() 
        });
        toast({ title: "Başarılı!", description: "Kullanıcı adınız güncellendi." });
        setUser({ ...user, displayName: data.displayName });
        setCanChangeUsername(false); // Immediately block until page reloads or state updates
        router.refresh();
    } catch(error) {
        console.error(error);
        toast({ title: "Hata!", description: "Kullanıcı adı güncellenirken bir sorun oluştu.", variant: "destructive" });
    }
  };

  const onPhotoSubmit = async (data: PhotoFormValues) => {
    if (!user) return;
    try {
        await updateProfile(user, { photoURL: data.photoURL });
        await updateUserDoc(user.uid, { photoURL: data.photoURL });
        toast({ title: "Başarılı!", description: "Profil fotoğrafınız güncellendi." });
        setUser({...user, photoURL: data.photoURL }); // Force a re-render to show the new avatar
        router.refresh();
    } catch(error) {
        console.error(error);
        toast({ title: "Hata!", description: "Fotoğraf güncellenirken bir sorun oluştu.", variant: "destructive" });
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
        <Skeleton className="h-8 w-8 mb-4" />
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
         <div className="mb-4">
            <Button variant="outline" size="sm" asChild>
                <Link href="/">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anasayfaya Dön
                </Link>
            </Button>
        </div>
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
              {isUserAdmin && (
                <Button asChild variant="outline">
                    <Link href="/admin"><LayoutDashboard /> Admin Paneli</Link>
                </Button>
              )}
              <Button onClick={() => auth.signOut()} variant="ghost">
                <LogOut /> Çıkış Yap
              </Button>
           </div>
        </header>

        <main className="space-y-12">
            {/* Change Username Card */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserIcon/> Kullanıcı Adı</CardTitle>
                <CardDescription>
                    Kullanıcı adınızı günde bir kez değiştirebilirsiniz. Sadece harf, rakam ve alt çizgi (_) kullanın.
                </CardDescription>
                </CardHeader>
                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                        <CardContent>
                             <FormField
                                control={profileForm.control}
                                name="displayName"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Yeni Kullanıcı Adı</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Yeni kullanıcı adınız..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
                            <Button type="submit" disabled={!canChangeUsername || profileForm.formState.isSubmitting}>
                                {profileForm.formState.isSubmitting ? 'Kaydediliyor...' : 'Kullanıcı Adını Kaydet'}
                            </Button>
                             {!canChangeUsername && (
                                <p className="text-sm text-destructive">
                                    Tekrar değiştirmek için beklemeniz gerekiyor: {timeUntilNextChange}
                                </p>
                            )}
                        </CardFooter>
                    </form>
                </Form>
            </Card>

          {/* Change Photo Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ImageIcon/> Profil Fotoğrafı</CardTitle>
              <CardDescription>
                Profil fotoğrafınızı bir resim URL'si ile güncelleyin.
              </CardDescription>
            </CardHeader>
            <Form {...photoForm}>
                <form onSubmit={photoForm.handleSubmit(onPhotoSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={photoForm.control}
                            name="photoURL"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Resim URL'si</FormLabel>
                                <FormControl>
                                <Input type="url" placeholder="https://ornek.com/resim.jpg" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        {photoForm.formState.isValid && watchedPhotoURL && (
                             <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-md mt-2">
                                <NextImage 
                                    src={watchedPhotoURL} 
                                    alt="Resim Önizlemesi" 
                                    fill 
                                    className="object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        toast({ variant: 'destructive', title: 'Geçersiz Resim URL', description: 'Lütfen geçerli bir resim URLsi girin.'})
                                    }}
                                />
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit" disabled={photoForm.formState.isSubmitting}>
                            {photoForm.formState.isSubmitting ? 'Kaydediliyor...' : 'Fotoğrafı Kaydet'}
                        </Button>
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
                        <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                            {passwordForm.formState.isSubmitting ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                        </Button>
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
        title="Hesabınızı Silmek Üzere misiniz?"
        description="Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir. Devam etmek istediğinizden emin misiniz?"
        confirmText="Evet, Hesabımı Sil"
      />
    </>
  );
}
