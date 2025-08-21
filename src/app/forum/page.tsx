
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, MessageSquare, Users, Star, Clock, Filter, Heart, Eye, ArrowUpRight, Pin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Post } from "@/lib/posts";
import { getPostsByCategory } from "@/lib/firebase/services";
import { Skeleton } from "@/components/ui/skeleton";
import { NewTopicDialog } from "@/components/new-topic-dialog";


const featuredTopics = [
    {
        id: "f1",
        title: "Kur’an’da Evrenin Genişlemesi Tartışması",
        image: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop",
        category: "Popüler Konu",
        link: "/forum/kuran-da-evrenin-genislemesi-zariyat-47",
        hint: "galaxy stars"
    },
    {
        id: "f2",
        title: "Tıbb-ı Nebevi: Hadislerdeki Sağlık Öğütleri",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",
        category: "Popüler Konu",
        link: "#",
        hint: "medicine health"
    },
    {
        id: "f3",
        title: "Forum Kuralları ve Kullanım Kılavuzu",
        image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop",
        category: "Bilgilendirme",
        link: "#",
        hint: "community rules"
    },
    {
        id: "f4",
        title: "Sıkça Sorulan Sorular ve Yardım",
        image: "https://images.unsplash.com/photo-1559863438-6b8d093c398e?q=80&w=2070&auto=format&fit=crop",
        category: "Yardım",
        link: "#",
        hint: "questions help"
    }
];

const TopicRowSkeleton = () => (
    <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-9 w-20 rounded-md" />
    </div>
);


export default function MearicForum() {
  const [topics, setTopics] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTag, setFilterTag] = useState("Tümü");
  const [search, setSearch] = useState("");
  const [newTopicOpen, setNewTopicOpen] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
        setLoading(true);
        const fetchedTopics = await getPostsByCategory("Forum");
        const sorted = fetchedTopics.sort((a, b) => {
            const dateA = a.createdAt?.toDate() || 0;
            const dateB = b.createdAt?.toDate() || 0;
            return dateB.getTime() - dateA.getTime();
        });
        setTopics(sorted);
        setLoading(false);
    }
    fetchTopics();
  }, []);

  const allTags = ["Tümü", "Teknoloji", "Kuran", "Tarih", "Genel"];


  const filtered = topics.filter(
    (t) =>
      // (filterTag === "Tümü" || t.tags.includes(filterTag)) && // Add t.tags to your Post type and data to enable this
      t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <section className="container mx-auto py-8">

      {/* Header */}
      <header className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-lg bg-card border mb-8">
        <h1 className="text-3xl font-black tracking-tight text-center md:text-left">
          Mearic <span className="text-primary">Forum</span>
        </h1>
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                  type="search"
                  placeholder="Konularda ara..."
                  className="pl-9 w-full md:w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
          </div>
          <Button
            size="sm"
            className="flex items-center gap-2 rounded-full font-bold"
            onClick={() => setNewTopicOpen(true)}
          >
            <Plus size={16} /> <span className="hidden sm:inline">Yeni Konu</span>
          </Button>
        </div>
      </header>
      
       {/* Advertisement Section */}
      <div className="mb-12">
        <Link href="#" className="block w-full aspect-[16/9] relative overflow-hidden rounded-lg group">
          <Image 
            src="https://placehold.co/1280x720.png"
            alt="Reklam"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="advertisement banner"
          />
           <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-black/50 text-white px-4 py-2 rounded-md text-sm font-semibold">Reklam</span>
          </div>
        </Link>
      </div>

      {/* Featured Topics Section */}
       <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
            <Pin className="h-6 w-6 text-primary"/>
            Öne Çıkan Konular
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTopics.map(topic => (
            <motion.div 
              key={topic.id}
              whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
              className="group relative rounded-2xl overflow-hidden border bg-card"
            >
              <Image 
                src={topic.image}
                alt={topic.title}
                width={400}
                height={250}
                className="w-full h-40 object-cover"
                data-ai-hint={topic.hint}
              />
              <div className="p-4">
                <Badge variant="secondary" className="mb-2">{topic.category}</Badge>
                <h3 className="font-semibold text-md leading-tight h-12">{topic.title}</h3>
                <Button asChild variant="link" className="p-0 h-auto mt-2 font-bold text-primary">
                  <Link href={topic.link}>
                    Göz At <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <div className="relative z-20 flex gap-3 px-6 py-4 overflow-x-auto">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilterTag(tag)}
            className={`rounded-full px-4 py-1.5 text-sm transition whitespace-nowrap ${
              filterTag === tag
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Topics */}
      <AnimatePresence>
        <motion.div className="relative z-20 px-4 md:px-6 py-4 space-y-4">
          {loading ? (
             <>
                <TopicRowSkeleton />
                <TopicRowSkeleton />
                <TopicRowSkeleton />
             </>
          ) : (
            filtered.map((topic) => (
              <motion.div
                key={topic.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.01 }}
                className="group relative rounded-2xl border bg-card/50 backdrop-blur-md p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:bg-accent/80 hover:shadow-lg"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-lg">
                    {topic.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>@{topic.author || 'Mearic Ekibi'}</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={14} /> {(topic as any).replies || 0} yorum
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} /> {topic.views || 0} görüntüleme
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {topic.createdAt ? new Date(topic.createdAt.seconds * 1000).toLocaleDateString() : 'Bilinmiyor'}
                    </span>
                  </div>
                </div>
                <Link href={`/forum/${topic.slug}`} className="w-full sm:w-auto">
                   <Button size="sm" variant="outline" className="w-full sm:w-auto transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    Gör
                    <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/>
                  </Button>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-20 text-center py-8 text-muted-foreground">
        <Heart className="mx-auto mb-2 h-6 w-6 text-red-500" />
        <p className="text-sm">© {new Date().getFullYear()} Mearic</p>
      </footer>
    </section>

    <NewTopicDialog isOpen={newTopicOpen} onOpenChange={setNewTopicOpen} />
    </>
  );
}

    