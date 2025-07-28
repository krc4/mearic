
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

export default function KuranMucizeleriPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<"trending" | "latest">("trending");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [favs, setFavs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const fetchedPosts = await getPostsByCategory("Kuran Mucizeleri");
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

  const toggleFav = (id: string) => {
    const isAlreadyFaved = favs.has(id);
    setFavs(currentFavs => {
      const newFavs = new Set(currentFavs);
      if (newFavs.has(id)) {
        newFavs.delete(id);
      } else {
        newFavs.add(id);
      }
      return newFavs;
    });
    if (isAlreadyFaved) {
        toast({ title: "Beğeni geri çekildi" });
    } else {
        toast({ title: "Gönderi beğenildi!" });
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
      <ReadingProgressBar />
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <section className="relative isolate flex items-center justify-center overflow-hidden py-24 md:py-36">
            <div
              className="absolute inset-0 -z-10 scale-125"
              style={{
                backgroundImage: `url(https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop)`,
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(.4)",
              }}
              data-ai-hint="quran universe"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-black/50 to-black/80" />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center text-white"
            >
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                Kuran Mucizeleri
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-white/80">
                1400 yıl önce bildirilmiş bilimsel, sayısal ve edebi mucizeleri
                keşfet.
              </p>
            </motion.div>
        </section>
        
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">Anasayfa</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Kuran Mucizeleri</span>
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            <AnimatePresence>
              {loading ? (
                 Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group relative aspect-[3/4] overflow-hidden rounded-3xl"
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
                        className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
                        whileHover={{ scale: 1.03 }}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${post.image || 'https://placehold.co/600x800.png'})` }}
                            data-ai-hint="quran miracle"
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
                                      onClick={() => toggleFav(post.id)}
                                    >
                                      <motion.div
                                        animate={
                                          favs.has(post.id)
                                            ? { scale: [1, 1.4, 1] }
                                            : { scale: 1 }
                                        }
                                      >
                                        <Heart
                                          className={`h-5 w-5 ${favs.has(post.id) ? "text-red-500 fill-current" : ""}`}
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
