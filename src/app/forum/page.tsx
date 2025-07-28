"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, MessageSquare, Users, Star, Clock, Filter, Heart, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


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

export default function NurunyoluForum() {
  const [topics, setTopics] = useState(mockTopics);
  const [filterTag, setFilterTag] = useState("All");
  const [search, setSearch] = useState("");
  const [newPostOpen, setNewPostOpen] = useState(false);
  const allTags = ["All", ...new Set(topics.flatMap((t) => t.tags))];

  const filtered = topics.filter(
    (t) =>
      (filterTag === "All" || t.tags.includes(filterTag)) &&
      t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="relative min-h-screen bg-[#111827] text-[#F9FAFB] overflow-hidden">
      {/* Background Video Loop */}
      <video
        src="/videos/forum-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/80 via-[#111827]/60 to-[#111827]/90" />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-px h-px bg-[#C0C0C0] rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [-window.innerHeight, window.innerHeight], opacity: [0.1, 0.8, 0.1] }}
            transition={{ duration: 20 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 5 }}
          >
            ﷽
          </motion.span>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between p-6 backdrop-blur-sm border-b border-white/10">
        <h1 className="text-3xl font-black tracking-tight">
          Nurunyolu <span className="text-[#C0C0C0]">Forum</span>
        </h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/10 rounded-full px-4 py-2 text-sm border-white/20 focus:outline-none focus:ring-2 focus:ring-[#C0C0C0]"
          />
          <Button
            size="sm"
            className="flex items-center gap-2 rounded-full bg-[#C0C0C0] text-black font-bold"
            onClick={() => setNewPostOpen(true)}
          >
            <Plus size={16} /> Yeni Konu
          </Button>
        </div>
      </header>

      {/* Filters */}
      <div className="relative z-20 flex gap-3 px-6 py-4 overflow-x-auto">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilterTag(tag)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              filterTag === tag
                ? "bg-[#C0C0C0] text-[#111827]"
                : "bg-white/10 text-[#F9FAFB] hover:bg-white/20"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Topics */}
      <AnimatePresence>
        <motion.div className="relative z-20 px-6 py-4 space-y-4">
          {filtered.map((topic) => (
            <motion.div
              key={topic.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.01 }}
              className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 flex items-center justify-between transition hover:bg-white/10 hover:shadow-[0_0_30px_-10px_#C0C0C0]"
            >
              <div className="flex-1">
                <h3 className="font-bold text-lg">
                  {topic.pinned && <Star className="inline-block mr-2 h-4 w-4 text-amber-400" />}
                  {topic.title}
                </h3>
                <div className="mt-2 flex items-center gap-4 text-sm text-[#F9FAFB]/70">
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
                <div className="mt-2 flex gap-2">
                  {topic.tags.map((t) => (
                    <span key={t} className="text-xs bg-[#C0C0C0]/20 rounded px-2 py-0.5">
                      # {t}
                    </span>
                  ))}
                </div>
              </div>
              <Link href={`/forum/${topic.id}`}>
                <Button size="sm" variant="ghost" className="text-[#F9FAFB] hover:text-[#C0C0C0]">
                  Gör
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-20 text-center py-8 text-[#F9FAFB]/60">
        <Heart className="mx-auto mb-2 h-6 w-6 text-red-500" />
        <p className="text-sm">© {new Date().getFullYear()} Nurunyolu – Tasarım aşkıyla kodlandı.</p>
      </footer>
    </section>
  );
}
