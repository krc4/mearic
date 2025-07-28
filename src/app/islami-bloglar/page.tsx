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
} from "lucide-react";
import type { Post } from "@/lib/posts";
import { getPostsByCategory } from "@/lib/firebase/services";
import { ReadingProgressBar } from "@/components/reading-progress-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function IslamiBloglarPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<"trending" | "latest">("trending");
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const fetchedPosts = await getPostsByCategory("İslami Bloglar");
      const sortedByDate = [...fetchedPosts].sort((a, b) => {
        const dateA = a.createdAt?.toDate() || 0;
        const dateB = b.createdAt?.toDate() || 0;
        return dateB.getTime() - dateA.getTime();
      });
      setPosts(sortedByDate);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const sortedPosts = useMemo(() => {
    if (loading) return [];
    return [...posts].sort((a, b) => {
      if (filter === "latest") {
        const dateA = a.createdAt?.toDate() || 0;
        const dateB = b.createdAt?.toDate() || 0;
        return dateB.getTime() - dateA.getTime();
      }
      return (b.views || 0) - (a.views || 0);
    });
  }, [filter, posts, loading]);

  const toggleViewed = (id: string) =>
    setViewed((v) => new Set(v).add(id));

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
      <ReadingProgressBar />
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <section className="relative isolate flex items-center justify-center overflow-hidden py-24 md:py-36">
           <div
            className="absolute inset-0 -z-10 scale-125"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1517148815978-75f6acaaf32c?q=80&w=2070&auto=format&fit=crop)`,
              backgroundAttachment: "fixed",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(.4)",
            }}
            data-ai-hint="islamic knowledge"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-black/50 to-black/80" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              İslami Bloglar
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-white/80">
                İslam'ı anlama ve yaşama yolculuğunuzda size rehber olacak yazılar.
            </p>
          </motion.div>
        </section>

        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">Anasayfa</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">İslami Bloglar</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={filter === "trending" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("trending")}
              >
                <Eye className="mr-1.5 h-4 w-4" />
                Popüler
              </Button>
              <Button
                variant={filter === "latest" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("latest")}
              >
                <Filter className="mr-1.5 h-4 w-4" />
                Yeni
              </Button>
            </div>
          </div>
        </div>

        <main className="container mx-auto flex-grow px-4 pb-20">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
               {loading ? (
                 Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group relative aspect-[3/4] overflow-hidden rounded-3xl border border-border/30 bg-background/60 p-6 shadow-xl"
                    >
                        <Skeleton className="w-full h-full rounded-2xl"/>
                    </motion.div>
                 ))
              ) : (
                sortedPosts.map((post) => (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative aspect-[3/4] overflow-hidden rounded-3xl border border-border/30 bg-background/60 shadow-xl backdrop-blur-md hover:shadow-2xl hover:shadow-primary/20 dark:bg-background/30 dark:hover:shadow-primary/20"
                >
                  <div
                    style={{ backgroundImage: `url(${post.image || 'https://placehold.co/600x800.png'})` }}
                    className={`absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-110 ${viewed.has(post.id) ? "grayscale" : ""}`}
                    data-ai-hint="islamic blog"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
                    {post.category}
                  </Badge>

                  <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-white hover:bg-white/20 hover:text-white"
                        onClick={() => toast({ title: "Favorilere eklendi!"})}
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-white hover:bg-white/20 hover:text-white"
                        onClick={() => handleShare(post.title, post.slug)}
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>

                  <div className="relative z-10 flex flex-col justify-end p-6 h-full">
                    <div className="mt-auto">
                      <h3 className="text-xl font-bold text-white leading-tight">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/80 line-clamp-2">
                        {post.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-white/70">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime} dk
                      </span>
                      <Button
                        asChild
                        size="sm"
                        onClick={() => toggleViewed(post.id)}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-sm ring-1 ring-white/20 hover:bg-white/20"
                      >
                        <Link href={`/posts/${post.slug}`}>
                          Oku
                          <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))
            )}
            </AnimatePresence>
          </motion.div>
        </main>

        <footer className="container mx-auto mt-12 py-8 px-4 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Nurunyolu. Tüm hakları saklıdır.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
              <Link href="#" className="hover:text-primary transition-colors">Hakkımızda</Link>
              <Link href="#" className="hover:text-primary transition-colors">İletişim</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
