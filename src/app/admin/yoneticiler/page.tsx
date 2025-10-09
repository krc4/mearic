

"use client"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Shield,
  UserPlus,
  Trash2,
  Crown,
  ShieldCheck,
  Settings,
  MessageSquare,
  FilePlus,
  FilePen,
  FileX,
  Users
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
import type { AdminUser, AdminPermissions } from "@/lib/admin"
import { getAdmins, addAdmin, removeAdmin, updateAdminPermissions } from "@/lib/firebase/services"
import { Skeleton } from "@/components/ui/skeleton"
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"


const addAdminSchema = z.object({
  email: z.string().email({ message: "Lütfen geçerli bir e-posta adresi girin." }),
});

type AddAdminFormValues = z.infer<typeof addAdminSchema>;

const AdminList = ({ admins, onRemoveClick, onSettingsClick }: { admins: AdminUser[], onRemoveClick: (admin: AdminUser) => void, onSettingsClick: (admin: AdminUser) => void }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {admins.map((admin) => (
            <Card key={admin.uid} className={admin.role === 'founder' ? 'border-amber-400' : ''}>
                <CardContent className="p-4 flex items-center gap-4">
                     <Avatar className="h-12 w-12">
                        <AvatarImage src={admin.photoURL || `https://api.dicebear.com/7.x/thumbs/svg?seed=${admin.uid}`} />
                        <AvatarFallback>{admin.displayName ? admin.displayName.substring(0, 2).toUpperCase() : admin.email.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{admin.displayName || 'İsimsiz'}</p>
                          {admin.role === 'founder' ? (
                            <Badge className="bg-amber-400 text-amber-950 hover:bg-amber-400/90"><Crown className="w-3 h-3 mr-1"/>Kurucu</Badge>
                          ) : (
                            <Badge variant="secondary"><ShieldCheck className="w-3 h-3 mr-1"/>Yönetici</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                         <p className="text-xs text-muted-foreground">
                            Eklendi: {admin.addedAt ? new Date(admin.addedAt.seconds * 1000).toLocaleDateString() : '-'}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      {admin.role !== 'founder' && (
                        <>
                          <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => onSettingsClick(admin)}>
                              <Settings className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => onRemoveClick(admin)}>
                              <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
  )
}

const PermissionsDialog = ({ 
    isOpen, 
    onOpenChange, 
    admin, 
    onPermissionsChange 
}: { 
    isOpen: boolean, 
    onOpenChange: (open: boolean) => void, 
    admin: AdminUser | null, 
    onPermissionsChange: (uid: string, permissions: AdminPermissions) => void 
}) => {
    if (!admin) return null;

    const handleSwitchChange = (permission: keyof AdminPermissions, value: boolean) => {
        const updatedPermissions = { ...admin.permissions, [permission]: value };
        onPermissionsChange(admin.uid, updatedPermissions);
    };

    const permissionItems = [
      { id: 'canManageAdmins', label: 'Yönetici Yönetimi', description: 'Yeni yönetici ekleyebilir veya mevcutları kaldırabilir.', icon: Users },
      { id: 'canCreatePosts', label: 'Yazı Oluşturma', description: 'Yeni blog yazıları ve mucizeler oluşturabilir.', icon: FilePlus },
      { id: 'canEditPosts', label: 'Yazı Düzenleme', description: 'Mevcut tüm yazıları düzenleyebilir.', icon: FilePen },
      { id: 'canDeletePosts', label: 'Yazı Silme', description: 'Mevcut tüm yazıları kalıcı olarak silebilir.', icon: FileX },
      { id: 'canDeleteComments', label: 'Yorum Silme', description: 'Sitedeki herhangi bir yorumu silebilir.', icon: MessageSquare },
    ] as const;


    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Yönetici Yetkileri: {admin.displayName}</DialogTitle>
                    <DialogDescription>{admin.email}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    {permissionItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label htmlFor={item.id} className="flex items-center gap-2">
                                    <item.icon className="h-4 w-4 text-muted-foreground"/>
                                    {item.label}
                                </Label>
                                <p className="text-xs text-muted-foreground pl-6">
                                    {item.description}
                                </p>
                            </div>
                            <Switch
                                id={item.id}
                                checked={admin.permissions[item.id]}
                                onCheckedChange={(checked) => handleSwitchChange(item.id, checked)}
                            />
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Kapat</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function YoneticilerAdminPage() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [adminToRemove, setAdminToRemove] = useState<AdminUser | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
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

    const handleRemoveClick = (admin: AdminUser) => {
        if (admin.role === 'founder') {
            toast({
                title: "İşlem Reddedildi",
                description: "Kurucu yönetici sistemden kaldırılamaz.",
                variant: "destructive",
            });
            return;
        }
        setAdminToRemove(admin);
        setIsAlertOpen(true);
    };

    const handleRemoveConfirm = async () => {
        if (adminToRemove) {
            const { success, message } = await removeAdmin(adminToRemove.uid);
            if (success) {
                setAdmins(admins.filter(a => a.uid !== adminToRemove.uid));
                toast({ title: "Başarılı!", description: message });
            } else {
                 toast({ title: "Hata!", description: message, variant: "destructive" });
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

    const handleSettingsClick = (admin: AdminUser) => {
        setSelectedAdmin(admin);
        setIsPermissionsDialogOpen(true);
    };
    
    const handlePermissionsChange = async (uid: string, permissions: AdminPermissions) => {
        // Optimistic UI update
        setAdmins(currentAdmins => 
            currentAdmins.map(admin => 
                admin.uid === uid ? { ...admin, permissions } : admin
            )
        );
        setSelectedAdmin(prev => prev ? { ...prev, permissions } : null);

        const { success, message } = await updateAdminPermissions(uid, permissions);
        if (success) {
            toast({ title: "Başarılı!", description: message });
        } else {
            toast({ title: "Hata!", description: message, variant: "destructive" });
            // Revert UI on failure
            fetchAdmins(); 
        }
    };


  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Yönetici Yetkilendirme
        </h1>
      </div>

       <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus />
            Yeni Yönetici Ekle
          </CardTitle>
          <CardDescription>
            Sisteme kayıtlı bir kullanıcıyı e-posta adresi ile 'Yönetici' rolünde atayın. 'test1' adlı kullanıcı her zaman 'Kurucu' olur.
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
            Sistemdeki tüm yöneticilerin listesi ve rolleri. Kurucu yönetici altın bir çerçeve ile vurgulanmıştır.
          </CardDescription>
        </CardHeader>
        <CardContent>
             {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            ) : (
                <AdminList admins={admins} onRemoveClick={handleRemoveClick} onSettingsClick={handleSettingsClick} />
            )}
        </CardContent>
      </Card>
      <DeleteConfirmationDialog
        isOpen={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        onConfirm={handleRemoveConfirm}
        title={`'${adminToRemove?.displayName || adminToRemove?.email}' yönetici yetkilerini kaldırmak istediğinizden emin misiniz?`}
        description="Bu işlem kullanıcıyı sistemden silmez, sadece yönetici yetkilerini kaldırır. Bu işlem geri alınamaz."
        confirmText="Evet, Yetkilerini Kaldır"
      />
      <PermissionsDialog
        isOpen={isPermissionsDialogOpen}
        onOpenChange={setIsPermissionsDialogOpen}
        admin={selectedAdmin}
        onPermissionsChange={handlePermissionsChange}
      />
    </>
  )
}
