
"use client"
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Home,
  ChevronRight,
  Share2,
  Heart,
  MessageSquare,
  Tag,
  Eye
} from "lucide-react";
import type { Post } from "@/lib/posts";
import { getPostBySlug, incrementPostView, getCommentCount, toggleLikePost } from "@/lib/firebase/services";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { ReadingProgressBar } from "@/components/reading-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import styles from "@/app/page.module.css";
import { motion } from "framer-motion";
import { CommentSection } from "@/components/comment-section";

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { toast } = useToast();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);


  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      setLoading(true);
      const fetchedPost = await getPostBySlug(slug);

      if (fetchedPost) {
        setPost(fetchedPost);

        // Unique view logic using sessionStorage
        if (typeof window !== 'undefined') {
          const viewedKey = `viewed-${fetchedPost.id}`;
          const hasViewed = sessionStorage.getItem(viewedKey);

          if (!hasViewed) {
              const newViewCount = await incrementPostView(fetchedPost.id);
              if (newViewCount !== null) {
                setViewCount(newViewCount);
              } else {
                setViewCount(fetchedPost.views || 0);
              }
              sessionStorage.setItem(viewedKey, 'true');
          } else {
              setViewCount(fetchedPost.views || 0);
          }
        } else {
            setViewCount(fetchedPost.views || 0);
        }
        
        // Fetch counts
        const comments = await getCommentCount(fetchedPost.id);
        
        setCommentCount(comments);
        setLikeCount(fetchedPost.likes || 0);

        // Check if liked from localStorage
        if (typeof window !== 'undefined') {
          const isLiked = localStorage.getItem(`liked-${fetchedPost.id}`) === 'true';
          setLiked(isLiked);
        }

      } else {
        notFound();
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  const handleLikeToggle = async () => {
    if (!post) return;
    const newLikedState = !liked;
    
    // Optimistic UI update
    setLiked(newLikedState);
    setLikeCount(current => current + (newLikedState ? 1 : -1));

    if (typeof window !== 'undefined') {
        localStorage.setItem(`liked-${post.id}`, String(newLikedState));
    }

    toast({
        title: newLikedState ? "Yazıyı beğendiniz!" : "Beğeni geri çekildi",
    });

    // Sync with server
    const serverLikeCount = await toggleLikePost(post.id, newLikedState);
    if (serverLikeCount !== null) {
        setLikeCount(serverLikeCount);
    } else {
        // Revert UI on error
        setLiked(!newLikedState);
        setLikeCount(current => current + (!newLikedState ? 1 : -1));
        if (typeof window !== 'undefined') {
            localStorage.setItem(`liked-${post.id}`, String(!newLikedState));
        }
         toast({
            title: "Hata!",
            description: "Beğeni durumu güncellenemedi.",
            variant: "destructive"
        });
    }
  };

  const handleShare = async () => {
    if (!post) return;
    const url = window.location.href;
    const shareData = {
        title: post.title,
        url: url,
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            throw new Error("Share API not supported");
        }
    } catch (error) {
        navigator.clipboard.writeText(url);
        toast({
            title: "Link panoya kopyalandı!",
            description: "Bu içeriği arkadaşlarınla kolayca paylaşabilirsin.",
        });
    }
  };


  if (loading) {
    return (
        <>
            <Header />
            <div className="container mx-auto max-w-6xl px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
                     <div className="lg:col-span-8">
                        <Skeleton className="h-8 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-1/2 mb-8" />
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                             <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-5/6" />
                        </div>
                     </div>
                      <aside className="lg:col-span-4 space-y-6">
                        <Skeleton className="h-40 w-full rounded-xl" />
                        <Skeleton className="h-24 w-full rounded-xl" />
                      </aside>
                </div>
            </div>

        </>
    )
  }

  if (!post) {
    return notFound();
  }

  const categorySlug = post.category.toLowerCase().replace(/ /g, '-').replace('i̇', 'i');

  return (
    <>
      <ReadingProgressBar />
      <Header />
      <div className="bg-background text-foreground">
        {/* Header Image */}
        <div className="relative h-72 md:h-96 w-full">
            {post.image ? (
                <>
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${post.image})` }}
                        data-ai-hint="post image"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                </>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/50" />
            )}
        </div>
        
        <div className="container mx-auto -mt-24 md:-mt-32 relative z-20 px-4">
            {/* Breadcrumb */}
            <nav className="py-6 text-sm text-white/80">
              <ol className="list-none p-0 inline-flex items-center">
                <li className="flex items-center">
                  <Link href="/" className="hover:text-primary">
                    <Home className="h-4 w-4" />
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-1" />
                </li>
                 <li className="flex items-center">
                  <Link href={`/${categorySlug}`} className="hover:text-primary">
                    {post.category}
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-1" />
                </li>
                <li className="truncate" style={{ maxWidth: "300px" }}>
                  <span className="font-semibold text-white">{post.title}</span>
                </li>
              </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
                <motion.main
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="lg:col-span-8"
                >
                     <Card className="shadow-2xl overflow-hidden">
                        <CardContent className="p-6 md:p-8">
                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-primary">
                                {post.title}
                            </h1>

                             {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-6 pb-6 border-b">
                                <span className="flex items-center gap-1.5"><Clock size={14} />{post.readTime} dakika okuma</span>
                                <span className="flex items-center gap-1.5"><Tag size={14} />{post.category}</span>
                            </div>

                            {/* Article Content */}
                             <article
                                className={`prose prose-lg dark:prose-invert max-w-none ${styles.articleContent}`}
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </CardContent>
                     </Card>

                     <CommentSection postId={post.id} />
                </motion.main>

                 {/* Sidebar */}
                <motion.aside
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="lg:col-span-4 lg:sticky top-24 h-fit"
                >
                    <div className="space-y-6">
                        <Card className="shadow-xl">
                            <CardHeader>
                                <h3 className="font-semibold text-lg">Yazar</h3>
                            </CardHeader>
                            <CardContent className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-2 border-primary">
                                     <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>NY</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-lg">Nurunyolu Ekibi</p>
                                    <p className="text-sm text-muted-foreground">İçerik Editörleri</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-xl">
                            <CardHeader>
                                <h3 className="font-semibold text-lg">Etkileşim</h3>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <div className="flex justify-around text-center">
                                   <div>
                                       <p className="text-2xl font-bold">{viewCount}</p>
                                       <p className="text-sm text-muted-foreground flex items-center gap-1"><Eye size={14}/>Görüntülenme</p>
                                   </div>
                                   <div>
                                       <p className="text-2xl font-bold">{commentCount}</p>
                                       <p className="text-sm text-muted-foreground flex items-center gap-1"><MessageSquare size={14}/>Yorum</p>
                                   </div>
                                   <div>
                                       <p className="text-2xl font-bold">{likeCount}</p>
                                       <p className="text-sm text-muted-foreground flex items-center gap-1"><Heart size={14}/>Beğeni</p>
                                   </div>
                               </div>
                               <div className="flex gap-2 pt-4 border-t">
                                    <Button className="w-full group" onClick={handleLikeToggle} variant={liked ? "default" : "outline"}>
                                        <Heart className={`mr-2 h-4 w-4 ${liked ? "fill-current" : ""}`} /> {liked ? "Beğenildi" : "Beğen"}
                                    </Button>
                                     <Button className="w-full" variant="outline" onClick={handleShare}>
                                        <Share2 className="mr-2 h-4 w-4" /> Paylaş
                                    </Button>
                               </div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.aside>

            </div>
        </div>

         <footer className="text-center py-16 mt-12 text-sm text-muted-foreground border-t">
            <p>&copy; {new Date().getFullYear()} Nurunyolu. Tüm hakları saklıdır.</p>
        </footer>
      </div>
    </>
  );
}
