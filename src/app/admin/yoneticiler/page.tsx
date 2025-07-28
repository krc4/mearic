
"use client"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Shield,
  UserPlus,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { AdminUser } from "@/lib/admin"
import { getAdmins, addAdmin, removeAdmin } from "@/lib/firebase/services"
import { Skeleton } from "@/components/ui/skeleton"
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const addAdminSchema = z.object({
  email: z.string().email({ message: "Lütfen geçerli bir e-posta adresi girin." }),
});

type AddAdminFormValues = z.infer<typeof addAdminSchema>;

const AdminList = ({ admins, onRemoveClick }: { admins: AdminUser[], onRemoveClick: (adminId: string) => void }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {admins.map((admin) => (
            <Card key={admin.uid}>
                <CardContent className="p-4 flex items-center gap-4">
                     <Avatar className="h-12 w-12">
                        <AvatarImage src={admin.photoURL || `https://api.dicebear.com/7.x/thumbs/svg?seed=${admin.uid}`} />
                        <AvatarFallback>{admin.displayName ? admin.displayName.substring(0, 2).toUpperCase() : admin.email.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <p className="font-semibold">{admin.displayName || 'İsimsiz'}</p>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                         <p className="text-xs text-muted-foreground">
                            Eklendi: {admin.addedAt ? new Date(admin.addedAt.seconds * 1000).toLocaleDateString() : '-'}
                        </p>
                    </div>
                     <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => onRemoveClick(admin.uid)}>
                        <Trash2 className="h-4 w-4" />
                     </Button>
                </CardContent>
            </Card>
        ))}
    </div>
  )
}

export default function YoneticilerAdminPage() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [adminToRemove, setAdminToRemove] = useState<string | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const { toast } = useToast();

    const form = useForm<AddAdminFormValues>({
        resolver: zodResolver(addAdminSchema),
        defaultValues: { email: "" },
    });

    const fetchAdmins = async () => {
        setLoading(true);
        const fetchedAdmins = await getAdmins();
        setAdmins(fetchedAdmins);
        setLoading(false);
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleRemoveClick = (adminId: string) => {
        setAdminToRemove(adminId);
        setIsAlertOpen(true);
    };

    const handleRemoveConfirm = async () => {
        if (adminToRemove) {
            const success = await removeAdmin(adminToRemove);
            if (success) {
                setAdmins(admins.filter(a => a.uid !== adminToRemove));
                toast({ title: "Başarılı!", description: "Yönetici başarıyla kaldırıldı." });
            } else {
                 toast({ title: "Hata!", description: "Yönetici kaldırılırken bir sorun oluştu.", variant: "destructive" });
            }
            setAdminToRemove(null);
        }
        setIsAlertOpen(false);
    };

    const onSubmit = async (data: AddAdminFormValues) => {
        const { success, message } = await addAdmin(data.email);
        if (success) {
            toast({ title: "Başarılı!", description: message });
            form.reset();
            fetchAdmins(); // Refresh the admin list
        } else {
             toast({ title: "Hata!", description: message, variant: "destructive" });
        }
    }


  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Yöneticiler
        </h1>
      </div>

       <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus />
            Yeni Yönetici Ekle
          </CardTitle>
          <CardDescription>
            Sisteme kayıtlı bir kullanıcıyı e-posta adresi ile yönetici olarak atayın.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex gap-2">
                                    <FormControl>
                                        <Input placeholder="ornek@mail.com" {...field} />
                                    </FormControl>
                                    <Button type="submit" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? 'Ekleniyor...' : 'Yönetici Yap'}
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </form>
        </Form>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Mevcut Yöneticiler</CardTitle>
          <CardDescription>
            Sistemdeki tüm yöneticilerin listesi.
          </CardDescription>
        </CardHeader>
        <CardContent>
             {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            ) : (
                <AdminList admins={admins} onRemoveClick={handleRemoveClick} />
            )}
        </CardContent>
      </Card>
      <DeleteConfirmationDialog
        isOpen={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        onConfirm={handleRemoveConfirm}
        title="Yöneticiyi Kaldırmak İstediğinizden Emin misiniz?"
        description="Bu işlem kullanıcıyı sistemden silmez, sadece yönetici yetkilerini kaldırır. Bu işlem geri alınamaz."
        confirmText="Evet, Yetkilerini Kaldır"
      />
    </>
  )
}
