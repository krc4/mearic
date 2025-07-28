
"use client"

import { useState, useEffect, FormEvent } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, Send, MoreVertical, ShieldCheck, Trash2, Star } from "lucide-react"
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
import { motion } from "framer-motion"


const CommentItem = ({ comment, isAdmin, onDeleteClick }: { comment: Comment, isAdmin: boolean, onDeleteClick: (commentId: string) => void }) => (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className="relative"
    >
      <Card className={cn(
        "border-2 border-transparent bg-gradient-to-br from-card/80 to-card/60 shadow-lg backdrop-blur-sm transition-all duration-300",
        comment.isAdmin && "border-amber-400/50 bg-gradient-to-br from-amber-500/10 to-card/70 shadow-[0_0_25px_-5px_hsl(var(--primary)/0.5)] shadow-amber-400/30"
      )}>
        <CardContent className="p-5 flex items-start gap-4">
          <Avatar className={cn(
            "border-2 border-transparent",
            comment.isAdmin && "border-amber-400 ring-2 ring-amber-400/50"
          )}>
            <AvatarImage src={comment.photoURL || `https://api.dicebear.com/7.x/thumbs/svg?seed=${comment.userId}`} />
            <AvatarFallback>{comment.username.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="font-bold text-foreground">{comment.username}</p>
                {comment.isAdmin && (
                  <Badge variant="default" className="bg-amber-400 text-amber-950 text-xs font-bold hover:bg-amber-400/90">
                    <ShieldCheck size={12} className="mr-1" /> Yönetici
                  </Badge>
                )}
              </div>
              {isAdmin && (
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background border-border">
                    <DropdownMenuItem onClick={() => onDeleteClick(comment.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                      <Trash2 size={14} className="mr-2" /> Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              {comment.createdAt ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString() : 'Şimdi'}
            </p>

            <p className="mt-3 text-sm text-foreground/90 leading-relaxed">
              {comment.text}
            </p>

            {comment.isAdmin && (
              <div className="mt-3 flex items-center gap-1 text-xs text-amber-400">
                <Star size={12} className="fill-amber-400" />
                <span>Yönetici yorumu</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
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

interface CommentSectionProps {
    postId: string;
    onCommentCountChange: (count: number) => void;
}

export function CommentSection({ postId, onCommentCountChange }: CommentSectionProps) {
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
            onCommentCountChange(fetchedComments.length);
            setCommentsLoading(false);
        }
        fetchComments();
    }, [postId, onCommentCountChange]);

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
            setComments(prev => {
                const newComments = [newCommentDoc, ...prev];
                onCommentCountChange(newComments.length);
                return newComments;
            });
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
            setComments(prev => {
                const newComments = prev.filter(c => c.id !== commentToDelete);
                onCommentCountChange(newComments.length);
                return newComments;
            });
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
