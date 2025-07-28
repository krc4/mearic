
"use client"

import { useState, useEffect, FormEvent } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, Send, MoreVertical, ShieldCheck, Trash2 } from "lucide-react"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
import { addComment, getCommentsForPost, isAdmin, deleteComment, CommentPayload } from "@/lib/firebase/services"
import type { Comment } from "@/lib/comments"
import { Skeleton } from "./ui/skeleton"
import Link from "next/link"
import { Badge } from "./ui/badge"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog"


const CommentItem = ({ comment, isAdmin, onDeleteClick }: { comment: Comment, isAdmin: boolean, onDeleteClick: (commentId: string) => void }) => (
    <Card className={cn(
        "bg-card/50 transition-all duration-300", 
        comment.isAdmin && "border-primary/50 bg-primary/5 shadow-[0_0_15px_-5px_hsl(var(--primary)/0.3)]"
    )}>
        <CardContent className="p-5 flex items-start gap-4">
            <Avatar className={cn(comment.isAdmin && "border-2 border-primary")}>
                <AvatarImage src={comment.photoURL || `https://api.dicebear.com/7.x/thumbs/svg?seed=${comment.userId}`} alt={comment.username} />
                <AvatarFallback>{comment.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold">{comment.username}</p>
                        {comment.isAdmin && (
                            <Badge variant="default" className="flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3"/>
                                Yönetici
                            </Badge>
                        )}
                    </div>
                     {isAdmin && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                 <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4"/></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => onDeleteClick(comment.id)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Yorumu Sil
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
                 <p className="text-xs text-muted-foreground">
                    {comment.createdAt ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString() : 'Şimdi'}
                </p>
                <p className="mt-3 text-foreground/90">{comment.text}</p>
            </div>
        </CardContent>
    </Card>
);

const CommentSkeleton = () => (
    <div className="p-5 flex items-start gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
        </div>
    </div>
);


export function CommentSection({ postId }: { postId: string }) {
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const adminStatus = await isAdmin(currentUser.uid);
                setIsCurrentUserAdmin(adminStatus);
            } else {
                setIsCurrentUserAdmin(false);
            }
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!postId) return;

        const fetchComments = async () => {
            setCommentsLoading(true);
            const fetchedComments = await getCommentsForPost(postId);
            setComments(fetchedComments);
            setCommentsLoading(false);
        }
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user || !newComment.trim()) {
            toast({
                title: "Hata",
                description: !user ? "Yorum yapmak için giriş yapmalısınız." : "Lütfen yorumunuzu girin.",
                variant: "destructive"
            });
            return;
        }

        const commentData: CommentPayload = {
            postId,
            userId: user.uid,
            username: user.displayName || "Anonim",
            photoURL: user.photoURL || "",
            text: newComment,
            isAdmin: isCurrentUserAdmin, 
        };

        const newCommentDoc = await addComment(commentData);
        if (newCommentDoc) {
            // Add comment to UI instantly with correct admin status
            setComments(prev => [newCommentDoc, ...prev]);
            setNewComment("");
            toast({
                title: "Yorumunuz için teşekkürler!",
                description: "Yorumunuz başarıyla gönderildi.",
            });
        } else {
             toast({
                title: "Hata",
                description: "Yorumunuz gönderilirken bir sorun oluştu.",
                variant: "destructive"
            });
        }
    }

    const handleDeleteClick = (commentId: string) => {
        setCommentToDelete(commentId);
        setIsAlertOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!commentToDelete || !postId) return;
        
        const success = await deleteComment(postId, commentToDelete);
        if (success) {
            setComments(comments.filter(c => c.id !== commentToDelete));
            toast({ title: "Başarılı!", description: "Yorum başarıyla silindi." });
        } else {
            toast({ title: "Hata!", description: "Yorum silinirken bir sorun oluştu.", variant: "destructive" });
        }
        setCommentToDelete(null);
        setIsAlertOpen(false);
    }
    
    return (
        <section className="w-full py-12">
            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <MessageCircle className="w-8 h-8 text-primary" />
                    <h2 className="text-3xl font-bold tracking-tight">
                        Yorumlar ({commentsLoading ? '...' : comments.length})
                    </h2>
                </div>

                <Card className="shadow-lg border-border/30">
                    <form onSubmit={handleSubmit}>
                        <CardHeader className="flex flex-row items-start gap-4 p-4">
                            <Avatar>
                                <AvatarImage src={user?.photoURL || `https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.uid || 'default'}`} />
                                <AvatarFallback>{user?.displayName?.charAt(0) || 'Y'}</AvatarFallback>
                            </Avatar>
                            <div className="w-full space-y-2">
                                <Textarea
                                    name="comment"
                                    placeholder={user ? "Düşüncelerinizi paylaşın..." : "Yorum yapmak için giriş yapmalısınız."}
                                    className="min-h-[100px] resize-y"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    disabled={!user || authLoading}
                                />
                            </div>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0 flex justify-between items-center">
                            {!user && !authLoading ? (
                                <p className="text-sm text-muted-foreground">
                                    <Link href="/giris" className="text-primary hover:underline">Giriş yap</Link> veya <Link href="/kayit" className="text-primary hover:underline">kayıt ol</Link>.
                                </p>
                            ) : <div/>}
                            <Button type="submit" disabled={!user || authLoading || !newComment.trim()}>
                                <Send className="mr-2 h-4 w-4" />
                                Yorum Yap
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <div className="space-y-6">
                     {commentsLoading ? (
                        <>
                            <CommentSkeleton />
                            <CommentSkeleton />
                        </>
                    ) : comments.length > 0 ? (
                        comments.map((comment) => (
                           <CommentItem 
                                key={comment.id} 
                                comment={comment} 
                                isAdmin={isCurrentUserAdmin} 
                                onDeleteClick={handleDeleteClick}
                            />
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground py-8">
                            Henüz yorum yapılmamış. İlk yorumu siz yapın!
                        </p>
                    )}
                </div>
            </div>
             <DeleteConfirmationDialog
                isOpen={isAlertOpen}
                onOpenChange={setIsAlertOpen}
                onConfirm={handleDeleteConfirm}
                title="Yorumu Silmek İstediğinizden Emin misiniz?"
                description="Bu işlem geri alınamaz. Yorum kalıcı olarak silinecektir."
                confirmText="Evet, Sil"
            />
        </section>
    )
}
