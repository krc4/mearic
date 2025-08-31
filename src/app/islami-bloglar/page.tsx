
import { getPostsByCategory } from "@/lib/firebase/services";
import { ReadingProgressBar } from "@/components/reading-progress-bar";
import { Header } from "@/components/header";
import { CategoryClientPage } from "@/components/category-client-page";
import { Sparkles } from "lucide-react";


export default async function IslamiBloglarPage() {
  const initialPosts = await getPostsByCategory("İslami Bloglar");

  return (
    <>
      <ReadingProgressBar />
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <CategoryClientPage 
          initialPosts={initialPosts}
          pageTitle="İslami Bloglar"
          pageDescription="İslam'ı anlama ve yaşama yolculuğunuzda size rehber olacak yazılar."
          headerImage="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop"
          headerImageHint="islamic calligraphy art"
        />

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
