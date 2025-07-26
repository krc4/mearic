
import Image from 'next/image';
import { Clock, Rss, ArrowUpRight, Bot, BookOpen, Star, HeartPulse, Edit3 } from 'lucide-react';
import { mockPosts, mainArticle } from '@/lib/posts';
import { Header } from '@/components/header';
import { PostCard } from '@/components/post-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReadingProgressBar } from '@/components/reading-progress-bar';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import styles from '../page.module.css';

export default function KuranMucizeleriPage() {
  const quranPosts = mockPosts.filter(p => p.category === 'Kuran Mucizeleri');
  quranPosts.unshift(mainArticle);

  return (
    <>
      <ReadingProgressBar />
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
          <section>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary flex items-center justify-center gap-4">
                <BookOpen className="w-10 h-10"/>
                Kuran Mucizeleri
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Kuran-ı Kerim'in her ayetinde gizli olan bilimsel, matematiksel ve edebi mucizeleri keşfedin. 1400 yıl önce indirilen bu kutsal kitabın, modern bilimin bulgularıyla ne kadar uyumlu olduğuna tanıklık edin.
              </p>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {quranPosts.map(post => (
                  <article key={post.id} className="group relative mx-auto w-full max-w-2xl h-full overflow-hidden rounded-2xl border border-border/30 bg-background/70 shadow-2xl shadow-black/5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/10 dark:border-border/60 dark:bg-background/50 dark:shadow-white/5">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint="quran miracle"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                      <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-7">
                        <div>
                          <h2 className="text-xl font-semibold tracking-tight text-white">
                            {post.title}
                          </h2>
                          <p className="mt-2 text-sm text-white/80">
                            {post.description}
                          </p>
                        </div>
                        <footer className="mt-6 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
                            <Clock className="h-3.5 w-3.5" />
                            Tahmini okuma süresi: {post.readTime} dakika
                          </span>
                          <Button asChild size="sm" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-sm ring-1 ring-white/20 transition-all hover:bg-white/20 active:scale-95">
                              <Link href="#">
                                  Yazıyı Oku
                                  <ArrowUpRight className="ml-1.5 h-4 w-4" />
                              </Link>
                          </Button>
                        </footer>
                      </div>
                      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <div className="absolute -inset-px rounded-2xl bg-[radial-gradient(65%_65%_at_50%_50%,hsl(var(--accent)/0.15),transparent)] dark:bg-[radial-gradient(65%_65%_at_50%_50%,hsl(var(--accent)/0.3),transparent)]" />
                      </div>
                  </article>
                ))}
             </div>
          </section>
        </main>

        <footer className="container mx-auto mt-12 py-8 px-4 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Nurunyolu. Tüm hakları saklıdır.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
              <Link href="#" className="hover:text-primary transition-colors">Hakkımızda</Link>
              <Link href="#" className="hover:text-primary transition-colors">İletişim</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
