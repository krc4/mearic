
import { getPostsByCategory } from "@/lib/firebase/services";
import { ReadingProgressBar } from "@/components/reading-progress-bar";
import { Header } from "@/components/header";
import { CategoryClientPage } from "@/components/category-client-page";
import { Sparkles } from "lucide-react";


export default async function HadisMucizeleriPage() {
  const { posts } = await getPostsByCategory("Hadis Mucizeleri");

  return (
    <>
      <ReadingProgressBar />
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <CategoryClientPage 
          initialPosts={posts}
          pageTitle="Hadislerdeki Mucizeler"
          pageDescription="Peygamber Efendimiz'in (S.A.V) 1400 yıl önce bildirdiği bilimsel ve tıbbi gerçekleri keşfedin."
          headerImage="/hadis-mucizeleri.png"
          headerImageHint="hadith desert"
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
