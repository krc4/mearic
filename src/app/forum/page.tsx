
import { Search, Plus, MessageSquare, ArrowUpRight, Pin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Post } from "@/lib/posts";
import { getPostsByCategory } from "@/lib/firebase/services";
import { NewTopicDialog } from "@/components/new-topic-dialog";
import { ForumClientPage } from "@/components/forum-client-page";

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
        link: "/posts/tibbi-nebevi",
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

export default async function MearicForum() {
  const initialTopics = await getPostsByCategory("Forum");
  const sorted = initialTopics.sort((a, b) => {
      const dateA = a.createdAt?.toDate() || 0;
      const dateB = b.createdAt?.toDate() || 0;
      return dateB.getTime() - dateA.getTime();
  });

  return (
    <section className="container mx-auto py-8">

      {/* Featured Topics Section */}
       <div className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
            <Pin className="h-6 w-6 text-primary"/>
            Öne Çıkan Konular
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTopics.map(topic => (
            <div 
              key={topic.id}
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
            </div>
          ))}
        </div>
      </div>

      <ForumClientPage initialTopics={sorted} />

    </section>
  );
}
