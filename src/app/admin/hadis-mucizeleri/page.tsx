
"use client"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import {
  Sparkles,
  PlusCircle,
  MoreHorizontal,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Post } from "@/lib/posts"
import { getPostsByCategory, deletePost } from "@/lib/firebase/services"
import { Skeleton } from "@/components/ui/skeleton"
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog"
import { useToast } from "@/hooks/use-toast"


const PostTable = ({ posts, loading, onDeleteClick }: { posts: Post[], loading: boolean, onDeleteClick: (postId: string) => void }) => {
  if (loading) {
    return (
        <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
    )
  }
  
  return (
    <Table>
    <TableHeader>
        <TableRow>
        <TableHead>Başlık</TableHead>
        <TableHead className="hidden md:table-cell">Durum</TableHead>
        <TableHead className="hidden md:table-cell">Tarih</TableHead>
        <TableHead>
            <span className="sr-only">İşlemler</span>
        </TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        {posts.map((post) => (
        <TableRow key={post.id}>
            <TableCell className="font-medium">{post.title}</TableCell>
            <TableCell className="hidden md:table-cell">
            <Badge variant="outline">Yayında</Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
                {post.createdAt ? new Date(post.createdAt as string).toLocaleDateString('tr-TR') : 'Tarih yok'}
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
                <DropdownMenuItem asChild>
                    <Link href={`/admin/yazilar/${post.slug}/duzenle`}>Düzenle</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDeleteClick(post.id)}>Sil</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </TableCell>
        </TableRow>
        ))}
    </TableBody>
    </Table>
  );
}


export default function HadisMucizeleriAdminPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            const fetchedPosts = await getPostsByCategory("Hadis Mucizeleri");
            const sortedPosts = fetchedPosts.sort((a, b) => {
                 const dateA = a.createdAt ? new Date(a.createdAt as string).getTime() : 0;
                 const dateB = b.createdAt ? new Date(b.createdAt as string).getTime() : 0;
                 return dateB - dateA;
            });
            setPosts(sortedPosts);
            setLoading(false);
        };
        fetchPosts();
    }, []);

    const handleDeleteClick = (postId: string) => {
        setPostToDelete(postId);
        setIsAlertOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (postToDelete) {
            const success = await deletePost(postToDelete);
            if (success) {
                setPosts(posts.filter(p => p.id !== postToDelete));
                toast({ title: "Başarılı!", description: "Yazı başarıyla silindi." });
            } else {
                 toast({ title: "Hata!", description: "Yazı silinirken bir sorun oluştu.", variant: "destructive" });
            }
            setPostToDelete(null);
        }
        setIsAlertOpen(false);
    };


  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          Hadis Mucizeleri
        </h1>
        <Button asChild>
          <Link href="/admin/yazilar/yeni">
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Yazı Ekle
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hadis Mucizeleri Yazıları</CardTitle>
          <CardDescription>
            Bu kategorideki yazıları yönetin.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <PostTable posts={posts} loading={loading} onDeleteClick={handleDeleteClick}/>
        </CardContent>
      </Card>
      <DeleteConfirmationDialog
        isOpen={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
