"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Share2, Volume2, VolumeX, Play, Clock, ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const posts = [
  {
    id: 1,
    slug: "evren",
    title: "Evrenin Genişlemesi",
    desc: "Zariyat 47 – 1400 yıl önce bildirildi.",
    img: "https://images.unsplash.com/photo-1566345984367-fa2ba5cedc17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8c3BhY2V8ZW58MHx8fHwxNzUzMzgyMDMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    ayet: "وَالسَّمَاءَ بَنَيْنَاهَا بِأَيْيْدٍ وَإِنَّا لَمُوسِعُونَ",
    category: "Blog",
    readTime: 7,
  },
  {
    id: 2,
    slug: "daglar",
    title: "Dağların Hareketi",
    desc: "Neml 88 – Kayan kıtalar mucizesi.",
    img: "https://images.unsplash.com/photo-1669632236861-bea1095c866e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8ZGElQzQlOUZ8ZW58MHx8fHwxNzUzMzgxOTczfDA&ixlib=rb-4.1.0&q=80&w=1080",
    ayet: "وَتَرَى الْجِبَالَ تَحْسَبُهَا جَامِدَةً",
    category: "Blog",
    readTime: 6,
  },
  {
    id: 3,
    slug: "embriyo",
    title: "Embriyo Evreleri",
    desc: "Müminun 12-14 – Tıbbi mucize.",
    img: "https://images.unsplash.com/photo-1604363236113-a8a5f3b7381c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxlbWJyeW98ZW58MHx8fHwxNzUzMzgzNjgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    ayet: "ثُمَّ خَلَقْنَا النُّطْفَةَ عَلَقَةً",
    category: "Blog",
    readTime: 8,
  },
];

export default function IslamiBloglarPage() {
  const { toast } = useToast();
  const [muted, setMuted] = useState(true);
  const [favs, setFavs] = useState<Set<number>>(new Set());
  const ref = useRef(null);

  const toggleFav = (id: number) => {
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
   
  const handleShare = (title: string, slug: string) => {
    const url = `${window.location.origin}/posts/${slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link kopyalandı ✨", description: url });
  };

  return (
    <div ref={ref} className="bg-background">
      <Header />
      {/* Cinematic Hero */}
      <section className="relative h-screen w-full overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/90" />

        {/* Floating Kandil */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-gradient-radial from-yellow-300 via-transparent to-transparent blur-2xl"
        />

        {/* Title */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 1 }}
            className="font-black text-6xl md:text-8xl tracking-tighter"
          >
            İslami Bloglar
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="mt-6 max-w-2xl text-xl text-white/80"
          >
            İslam'ı anlama ve yaşama yolculuğunuzda size rehber olacak yazılar.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3 }}
            className="mt-8"
          >
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-emerald-400 to-sky-500 text-black font-bold"
              onClick={() => document.getElementById("grid")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Play className="mr-2 h-5 w-5" />
              Keşfet
            </Button>
          </motion.div>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={() => setMuted(!muted)}
          className="absolute top-6 right-6 text-white/70 hover:text-white"
        >
          {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </section>

      {/* 3D Masonry Grid */}
      <main id="grid" className="relative z-10 container mx-auto py-20 px-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {posts.map((post) => (
            <motion.article
              key={post.id}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.03 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${post.img})` }}
                data-ai-hint="islamic blog"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Neon Glass Layer */}
              <div className="absolute inset-0 rounded-3xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm bg-white/5" />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge variant="secondary" className="mb-2">
                  Blog
                </Badge>
                <h3 className="text-2xl font-bold text-white leading-tight">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-white/80">{post.desc}</p>

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
          ))}
        </motion.div>
      </main>

      {/* Final Şelale */}
      <footer className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 via-transparent to-transparent blur-3xl" />
        <div className="container mx-auto text-center text-white/60">
          <Sparkles className="mx-auto mb-4 h-12 w-12 text-yellow-300" />
          <p className="text-sm">© 2025 Nurunyolu – Tasarım aşkıyla kodlandı.</p>
        </div>
      </footer>
    </div>
  );
}
