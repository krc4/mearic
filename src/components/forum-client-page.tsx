
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, MessageSquare, Eye, ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Post } from "@/lib/posts";
import { Skeleton } from "@/components/ui/skeleton";
import { NewTopicDialog } from "@/components/new-topic-dialog";
import { Heart } from "lucide-react";

interface ForumClientPageProps {
    initialTopics: Post[];
}

const TopicRowSkeleton = () => (
    <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-9 w-20 rounded-md" />
    </div>
);


export function ForumClientPage({ initialTopics }: ForumClientPageProps) {
  const [topics, setTopics] = useState<Post[]>(initialTopics);
  const [loading, setLoading] = useState(false);
  const [filterTag, setFilterTag] = useState("Tümü");
  const [search, setSearch] = useState("");
  const [newTopicOpen, setNewTopicOpen] = useState(false);

  useEffect(() => {
    setTopics(initialTopics);
  }, [initialTopics]);

  const allTags = ["Tümü", "Teknoloji", "Kuran", "Tarih", "Genel", "Diğer"];


  const filtered = topics.filter(
    (t) =>
      (filterTag === "Tümü" || (t.tags && t.tags.includes(filterTag))) &&
      t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
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
                     {topic.tags && topic.tags[0] && <Badge variant="outline">{topic.tags[0]}</Badge>}
                    <span className="flex items-center gap-1">
                      <MessageSquare size={14} /> {(topic as any).replies || 0} yorum
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} /> {topic.views || 0} görüntüleme
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {topic.createdAt ? new Date(topic.createdAt as string).toLocaleDateString() : 'Bilinmiyor'}
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
    
      <NewTopicDialog isOpen={newTopicOpen} onOpenChange={setNewTopicOpen} />
    </>
  );
}
