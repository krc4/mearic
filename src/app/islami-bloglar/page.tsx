
import { ReadingProgressBar } from "@/components/reading-progress-bar";
import { Header } from "@/components/header";
import { motion } from "framer-motion";
import { getPostsByCategory } from "@/lib/firebase/services";
import { CategoryClientPage } from "@/components/category-client-page";
import { Sparkles } from "lucide-react";


export default async function IslamiBloglarPage() {
  const initialPosts = await getPostsByCategory("İslami Bloglar");

  return (
    <>
      <ReadingProgressBar />
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <section className="relative isolate flex items-center justify-center overflow-hidden py-24 md:py-36">
           <div
            className="absolute inset-0 -z-10 scale-125"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop)`,
              backgroundAttachment: "fixed",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(.4)",
            }}
            data-ai-hint="islamic calligraphy art"
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

        <CategoryClientPage initialPosts={initialPosts} pageTitle="İslami Bloglar" />

        <footer className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 via-transparent to-transparent blur-3xl" />
          <div className="container mx-auto text-center text-muted-foreground">
            <Sparkles className="mx-auto mb-4 h-12 w-12 text-yellow-300" />
            <p className="text-sm">© {new Date().getFullYear()} Mearic</p>
          </div>
        </footer>
      </div>
    </>
  );
}
