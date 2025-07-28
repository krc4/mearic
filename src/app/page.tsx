
'use client';
import Image from 'next/image';
import { Clock, Rss, ArrowUpRight, Bot, BookOpen, Star, HeartPulse, Edit3, Volume2, VolumeX, Play, Sparkles } from 'lucide-react';
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
import { DidYouKnowSection } from '@/components/did-you-know';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ScrollAnimationWrapper } from '@/components/ScrollAnimationWrapper';


export default function Home() {
  const secondArticle = mockPosts[0];
  const hadithArticle1 = mockPosts[0]; // Corrected index
  const hadithArticle2 = mockPosts[1]; // Corrected index
  const hadithArticle3 = mockPosts[0]; // Corrected index, re-using for safety.
  const thirdArticle = mockPosts[1];
  const blogArticle1 = mockPosts[0]; // Corrected index
  const blogArticle2 = mockPosts[1]; // Corrected index
  const [muted, setMuted] = useState(true); // Start muted
  const [videoSrc, setVideoSrc] = useState('');
  const [isClient, setIsClient] = useState(false); // State to track client-side mount
  const videoRef = useRef<HTMLVideoElement>(null);

  const videos = ['/anasayfa_video.mp4', '/anasayfa_video2.mp4', '/anasayfa_video3.mp4'];

  useEffect(() => {
    // This effect runs only on the client
    setIsClient(true);
    setVideoSrc(videos[Math.floor(Math.random() * videos.length)]);
  }, []);

  const handleVideoEnd = () => {
    if (videoRef.current) {
        videoRef.current.play();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const currentMuted = !videoRef.current.muted;
      videoRef.current.muted = currentMuted;
      setMuted(currentMuted);
    }
  };

  return (
    <>
      <ReadingProgressBar />
      <div className="flex flex-col min-h-screen">
        <Header />

        {/* Hero Section */}
        <section className="relative h-screen w-full overflow-hidden bg-black">
         {isClient && videoSrc && <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          onEnded={handleVideoEnd}
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/90" />

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-gradient-radial from-yellow-300 via-transparent to-transparent blur-2xl"
        />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
          <motion.h1
            className="font-black text-6xl md:text-8xl tracking-tighter text-[#F9FAFB]"
          >
            Nurunyolu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="mt-6 max-w-2xl text-xl text-white/80"
          >
            İslam'ın ışığında, Kuran ve Sünnetin rehberliğinde bir yolculuk.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3 }}
            className="mt-8"
          >
            <Button
              size="lg"
              variant="outline"
              className="rounded-full bg-white/10 text-white backdrop-blur-sm border-white/20 hover:bg-white/20 hover:text-white"
              onClick={() => document.getElementById("main-content")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Play className="mr-2 h-5 w-5" />
              Keşfet
            </Button>
          </motion.div>
        </div>

        <button
          onClick={toggleMute}
          className="absolute top-6 right-6 text-white/70 hover:text-white z-20"
        >
          {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </section>

        <main id="main-content" className="flex-grow container mx-auto px-4 py-16 md:py-24">
          {/* Main Article Section */}
          <section className="mb-16 md:mb-24">
            <ScrollAnimationWrapper>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary flex items-center justify-center gap-3">
                  <BookOpen className="w-8 h-8"/>
                  Kuran Mucizeleri
                </h2>
                <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
                  Kuran-ı Kerim'in bilimsel ve edebi mucizelerini keşfedin.
                </p>
              </div>
            </ScrollAnimationWrapper>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <ScrollAnimationWrapper>
                  <article className="group relative mx-auto w-full max-w-2xl h-full overflow-hidden rounded-2xl border border-border/30 bg-background/70 shadow-2xl shadow-black/5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/10 dark:border-border/60 dark:bg-background/50 dark:shadow-white/5">
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
                              <Link href={`/posts/kuran-da-evrenin-genislemesi-mucizesi`}>
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
                </ScrollAnimationWrapper>
                <ScrollAnimationWrapper delay={0.2}>
                   <article className="group relative mx-auto w-full max-w-2xl h-full overflow-hidden rounded-2xl border border-border/30 bg-background/70 shadow-2xl shadow-black/5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/10 dark:border-border/60 dark:bg-background/50 dark:shadow-white/5">
                      {/* Image as background */}
                      <Image
                        src={secondArticle.image}
                        alt={secondArticle.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint="mountain range"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

                      {/* Content */}
                      <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-7">
                        <div>
                          <h2 className="text-2xl font-semibold tracking-tight text-white">
                            {secondArticle.title}
                          </h2>
                          <p className="mt-2 text-sm text-white/80">
                              Kuran'da dağların sadece sabit yapılar olmadığı, aynı zamanda hareket halinde oldukları bildirilmiştir. Bu olguyu jeolojik kanıtlarla inceliyoruz.
                          </p>
                        </div>
                        <footer className="mt-6 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
                            <Clock className="h-3.5 w-3.5" />
                            Tahmini okuma süresi: {secondArticle.readTime} dakika
                          </span>
                          <Button asChild size="sm" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-sm ring-1 ring-white/20 transition-all hover:bg-white/20 active:scale-95">
                              <Link href={`/posts/daglarin-hareket-halinde-olmasi`}>
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
                </ScrollAnimationWrapper>
             </div>
             <ScrollAnimationWrapper className="text-center mt-12">
                <Button asChild variant="outline" size="lg">
                    <Link href="/kuran-mucizeleri">
                        Daha Fazlasını Gör
                        <ArrowUpRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
             </ScrollAnimationWrapper>
          </section>

          {/* Hadith Section */}
          <section className="mb-16 md:mb-24">
            <ScrollAnimationWrapper>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary flex items-center justify-center gap-3">
                  <Sparkles className="w-8 h-8"/>
                  Hadislerdeki Mucizeler
                </h2>
                <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
                  Peygamber Efendimiz'in (S.A.V) hadis-i şeriflerinde asırlar önce işaret ettiği bilimsel gerçekler.
                </p>
              </div>
            </ScrollAnimationWrapper>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ScrollAnimationWrapper>
                  <article className="group relative mx-auto w-full max-w-2xl h-full overflow-hidden rounded-2xl border border-border/30 bg-background/70 shadow-2xl shadow-black/5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/10 dark:border-border/60 dark:bg-background/50 dark:shadow-white/5">
                      <Image
                        src={hadithArticle1.image}
                        alt={hadithArticle1.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint="honey herbal medicine"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                      <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-7">
                        <div>
                          <h2 className="text-2xl font-semibold tracking-tight text-white">
                            {hadithArticle1.title}
                          </h2>
                          <p className="mt-2 text-sm text-white/80">
                            Peygamber Efendimiz'in (S.A.V) tavsiye ettiği ve modern tıbbın da faydalarını onayladığı şifalı yöntemler.
                          </p>
                        </div>
                        <footer className="mt-6 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
                            <Clock className="h-3.5 w-3.5" />
                            Tahmini okuma süresi: {hadithArticle1.readTime} dakika
                          </span>
                          <Button asChild size="sm" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-sm ring-1 ring-white/20 transition-all hover:bg-white/20 active:scale-95">
                              <Link href={`/posts/tibbi-nebevi`}>
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
                </ScrollAnimationWrapper>
                <ScrollAnimationWrapper delay={0.2}>
                   <article className="group relative mx-auto w-full max-w-2xl h-full overflow-hidden rounded-2xl border border-border/30 bg-background/70 shadow-2xl shadow-black/5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/10 dark:border-border/60 dark:bg-background/50 dark:shadow-white/5">
                      <Image
                        src={hadithArticle2.image}
                        alt={hadithArticle2.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint="dates fruit"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                      <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-7">
                        <div>
                          <h2 className="text-2xl font-semibold tracking-tight text-white">
                            {hadithArticle2.title}
                          </h2>
                          <p className="mt-2 text-sm text-white/80">
                             Hadislerde övülen ve bilimsel olarak da zengin besin değerleri kanıtlanmış olan hurmanın mucizevi faydaları.
                          </p>
                        </div>
                        <footer className="mt-6 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
                            <Clock className="h-3.5 w-3.5" />
                            Tahmini okuma süresi: {hadithArticle2.readTime} dakika
                          </span>
                          <Button asChild size="sm" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-sm ring-1 ring-white/20 transition-all hover:bg-white/20 active:scale-95">
                              <Link href={`/posts/hurmanin-faydalari`}>
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
                </ScrollAnimationWrapper>
             </div>
             <ScrollAnimationWrapper className="text-center mt-12">
                <Button asChild variant="outline" size="lg">
                    <Link href="/hadis-mucizeleri">
                        Daha Fazlasını Gör
                        <ArrowUpRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
             </ScrollAnimationWrapper>
          </section>

          {/* Islamic Blogs Section */}
          <section className="mb-16 md:mb-24">
            <ScrollAnimationWrapper>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary flex items-center justify-center gap-3">
                  <Edit3 className="w-8 h-8"/>
                  İslami Bloglar
                </h2>
                <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
                  İslam'ı anlama ve yaşama yolculuğunuzda size rehber olacak yazılar.
                </p>
              </div>
            </ScrollAnimationWrapper>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ScrollAnimationWrapper>
                  <article className="group relative mx-auto w-full max-w-2xl h-full overflow-hidden rounded-2xl border border-border/30 bg-background/70 shadow-2xl shadow-black/5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/10 dark:border-border/60 dark:bg-background/50 dark:shadow-white/5">
                      <Image
                        src={blogArticle1.image}
                        alt={blogArticle1.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint="patience concept"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                      <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-7">
                        <div>
                          <h2 className="text-2xl font-semibold tracking-tight text-white">
                            {blogArticle1.title}
                          </h2>
                          <p className="mt-2 text-sm text-white/80">
                            Hayatın zorlukları karşısında bir mü'minin en güçlü sığınağı olan sabrın faziletleri ve hayata yansımaları.
                          </p>
                        </div>
                        <footer className="mt-6 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
                            <Clock className="h-3.5 w-3.5" />
                            Tahmini okuma süresi: {blogArticle1.readTime} dakika
                          </span>
                          <Button asChild size="sm" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-sm ring-1 ring-white/20 transition-all hover:bg-white/20 active:scale-95">
                              <Link href={`/posts/sabr-onemi`}>
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
                </ScrollAnimationWrapper>
                <ScrollAnimationWrapper delay={0.2}>
                   <article className="group relative mx-auto w-full max-w-2xl h-full overflow-hidden rounded-2xl border border-border/30 bg-background/70 shadow-2xl shadow-black/5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/10 dark:border-border/60 dark:bg-background/50 dark:shadow-white/5">
                      <Image
                        src={blogArticle2.image}
                        alt={blogArticle2.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint="giving charity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                      <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-7">
                        <div>
                          <h2 className="text-2xl font-semibold tracking-tight text-white">
                            {blogArticle2.title}
                          </h2>
                          <p className="mt-2 text-sm text-white/80">
                             İslam'ın toplumsal dayanışma ve yardımlaşma temellerinden biri olan infakın manası ve önemi.
                          </p>
                        </div>
                        <footer className="mt-6 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
                            <Clock className="h-3.5 w-3.5" />
                            Tahmini okuma süresi: {blogArticle2.readTime} dakika
                          </span>
                          <Button asChild size="sm" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-sm ring-1 ring-white/20 transition-all hover:bg-white/20 active:scale-95">
                              <Link href={`/posts/infak-kulturu`}>
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
                </ScrollAnimationWrapper>
             </div>
             <ScrollAnimationWrapper className="text-center mt-12">
                <Button asChild variant="outline" size="lg">
                    <Link href="/islami-bloglar">
                        Daha Fazlasını Gör
                        <ArrowUpRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
             </ScrollAnimationWrapper>
          </section>

          <section className="relative isolate mb-24 md:mb-32">
            
            <ScrollAnimationWrapper>
              {/* Başlık */}
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight text-foreground">
                  ✨ Popüler Konular
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                  Kuran’ın en çok okunan ve tartışılan mucizelerini keşfetmeye hazır mısın?
                </p>
              </div>

              {/* Asimetrik 3-lü grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Hero kart (sol üst) */}
                <div className="md:col-span-2 md:row-span-2 group relative isolate flex aspect-[16/10] overflow-hidden rounded-3xl border border-border/30 bg-background/70 shadow-2xl backdrop-blur-md transition-all duration-500 hover:shadow-[0_0_60px_-15px_hsl(var(--accent)/.7)] dark:border-border/50">
                  <Image
                    src={mainArticle.image}
                    alt={mainArticle.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint="galaxy stars"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Arapça kalligrafi overlay (sol alt) */}
                  <div className="absolute bottom-4 left-4 text-8xl font-kufi text-white/10 select-none">
                    ﭑ
                  </div>
                  <div className="relative z-10 flex flex-col justify-end p-8">
                    <span className="w-fit inline-flex items-center gap-2 rounded-full bg-amber-400/20 py-1 text-xs font-semibold text-amber-200 backdrop-blur-sm">
                      <Star className="w-3.5 h-3.5" />
                      En Çok Okunan
                    </span>
                    <h3 className="mt-3 text-3xl font-bold text-white">
                      {mainArticle.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm text-white/80">
                      Evrenin genişlemesi mucizesi: Kuran 1400 yıl önce Zariyat Suresi’nde
                      haber verdi.
                    </p>
                    <footer className="mt-6 flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-xs text-white/70">
                        <Clock className="h-4 w-4" />
                        {mainArticle.readTime} dk okuma
                      </span>
                      <Button
                        asChild
                        size="lg"
                        className="rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20 hover:bg-white/20"
                      >
                        <Link href={`/posts/kuran-da-evrenin-genislemesi-mucizesi`}>
                          Yazıyı Oku
                          <ArrowUpRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </footer>
                  </div>
                  {/* Parallax shine */}
                  <div className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100" />
                </div>

                {/* Kart-2 */}
                <div className="group relative isolate flex aspect-square overflow-hidden rounded-3xl border border-border/30 bg-background/70 shadow-xl backdrop-blur-md transition-all duration-500 hover:shadow-[0_0_50px_-15px_hsl(var(--accent)/.5)] dark:border-border/50">
                  <Image
                    src={secondArticle.image}
                    alt={secondArticle.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint="mountain range"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="relative z-10 flex flex-col justify-end p-5">
                    <h4 className="text-xl font-semibold text-white">
                      Dağların Hareketi
                    </h4>
                    <p className="mt-2 text-xs text-white/80 leading-relaxed">
                      Kuran, dağların yeryüzünde sabit kazıklar olmasının yanı sıra, birer bulut gibi hareket ettiklerini de bildirir.
                    </p>
                    <p className="mt-1 text-xs text-white/80">
                      {secondArticle.readTime} dk okuma
                    </p>
                  </div>
                </div>

                {/* Kart-3 */}
                <div className="group relative isolate flex aspect-square overflow-hidden rounded-3xl border border-border/30 bg-background/70 shadow-xl backdrop-blur-md transition-all duration-500 hover:shadow-[0_0_50px_-15px_hsl(var(--accent)/.5)] dark:border-border/50">
                  <Image
                    src={thirdArticle.image}
                    alt={thirdArticle.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint="embryo"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="relative z-10 flex flex-col justify-end p-5">
                    <h4 className="text-xl font-semibold text-white">
                      Embriyo Aşamaları
                    </h4>
                    <p className="mt-2 text-xs text-white/80 leading-relaxed">
                      Modern bilimin asırlar sonra keşfettiği insanın anne karnındaki gelişim aşamaları, Kuran'da detaylarıyla anlatılır.
                    </p>
                    <p className="mt-1 text-xs text-white/80">
                      {thirdArticle.readTime} dk okuma
                    </p>
                  </div>
                </div>
              </div>

              {/* Alt CTA */}
              <div className="text-center mt-16">
                <Button
                  asChild
                  size="lg"
                  variant="default"
                  className="group rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Link href="/kuran-mucizeleri">
                    Tüm Mucizeleri Keşfet
                    <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:rotate-45" />
                  </Link>
                </Button>
              </div>
            </ScrollAnimationWrapper>
          </section>

          <ScrollAnimationWrapper>
            <DidYouKnowSection />
          </ScrollAnimationWrapper>

          {/* Newsletter */}
          <section>
            <ScrollAnimationWrapper>
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
            </ScrollAnimationWrapper>
          </section>

        </main>

        <footer className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 via-transparent to-transparent blur-3xl" />
          <div className="container mx-auto text-center text-muted-foreground">
            <Sparkles className="mx-auto mb-4 h-12 w-12 text-yellow-300" />
            <p className="text-sm">© {new Date().getFullYear()} Nurunyolu</p>
          </div>
        </footer>
      </div>
    </>
  );
}
