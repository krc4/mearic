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
import { HeroBackground } from '@/components/hero-background';
import styles from './page.module.css';


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
          <section className="mb-16 md:mb-24 flex justify-center">
             <article className="group relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-border/30 bg-background/70 shadow-2xl shadow-black/5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/10 dark:border-border/60 dark:bg-background/50 dark:shadow-white/5">
                {/* Image as background */}
                <Image
                  src={mainArticle.image}
                  alt={mainArticle.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint="galaxy stars"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-7">
                  <div>
                    <Badge variant="secondary" className="mb-3">{mainArticle.category}</Badge>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                      {mainArticle.title}
                    </h2>
                    <p className="mt-2 text-sm text-white/80">
                      Modern bilimin evrenin genişlediği keşfi, Kuran-ı Kerim'de 1400 yıl önce Zariyat Suresi'nde haber verilmiştir. Bu yazıda bu mucizeyi inceliyoruz.
                    </p>
                  </div>
                  <footer className="mt-6 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
                      <Clock className="h-3.5 w-3.5" />
                      Tahmini okuma süresi: {mainArticle.readTime} dakika
                    </span>
                    <Button asChild size="sm" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-sm ring-1 ring-white/20 transition-all hover:bg-white/20 active:scale-95">
                        <Link href="#">
                            Yazıyı Oku
                            <ArrowUpRight className="ml-1.5 h-4 w-4" />
                        </Link>
                    </Button>
                  </footer>
                </div>

                {/* Hover shine effect */}
                <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute -inset-px rounded-2xl bg-[radial-gradient(65%_65%_at_50%_50%,hsl(var(--accent)/0.15),transparent)] dark:bg-[radial-gradient(65%_65%_at_50%_50%,hsl(var(--accent)/0.3),transparent)]" />
                </div>
              </article>
          </section>


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
                  <input type="email" placeholder="E-posta adresiniz" className="flex-grow md:min-w-[300px] bg-background p-2 rounded-md" />
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
