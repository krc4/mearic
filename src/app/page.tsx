import Image from 'next/image';
import { Clock, Rss, ArrowUpRight, Bot } from 'lucide-react';
import { mockPosts, mainArticle } from '@/lib/posts';
import { Header } from '@/components/header';
import { PostCard } from '@/components/post-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReadingProgressBar } from '@/components/reading-progress-bar';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { HeroBackground } from '@/components/hero-background';

export default function Home() {
  return (
    <>
      <ReadingProgressBar />
      <div className="flex flex-col min-h-screen">
        <Header />

        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white overflow-hidden">
          <HeroBackground />
          <div className="container px-4 z-10">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
              İslam'ın Işığında Yapay Zeka
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-white/80 drop-shadow-md">
              İslami konulardaki sorularınızı yanıtlayan, size özel bir yapay zeka asistanı. Merak ettiklerinizi sorun, anında öğrenin.
            </p>
            <Button size="lg" className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20">
              Yapay Zekayı Deneyin
              <Bot className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
          {/* Main Article Section */}
          <article className="mb-16 md:mb-24">
            <Card className="overflow-hidden border-none shadow-none md:shadow-lg dark:md:shadow-none md:grid md:grid-cols-2 md:gap-8 items-center bg-card/50 transition-transform duration-500 ease-in-out hover:scale-[1.02] transform-gpu">
              <div className="relative w-full h-64 md:h-full min-h-[300px]">
                <Image
                  src={mainArticle.image}
                  alt={mainArticle.title}
                  fill
                  className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                  data-ai-hint="galaxy stars"
                />
              </div>
              <div className="p-6 md:p-8">
                <Badge variant="secondary" className="mb-2">{mainArticle.category}</Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                  {mainArticle.title}
                </h2>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Tahmini okuma süresi: {mainArticle.readTime} dakika</span>
                </div>
                <p className="text-muted-foreground mb-6">
                  Modern bilimin evrenin genişlediği keşfi, Kuran-ı Kerim'de 1400 yıl önce Zariyat Suresi'nde haber verilmiştir. Bu yazıda bu mucizeyi inceliyoruz.
                </p>
                <Button asChild>
                  <Link href="#">Yazıyı Oku <ArrowUpRight className="w-4 h-4 ml-2"/></Link>
                </Button>
              </div>
            </Card>
          </article>

          {/* Other Posts */}
          <section className="mb-16 md:mb-24">
            <h2 className="text-3xl font-bold text-center mb-12">Öne Çıkan Diğer Yazılar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockPosts.slice(0, 3).map((post) => (
                <PostCard key={post.id} post={post} orientation="vertical" />
              ))}
            </div>
          </section>

          {/* Newsletter */}
          <section>
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <h3 className="flex items-center justify-center md:justify-start gap-3 text-2xl font-bold text-primary">
                    <Rss className="w-7 h-7"/>
                    <span>Bültenimize Katılın</span>
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-lg">
                    En son yazılardan, İslami içeriklerden ve gelişmelerden ilk siz haberdar olun.
                  </p>
                </div>
                <form className="w-full md:w-auto flex items-center gap-2">
                  <Input type="email" placeholder="E-posta adresiniz" className="flex-grow md:min-w-[300px] bg-background" />
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Abone Ol
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>

        </main>

        <footer className="container mx-auto mt-12 py-8 px-4 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Nurunyolu. Tüm hakları saklıdır.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-primary transition-colors">Anasayfa</Link>
              <Link href="#" className="hover:text-primary transition-colors">Hakkımızda</Link>
              <Link href="#" className="hover:text-primary transition-colors">İletişim</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
