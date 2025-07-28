
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MessageSquare,
  Heart,
  Eye,
  User,
  Clock,
  Share2,
  Send,
  MoreVertical,
  ChevronRight,
  Home,
  Tag
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import styles from "@/app/page.module.css";
import { CommentSection } from "@/components/comment-section";
import { ReadingProgressBar } from "@/components/reading-progress-bar";
import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";


// Mock Data - In a real app, this would be fetched based on topicId
const topicData = {
  id: "1",
  title: "Kur’an’da Evrenin Genişlemesi – Zariyat 47",
  author: {
    name: "Dr. Emre",
    avatar: "https://github.com/shadcn.png",
    title: "İlahiyat Araştırmacısı",
  },
  image: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop",
  stats: {
    replies: 42,
    views: 1240,
    likes: 178,
  },
  readTime: 8,
  category: 'Kozmoloji',
  createdAt: "2 gün önce",
  tags: ["Kozmoloji", "Zariyat", "Mucize"],
  content: `
    <p class="text-xl leading-relaxed text-foreground/90">Modern bilimin en çarpıcı keşiflerinden biri, evrenin sürekli olarak genişlediği gerçeğidir. Bu keşif, 20. yüzyılın başlarında Edwin Hubble'ın gözlemleriyle bilim dünyasına kazandırılmıştır. Ancak, bu kozmolojik gerçek, Kuran-ı Kerim'de 1400 yıl önce Zariyat Suresi'nde mucizevi bir şekilde haber verilmiştir.</p>
    <p>Hubble, teleskopuyla uzak galaksileri gözlemlerken, bu galaksilerin bizden uzaklaştığını ve bu uzaklaşma hızının mesafeyle doğru orantılı olduğunu keşfetti. Bu, evrenin statik bir yapıda olmadığını, aksine bir balon gibi sürekli şiştiğini gösteriyordu. Bu buluş, "Büyük Patlama" (Big Bang) teorisinin de en güçlü delillerinden biri haline geldi.</p>
    <blockquote>
        <p>Biz göğü ‘büyük bir kudretle’ bina ettik ve şüphesiz Biz, (onu) genişleticiyiz.</p>
        <footer class="text-right not-italic text-base text-muted-foreground mt-2">— Zariyat Suresi, 47. Ayet</footer>
    </blockquote>
    <p>Bu ayette geçen "genişleticiyiz" (lā-mūsi'ūna) ifadesi, Arapça dilbilgisi açısından ism-i fail olup, genişletme eyleminin devam ettiğini ve gelecekte de devam edeceğini ifade eder. Bu, evrenin sadece bir defaya mahsus genişlemediğini, bu eylemin sürekli olduğunu vurgulayan mucizevi bir ifadedir. Bilimin ancak 20. yüzyılda ulaşabildiği bu bilgi, Kuran'ın Allah kelamı olduğunun apaçık bir delilidir.</p>
    <h3 class="text-2xl font-bold mt-8 mb-4">Bilimsel ve Kuranî Perspektifin Uyumu</h3>
    <p>Kuran'ın bu ifadesi, o dönemin ilkel astronomi bilgisiyle açıklanabilecek bir durum değildir. O dönemde hakim olan inanış, Aristo ve Batlamyus'un etkisindeki statik evren modeliydi. Kuran, bu yaygın ve yanlış inanışın aksine, dinamik ve genişleyen bir evren tablosu çizmiştir. Bu durum, Kuran'ın insanüstü bir kaynaktan geldiğini ve her çağda insanlığa yol gösteren bir rehber olduğunu kanıtlar niteliktedir.</p>
  `,
};

export default function ForumTopicPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  const { toast } = useToast();
  
  const [topic, setTopic] = useState<typeof topicData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0); // Assuming this comes from CommentSection, we'll mock it for now

  useEffect(() => {
    setLoading(true);
    // In a real app, you would fetch data based on topicId
    // For now, we use mock data and a timeout to simulate loading
    setTimeout(() => {
        const fetchedTopic = topicData; // Assuming topicId '1' is the mock
        if (fetchedTopic) {
            setTopic(fetchedTopic);
            setLikeCount(fetchedTopic.stats.likes);
            setCommentCount(fetchedTopic.stats.replies); // Mock comment count

             if (typeof window !== 'undefined') {
                // Handle view count with sessionStorage
                const viewedKey = `viewed-forum-${fetchedTopic.id}`;
                const hasViewed = sessionStorage.getItem(viewedKey);
                let currentViews = Number(localStorage.getItem(`views-forum-${fetchedTopic.id}`)) || fetchedTopic.stats.views;

                if (!hasViewed) {
                    currentViews += 1;
                    localStorage.setItem(`views-forum-${fetchedTopic.id}`, String(currentViews));
                    sessionStorage.setItem(viewedKey, 'true');
                }
                setViewCount(currentViews);

                // Handle like state with localStorage
                const isLiked = localStorage.getItem(`liked-forum-${fetchedTopic.id}`) === 'true';
                setLiked(isLiked);
             } else {
                 setViewCount(fetchedTopic.stats.views);
             }
        }
        setLoading(false);
    }, 500);
  }, [topicId]);

  const handleLikeToggle = () => {
    if (!topic) return;
    const newLikedState = !liked;
    
    setLiked(newLikedState);
    setLikeCount(current => current + (newLikedState ? 1 : -1));

    if (typeof window !== 'undefined') {
        localStorage.setItem(`liked-forum-${topic.id}`, String(newLikedState));
    }
    toast({
        title: newLikedState ? "Konuyu beğendiniz!" : "Beğeni geri çekildi",
    });
  };

  const handleShare = async () => {
    if (!topic) return;
    const url = window.location.href;
    const shareData = {
        title: topic.title,
        url: url,
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            throw new Error("Share API not supported");
        }
    } catch (error: any) {
         // This block will be entered if the user cancels the share dialog,
         // or if the API is not supported. In either case, copy to clipboard.
         navigator.clipboard.writeText(url);
         toast({
            title: "Link panoya kopyalandı!",
            description: "Bu içeriği arkadaşlarınla kolayca paylaşabilirsin.",
         });
    }
  };


 if (loading) {
    return (
        <>
            <Header />
            <div className="container mx-auto max-w-6xl px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
                     <div className="lg:col-span-8">
                        <Skeleton className="h-8 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-1/2 mb-8" />
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                             <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-5/6" />
                        </div>
                     </div>
                      <aside className="lg:col-span-4 space-y-6">
                        <Skeleton className="h-40 w-full rounded-xl" />
                        <Skeleton className="h-24 w-full rounded-xl" />
                      </aside>
                </div>
            </div>

        </>
    )
  }

  if (!topic) {
    return notFound();
  }


  return (
    <>
      <ReadingProgressBar />
      <Header />
      <div className="bg-background text-foreground">
        {/* Header Image */}
        <div className="relative h-72 md:h-96 w-full">
            {topic.image ? (
                <>
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${topic.image})` }}
                        data-ai-hint="galaxy stars"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                </>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/50" />
            )}
        </div>
        
        <div className="container mx-auto -mt-24 md:-mt-32 relative z-20 px-4">
            {/* Breadcrumb */}
            <nav className="py-6 text-sm text-white/80">
              <ol className="list-none p-0 inline-flex items-center">
                <li className="flex items-center">
                  <Link href="/" className="hover:text-primary">
                    <Home className="h-4 w-4" />
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-1" />
                </li>
                 <li className="flex items-center">
                  <Link href="/forum" className="hover:text-primary">
                    Forum
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-1" />
                </li>
                <li className="truncate" style={{ maxWidth: "300px" }}>
                  <span className="font-semibold text-white">{topic.title}</span>
                </li>
              </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
                <motion.main
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="lg:col-span-8"
                >
                     <Card className="shadow-2xl overflow-hidden">
                        <CardContent className="p-6 md:p-8">
                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-primary">
                                {topic.title}
                            </h1>

                             {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-6 pb-6 border-b">
                                <span className="flex items-center gap-1.5"><Clock size={14} />{topic.readTime} dakika okuma</span>
                                <span className="flex items-center gap-1.5"><Tag size={14} />{topic.category}</span>
                            </div>

                            {/* Article Content */}
                             <article
                                className={`prose prose-lg dark:prose-invert max-w-none ${styles.articleContent}`}
                                dangerouslySetInnerHTML={{ __html: topic.content }}
                            />
                        </CardContent>
                     </Card>
                     
                     {/* The comment section needs a real post ID from a database. 
                         Using a mock ID for now to make it render. */}
                     <CommentSection postId={`forum-${topic.id}`} />
                </motion.main>

                 {/* Sidebar */}
                <motion.aside
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="lg:col-span-4 lg:sticky top-24 h-fit"
                >
                    <div className="space-y-6">
                        <Card className="shadow-xl">
                            <CardHeader>
                                <h3 className="font-semibold text-lg">Konu Sahibi</h3>
                            </CardHeader>
                            <CardContent className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-2 border-primary">
                                     <AvatarImage src={topic.author.avatar} alt={topic.author.name} />
                                    <AvatarFallback>{topic.author.name.substring(0,2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-lg">{topic.author.name}</p>
                                    <p className="text-sm text-muted-foreground">{topic.author.title}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-xl">
                            <CardHeader>
                                <h3 className="font-semibold text-lg">Etkileşim</h3>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <div className="flex justify-around text-center">
                                   <div>
                                       <p className="text-2xl font-bold">{viewCount}</p>
                                       <p className="text-sm text-muted-foreground flex items-center gap-1"><Eye size={14}/>Görüntülenme</p>
                                   </div>
                                   <div>
                                       <p className="text-2xl font-bold">{commentCount}</p>
                                       <p className="text-sm text-muted-foreground flex items-center gap-1"><MessageSquare size={14}/>Yorum</p>
                                   </div>
                                   <div>
                                       <p className="text-2xl font-bold">{likeCount}</p>
                                       <p className="text-sm text-muted-foreground flex items-center gap-1"><Heart size={14}/>Beğeni</p>
                                   </div>
                               </div>
                               <div className="flex gap-2 pt-4 border-t">
                                    <Button className="w-full group" onClick={handleLikeToggle} variant={liked ? "default" : "outline"}>
                                        <Heart className={`mr-2 h-4 w-4 ${liked ? "fill-current" : ""}`} /> {liked ? "Beğenildi" : "Beğen"}
                                    </Button>
                                     <Button className="w-full" variant="outline" onClick={handleShare}>
                                        <Share2 className="mr-2 h-4 w-4" /> Paylaş
                                    </Button>
                               </div>
                            </CardContent>
                        </Card>
                         <Card className="shadow-xl">
                            <CardHeader>
                                <h3 className="font-semibold text-lg">Etiketler</h3>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                {topic.tags.map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </motion.aside>

            </div>
        </div>

         <footer className="text-center py-16 mt-12 text-sm text-muted-foreground border-t">
            <p>&copy; {new Date().getFullYear()} Nurunyolu. Tüm hakları saklıdır.</p>
        </footer>
      </div>
    </>
  );
}
