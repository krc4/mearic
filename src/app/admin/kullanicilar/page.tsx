
"use client"

import React, { useEffect, useState, useMemo } from 'react';
import {
  Users,
  MoreHorizontal,
  Trash2,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import type { SiteUser } from '@/lib/users';
import { getUsers, deleteUserByAdmin } from '@/lib/firebase/services';

const UserTable = ({ users, onDeleteClick }: { users: SiteUser[]; onDeleteClick: (user: SiteUser) => void }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kullanıcı</TableHead>
          <TableHead className="hidden md:table-cell">E-posta</TableHead>
          <TableHead className="hidden md:table-cell">Kayıt Tarihi</TableHead>
          <TableHead>
            <span className="sr-only">İşlemler</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.uid}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.photoURL || `https://api.dicebear.com/7.x/thumbs/svg?seed=${user.uid}`} alt={user.displayName || 'Kullanıcı'} />
                  <AvatarFallback>{user.displayName ? user.displayName.substring(0, 2).toUpperCase() : user.email.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="font-medium">{user.displayName || 'İsimsiz'}</div>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">{user.email}</TableCell>
            <TableCell className="hidden md:table-cell">
              {new Date(user.createdAt as string).toLocaleDateString('tr-TR')}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Menüyü aç</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onDeleteClick(user)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Kullanıcıyı Sil
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default function KullanicilarAdminPage() {
  const [allUsers, setAllUsers] = useState<SiteUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState<SiteUser | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      // Fetch a large number to get all users for the admin page
      const { users } = await getUsers(1000); 
      const sortedUsers = users.sort((a, b) => 
        new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
      );
      setAllUsers(sortedUsers);
      setLoading(false);
    };
    fetchAllUsers();
  }, []);
  
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return allUsers;
    return allUsers.filter(user => 
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allUsers, searchTerm]);

  const handleDeleteClick = (user: SiteUser) => {
    setUserToDelete(user);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    const { success, message } = await deleteUserByAdmin(userToDelete.uid);
    if (success) {
      setAllUsers(prev => prev.filter(u => u.uid !== userToDelete.uid));
      toast({ title: "Başarılı!", description: message });
    } else {
      toast({ title: "Hata!", description: message, variant: "destructive" });
    }
    setUserToDelete(null);
    setIsAlertOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Kullanıcı Yönetimi
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tüm Kullanıcılar</CardTitle>
          <CardDescription>
            Sisteme kayıtlı tüm kullanıcıları yönetin. Toplam {filteredUsers.length} kullanıcı bulundu.
          </CardDescription>
          <div className="relative pt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Kullanıcı adı veya e-posta ile ara..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <UserTable users={filteredUsers} onDeleteClick={handleDeleteClick} />
          )}
        </CardContent>
         {allUsers.length === 0 && !loading && (
            <CardFooter className="justify-center">
                <p className="text-muted-foreground">Sistemde hiç kullanıcı bulunamadı.</p>
            </CardFooter>
        )}
      </Card>
       <DeleteConfirmationDialog
        isOpen={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        onConfirm={handleDeleteConfirm}
        title={`'${userToDelete?.displayName || userToDelete?.email}' kullanıcısını silmek istediğinizden emin misiniz?`}
        description="Bu işlem geri alınamaz. Kullanıcının tüm verileri (yorumlar vb.) kalıcı olarak silinecektir. Bu işlem kullanıcıyı Firebase Authentication'dan silmez, bunun için bir cloud fonksiyonu gereklidir."
        confirmText="Evet, Kullanıcıyı Sil"
      />
    </>
  );
}
