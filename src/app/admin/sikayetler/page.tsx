
"use client"
import React, { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import {
  ShieldAlert,
  MoreHorizontal,
  Trash2,
  Search,
  EyeOff,
  Eye
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog"
import { useToast } from "@/hooks/use-toast"
import {
  getAllReportedComments,
  deleteComment,
  unreportComment,
  getPostTitle,
  CommentWithPostInfo
} from "@/lib/firebase/services"

const ReportedCommentTable = ({
  comments,
  onDeleteClick,
  onDismissClick,
}: {
  comments: CommentWithPostInfo[],
  onDeleteClick: (comment: CommentWithPostInfo) => void,
  onDismissClick: (comment: CommentWithPostInfo) => void,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kullanıcı</TableHead>
          <TableHead>Yorum</TableHead>
          <TableHead className="hidden md:table-cell">Yazı</TableHead>
          <TableHead className="hidden md:table-cell">Tarih</TableHead>
          <TableHead>
            <span className="sr-only">İşlemler</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {comments.map((comment) => (
          <TableRow key={comment.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={comment.photoURL || `https://api.dicebear.com/7.x/thumbs/svg?seed=${comment.userId}`} alt={comment.username} />
                  <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="font-medium">{comment.username}</div>
              </div>
            </TableCell>
             <TableCell className="max-w-xs truncate">{comment.text}</TableCell>
             <TableCell className="hidden md:table-cell">
                <Link href={`/posts/${comment.postSlug}`} className="hover:underline text-blue-500" target="_blank">
                    {comment.postTitle}
                </Link>
             </TableCell>
            <TableCell className="hidden md:table-cell">
              {new Date(comment.createdAt.seconds * 1000).toLocaleDateString('tr-TR')}
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
                  <DropdownMenuItem onClick={() => onDismissClick(comment)}>
                     <EyeOff className="mr-2 h-4 w-4" />
                    Şikayeti Geri Çek
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteClick(comment)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Yorumu Sil
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

export default function SikayetlerAdminPage() {
  const [allComments, setAllComments] = useState<CommentWithPostInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [commentToDelete, setCommentToDelete] = useState<CommentWithPostInfo | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();

   const fetchComments = async () => {
    setLoading(true);
    const fetchedComments = await getAllReportedComments();
    setAllComments(fetchedComments);
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);
  
  const filteredComments = useMemo(() => {
    if (!searchTerm) return allComments;
    return allComments.filter(comment => 
      comment.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allComments, searchTerm]);

  const handleDeleteClick = (comment: CommentWithPostInfo) => {
    setCommentToDelete(comment);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;
    const success = await deleteComment(commentToDelete.postId, commentToDelete.id);
    if (success) {
      setAllComments(prev => prev.filter(c => c.id !== commentToDelete.id));
      toast({ title: "Başarılı!", description: "Yorum kalıcı olarak silindi." });
    } else {
      toast({ title: "Hata!", description: "Yorum silinirken bir sorun oluştu.", variant: "destructive" });
    }
    setCommentToDelete(null);
    setIsAlertOpen(false);
  };
  
  const handleDismissClick = async (comment: CommentWithPostInfo) => {
      const success = await unreportComment(comment.postId, comment.id);
      if (success) {
          setAllComments(prev => prev.filter(c => c.id !== comment.id));
          toast({ title: "Başarılı!", description: "Yorumun şikayeti geri çekildi." });
      } else {
          toast({ title: "Hata!", description: "İşlem sırasında bir sorun oluştu.", variant: "destructive" });
      }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldAlert className="h-6 w-6" />
          Şikayet Yönetimi
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Şikayet Edilen Yorumlar</CardTitle>
          <CardDescription>
            Kullanıcılar tarafından şikayet edilen yorumları yönetin. Toplam {filteredComments.length} şikayet bulundu.
          </CardDescription>
          <div className="relative pt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Yorum metni veya kullanıcı adı ile ara..."
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
            <ReportedCommentTable 
                comments={filteredComments} 
                onDeleteClick={handleDeleteClick} 
                onDismissClick={handleDismissClick}
            />
          )}
        </CardContent>
         {filteredComments.length === 0 && !loading && (
            <CardFooter className="justify-center">
                <p className="text-muted-foreground">Gösterilecek şikayet edilmiş yorum bulunamadı.</p>
            </CardFooter>
        )}
      </Card>
       <DeleteConfirmationDialog
        isOpen={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        onConfirm={handleDeleteConfirm}
        title={`'${commentToDelete?.username}' kullanıcısının yorumunu silmek istediğinizden emin misiniz?`}
        description="Bu işlem geri alınamaz. Yorum kalıcı olarak silinecektir."
        confirmText="Evet, Yorumu Sil"
      />
    </>
  );
}
