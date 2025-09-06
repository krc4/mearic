
"use client";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  ArrowUpRight,
  Heart,
  Share2,
  Filter,
  Eye,
  ChevronRight,
  Search,
} from "lucide-react";
import type { Post } from "@/lib/posts";
import { toggleLikePost } from "@/lib/firebase/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

interface CategoryClientPageProps {
    initialPosts: Post[];
    pageTitle: string;
    pageDescription: string;
    headerImage: string;
    headerImageHint: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};


export function CategoryClientPage({ 
  initialPosts, 
  pageTitle,
  pageDescription,
  headerImage,
  headerImageHint
}: CategoryClientPageProps) {
  const { toast } = useToast();
  const [filter, setFilter] = useState<"trending" | "latest">("trending");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Set posts from server props
    const sortedByDate = [...initialPosts].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt as string).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt as string).getTime() : 0;
      return dateB - dateA;
    });
    setPosts(sortedByDate);

    // Load liked posts from local storage on client
    if (typeof window !== 'undefined') {
      const liked = new Set<string>();
      sortedByDate.forEach(post => {
          if(localStorage.getItem(`liked-${post.id}`) === 'true') {
              liked.add(post.id);
          }
      });
      setLikedPosts(liked);
    }
  }, [initialPosts]);

  const sortedPosts = useMemo(() => {
    if (loading) return [];
    
    const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      if (filter === "latest") {
        const dateA = a.createdAt ? new Date(a.createdAt as string).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt as string).getTime() : 0;
        return dateB - dateA;
      }
      return (b.views || 0) - (a.views || 0);
    });
  }, [filter, posts, loading, searchTerm]);
  
  const handleLikeToggle = async (postId: string) => {
    const newLikedState = !likedPosts.has(postId);
    
    setLikedPosts(currentLiked => {
        const newSet = new Set(currentLiked);
        if (newLikedState) {
            newSet.add(postId);
        } else {
            newSet.delete(postId);
        }
        return newSet;
    });

    if (typeof window !== 'undefined') {
        localStorage.setItem(`liked-${postId}`, String(newLikedState));
    }

    toast({
        title: newLikedState ? "Yazıyı beğendiniz!" : "Beğeni geri çekildi",
    });

    const serverLikeCount = await toggleLikePost(postId, newLikedState);

    if (serverLikeCount === null) {
        setLikedPosts(currentLiked => {
            const newSet = new Set(currentLiked);
            if (newLikedState) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
        if (typeof window !== 'undefined') {
            localStorage.setItem(`liked-${postId}`, String(!newLikedState));
        }
        toast({
            title: "Hata!",
            description: "Beğeni durumu güncellenemedi.",
            variant: "destructive"
        });
    }
  };

  const handleShare = async (postTitle: string, postSlug: string) => {
    const url = `${window.location.origin}/posts/${postSlug}`;
    if (navigator.share) {
        try {
            await navigator.share({ title: postTitle, url });
        } catch (error) {
            console.error('Error sharing:', error);
            navigator.clipboard.writeText(url);
            toast({ title: "Link panoya kopyalandı!" });
        }
    } else {
        navigator.clipboard.writeText(url);
        toast({ title: "Link panoya kopyalandı!" });
    }
  }

  return (
    <>
       <section className="relative isolate flex items-center justify-center overflow-hidden py-24 md:py-36">
           <div
            className="absolute inset-0 -z-10 scale-125"
            style={{
              backgroundImage: `url(${headerImage})`,
              backgroundAttachment: "fixed",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(.4)",
            }}
            data-ai-hint={headerImageHint}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-black/50 to-black/80" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              {pageTitle}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-white/80">
              {pageDescription}
            </p>
          </motion.div>
        </section>

        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground self-start">
              <Link href="/" className="hover:text-primary">Anasayfa</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{pageTitle}</span>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
               <div className="relative w-full md:w-auto flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Yazılarda ara..."
                        className="pl-9 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
              <Button
                variant={filter === "trending" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("trending")}
              >
                <Eye className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">Popüler</span>
              </Button>
              <Button
                variant={filter === "latest" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("latest")}
              >
                <Filter className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">Yeni</span>
              </Button>
            </div>
          </div>
        </div>

        <main className="container mx-auto flex-grow px-4 pb-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            <AnimatePresence>
               {loading ? (
                 Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className="group relative aspect-[3/4] overflow-hidden rounded-3xl"
                    >
                      <Skeleton className="w-full h-full rounded-2xl"/>
                    </motion.div>
                 ))
              ) : (
                sortedPosts.map((post) => (
                    <motion.article
                        key={post.id}
                        variants={itemVariants}
                        className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${post.image || 'https://placehold.co/600x800.png'})` }}
                            data-ai-hint="hadith miracle"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        <div className="absolute inset-0 rounded-3xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm bg-white/5" />

                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <Badge variant="secondary" className="mb-2">
                                {post.category}
                            </Badge>
                            <h3 className="text-2xl font-bold text-white leading-tight">
                                {post.title}
                            </h3>
                            <p className="mt-2 text-sm text-white/80 line-clamp-2">
                                {post.description}
                            </p>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-xs text-white/60 flex items-center gap-1">
                                    <Clock size={14} /> {post.readTime} dk
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button
                                      asChild
                                      size="sm"
                                      variant="ghost"
                                      className="rounded-full text-white bg-white/5 hover:bg-white/20 backdrop-blur-sm opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                                    >
                                      <Link href={`/posts/${post.slug}`}>
                                        Oku <ArrowUpRight className="h-4 w-4 ml-1" />
                                      </Link>
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="text-white hover:bg-white/10 rounded-full"
                                      onClick={() => handleLikeToggle(post.id)}
                                    >
                                      <motion.div
                                        animate={
                                          likedPosts.has(post.id)
                                            ? { scale: [1, 1.4, 1] }
                                            : { scale: 1 }
                                        }
                                      >
                                        <Heart
                                          className={`h-5 w-5 ${likedPosts.has(post.id) ? "text-red-500 fill-current" : ""}`}
                                        />
                                      </motion.div>
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="text-white hover:bg-white/10 rounded-full"
                                      onClick={() => handleShare(post.title, post.slug)}
                                    >
                                      <Share2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.article>
              ))
            )}
            </AnimatePresence>
          </motion.div>
        </main>
    </>
  );
}
