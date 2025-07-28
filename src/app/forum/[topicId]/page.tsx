
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  Home
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import styles from "@/app/page.module.css";


// Mock Data - In a real app, this would be fetched based on topicId
const topicData = {
  id: "1",
  title: "Kur’an’da Evrenin Genişlemesi – Zariyat 47",
  author: {
    name: "Dr. Emre",
    avatar: "https://placehold.co/48x48/7C3AED/FFFFFF?text=DE",
    title: "İlahiyat Araştırmacısı",
  },
  image: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop",
  stats: {
    replies: 42,
    views: 1240,
    likes: 178,
  },
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
  comments: [
     {
        id: 1,
        author: { name: "Ahmet Yılmaz", avatar: "https://placehold.co/40x40/EFEFEF/333333.png?text=AY" },
        date: "2 gün önce",
        text: "Subhanallah, ne büyük bir mucize! Kuran'ın her ayeti üzerinde tefekkür ettikçe insanın imanı daha da artıyor. Bu değerli paylaşım için teşekkür ederim.",
    },
     {
        id: 2,
        author: { name: "Fatma Kaya", avatar: "https://placehold.co/40x40/D8B4FE/FFFFFF.png?text=FK" },
        date: "1 gün önce",
        text: "Gerçekten de bilim ve Kuran arasındaki bu uyumu görmek hayranlık verici. Evrenin genişlediği bilgisinin 1400 yıl önce bildirilmesi, aklı olan için büyük bir delil.",
    },
  ]
};

export default function ForumTopicPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);

  // In a real app, you would fetch data based on topicId
  const topic = topicData;

  const handleLike = () => {
    setLiked(!liked);
    toast({
        title: liked ? "Beğeni geri çekildi" : "Konuyu beğendiniz!",
    });
  };

  const handleReplySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const comment = formData.get('comment');
    if (comment) {
        toast({
            title: "Yanıtınız için teşekkürler!",
            description: "Yorumunuz başarıyla gönderildi ve incelendikten sonra yayınlanacaktır.",
        })
        e.currentTarget.reset();
    }
  }


  return (
    <div className="bg-background text-foreground">
      {/* Header Image */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative h-72 md:h-96 w-full"
      >
        <Image
          src={topic.image}
          alt={topic.title}
          fill
          className="object-cover"
          data-ai-hint="galaxy stars"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      </motion.div>

      <div className="container mx-auto -mt-24 md:-mt-32 relative z-10 px-4">
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
          {/* Main Content */}
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
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={topic.author.avatar} />
                                <AvatarFallback>{topic.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span><span className="font-semibold text-foreground">{topic.author.name}</span> tarafından</span>
                        </div>
                        <span className="flex items-center gap-1.5"><Clock size={14} />{topic.createdAt}</span>
                    </div>

                    {/* Article Content */}
                    <article
                        className={`prose prose-lg dark:prose-invert max-w-none ${styles.articleContent}`}
                        dangerouslySetInnerHTML={{ __html: topic.content }}
                    />
                </CardContent>
            </Card>

            {/* Comments Section */}
            <div id="comments" className="mt-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <MessageSquare className="text-primary"/> Yorumlar ({topic.stats.replies})
                </h2>

                <div className="space-y-6">
                    {topic.comments.map(comment => (
                        <Card key={comment.id} className="bg-card/50">
                            <CardContent className="p-5 flex items-start gap-4">
                                 <Avatar>
                                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold">{comment.author.name}</p>
                                            <p className="text-xs text-muted-foreground">{comment.date}</p>
                                        </div>
                                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4"/></Button>
                                    </div>
                                    <p className="mt-2 text-foreground/90">{comment.text}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Reply Form */}
                 <Card className="mt-8 shadow-lg">
                    <form onSubmit={handleReplySubmit}>
                        <CardHeader>
                            <h3 className="text-lg font-semibold">Yoruma Katıl</h3>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                name="comment"
                                placeholder="Düşüncelerini yaz..."
                                className="min-h-[120px]"
                            />
                        </CardContent>
                        <CardContent className="flex justify-end pt-0">
                        <Button type="submit">
                            <Send className="mr-2 h-4 w-4" />
                            Yanıtla
                        </Button>
                        </CardContent>
                    </form>
                </Card>
            </div>
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
                            <AvatarImage src={topic.author.avatar} />
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
                        <h3 className="font-semibold text-lg">İstatistikler & Etkileşim</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="flex justify-around text-center">
                           <div>
                               <p className="text-2xl font-bold">{topic.stats.views}</p>
                               <p className="text-sm text-muted-foreground">Görüntülenme</p>
                           </div>
                           <div>
                               <p className="text-2xl font-bold">{topic.stats.replies}</p>
                               <p className="text-sm text-muted-foreground">Yorum</p>
                           </div>
                           <div>
                               <p className="text-2xl font-bold">{topic.stats.likes + (liked ? 1 : 0)}</p>
                               <p className="text-sm text-muted-foreground">Beğeni</p>
                           </div>
                       </div>
                       <div className="flex gap-2 pt-4 border-t">
                            <Button className="w-full group" onClick={handleLike} variant={liked ? "default" : "outline"}>
                                <Heart className={`mr-2 h-4 w-4 ${liked ? "fill-current" : ""}`} /> {liked ? "Beğenildi" : "Beğen"}
                            </Button>
                             <Button className="w-full" variant="outline">
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
  );
}


    