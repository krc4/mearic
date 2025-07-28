
"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, MessageSquare, Users, Star, Clock, Filter, Heart, Eye, ArrowUpRight, Pin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getTopLikedPosts } from "@/lib/firebase/services";
import type { Post } from "@/lib/posts";


type Topic = {
  id: string;
  title: string;
  author: string;
  replies: number;
  views: number;
  lastReply: string;
  tags: string[];
  pinned?: boolean;
};

const mockTopics: Topic[] = [
  {
    id: "1",
    title: "Kur’an’da Evrenin Genişlemesi – Zariyat 47",
    author: "Dr. Emre",
    replies: 42,
    views: 1240,
    lastReply: "2 saat önce",
    tags: ["Kozmoloji", "Zariyat"],
    pinned: true,
  },
  {
    id: "2",
    title: "Hadislerdeki Tıbbi Mucizeler",
    author: "Zeynep H.",
    replies: 27,
    views: 890,
    lastReply: "5 saat önce",
    tags: ["Tıp", "Nebevi"],
  },
  {
    id: "3",
    title: "Sabır ve Tevekkül – Ayet & Hadis",
    author: "Yusuf A.",
    replies: 19,
    views: 540,
    lastReply: "1 gün önce",
    tags: ["Tasavvuf", "Ayet"],
  },
];

const staticFeaturedTopics = [
  {
    id: "f3",
    title: "Forum Kuralları ve Kullanım Kılavuzu",
    image: "https://placehold.co/600x400.png",
    category: "Bilgilendirme",
    link: "#",
    hint: "community rules"
  },
  {
    id: "f4",
    title: "Forum Hakkında Sıkça Sorulan Sorular",
    image: "https://placehold.co/600x400.png",
    category: "Yardım",
    link: "#",
    hint: "questions help"
  }
];


export default function NurunyoluForum() {
  const [topics, setTopics] = useState(mockTopics);
  const [featuredTopics, setFeaturedTopics] = useState<any[]>([]);
  const [filterTag, setFilterTag] = useState("All");
  const [search, setSearch] = useState("");
  const [newPostOpen, setNewPostOpen] = useState(false);
  const allTags = ["All", ...new Set(topics.flatMap((t) => t.tags))];

  useEffect(() => {
    const fetchTopPosts = async () => {
      const topPosts = await getTopLikedPosts(2);
      const dynamicTopics = topPosts.map(post => ({
        id: post.id,
        title: post.title,
        image: post.image,
        category: post.category,
        link: `/posts/${post.slug}`,
        hint: 'popular post'
      }));
      setFeaturedTopics([...dynamicTopics, ...staticFeaturedTopics]);
    }
    fetchTopPosts();
  }, [])

  const filtered = topics.filter(
    (t) =>
      (filterTag === "All" || t.tags.includes(filterTag)) &&
      t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="container mx-auto py-8">

      {/* Header */}
      <header className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-lg bg-card border mb-8">
        <h1 className="text-3xl font-black tracking-tight text-center md:text-left">
          Nurunyolu <span className="text-primary">Forum</span>
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
            onClick={() => setNewPostOpen(true)}
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
          {filtered.map((topic) => (
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
                  {topic.pinned && <Star className="inline-block mr-2 h-4 w-4 text-amber-400" />}
                  {topic.title}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span>@{topic.author}</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={14} /> {topic.replies} yorum
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} /> {topic.views} görüntüleme
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {topic.lastReply}
                  </span>
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {topic.tags.map((t) => (
                    <span key={t} className="text-xs bg-primary/10 text-primary rounded px-2 py-0.5">
                      # {t}
                    </span>
                  ))}
                </div>
              </div>
              <Link href={`/forum/${topic.id}`} className="w-full sm:w-auto">
                 <Button size="sm" variant="outline" className="w-full sm:w-auto transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  Gör
                  <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/>
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-20 text-center py-8 text-muted-foreground">
        <Heart className="mx-auto mb-2 h-6 w-6 text-red-500" />
        <p className="text-sm">© {new Date().getFullYear()} Nurunyolu</p>
      </footer>
    </section>
  );
}
