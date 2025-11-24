
'use client';
import Image from 'next/image';
import { Clock, ArrowUpRight, Bot, BookOpen, Star, HeartPulse, Edit3, Volume2, VolumeX, Play, Sparkles, ArrowRight, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReadingProgressBar } from '@/components/reading-progress-bar';
import Link from 'next/link';
import { DidYouKnowSection } from '@/components/did-you-know';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, Suspense } from 'react';
import { ScrollAnimationWrapper } from '@/components/ScrollAnimationWrapper';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { HeroBackground } from '@/components/hero-background';


const SectionSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
    <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
  </div>
)

export default function Home() {
  
  const handleDiscoverClick = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <ReadingProgressBar />
      <div className="flex flex-col min-h-screen">
        <Header />

        {/* Hero Section */}
        <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
            <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
                <HeroBackground />
            </Suspense>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="font-black text-6xl md:text-8xl tracking-tighter text-[#F9FAFB] drop-shadow-2xl"
                >
                    Mearic
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mt-6 max-w-2xl text-xl text-white/80 drop-shadow-lg"
                >
                    İslam'ın ışığında, Kuran ve Sünnetin rehberliğinde bir yolculuk.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4, type: "spring" }}
                    className="mt-8"
                >
                    <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full bg-white/10 text-white backdrop-blur-sm border-white/20 hover:bg-white/20 hover:text-white"
                    onClick={handleDiscoverClick}
                    >
                    <Play className="mr-2 h-5 w-5" />
                    Keşfet
                    </Button>
                </motion.div>
            </div>
        </section>

        <main id="main-content" className="flex-grow container mx-auto px-4 py-16 md:py-24">
          <section className="mb-16 md:mb-24">
            <ScrollAnimationWrapper>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary flex items-center justify-center gap-3">
                  <Star className="w-8 h-8"/>
                  Öne Çıkan Keşifler
                </h2>
                <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
                  En çok okunan ve ilham veren içeriklerimizi keşfedin.
                </p>
              </div>
            </ScrollAnimationWrapper>
            
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <ScrollAnimationWrapper>
                  <article className="group relative mx-auto w-full h-full overflow-hidden rounded-2xl border border-border/30 bg-card shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
                      <Image
                          src="https://images.unsplash.com/photo-1593863435837-95b8a2455b55?q=80&w=2070&auto=format&fit=crop"
                          alt="Kuran Mucizeleri"
                          width={600}
                          height={800}
                          className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-105"
                          data-ai-hint="quran book"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-primary">Kuran Mucizeleri</h3>
                        <p className="mt-2 text-muted-foreground line-clamp-3">
                          1400 yıl önce bildirilmiş bilimsel, sayısal ve edebi mucizeleri keşfet.
                        </p>
                        <Button asChild variant="link" className="p-0 mt-4">
                              <Link href="/kuran-mucizeleri">
                                  Daha Fazla
                                  <ArrowRight className="ml-1.5 h-4 w-4" />
                              </Link>
                          </Button>
                      </div>
                  </article>
                </ScrollAnimationWrapper>
                <ScrollAnimationWrapper delay={0.2}>
                   <article className="group relative mx-auto w-full h-full overflow-hidden rounded-2xl border border-border/30 bg-card shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
                      <Image
                          src="https://images.unsplash.com/photo-1585128993422-b4a835593166?q=80&w=1974&auto=format&fit=crop"
                          alt="Hadis Mucizeleri"
                          width={600}
                          height={800}
                          className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-105"
                          data-ai-hint="desert prayer"
                      />
                       <div className="p-6">
                        <h3 className="text-xl font-bold text-primary">Hadis Mucizeleri</h3>
                        <p className="mt-2 text-muted-foreground line-clamp-3">
                           Peygamber Efendimiz'in (S.A.V) asırlar önce işaret ettiği bilimsel gerçekler.
                        </p>
                         <Button asChild variant="link" className="p-0 mt-4">
                              <Link href="/hadis-mucizeleri">
                                  Daha Fazla
                                  <ArrowRight className="ml-1.5 h-4 w-4" />
                              </Link>
                          </Button>
                      </div>
                  </article>
                </ScrollAnimationWrapper>
                 <ScrollAnimationWrapper delay={0.4}>
                   <article className="group relative mx-auto w-full h-full overflow-hidden rounded-2xl border border-border/30 bg-card shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
                      <Image
                          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop"
                          alt="İslami Bloglar"
                          width={600}
                          height={800}
                          className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-105"
                          data-ai-hint="islamic calligraphy art"
                      />
                       <div className="p-6">
                        <h3 className="text-xl font-bold text-primary">İslami Bloglar</h3>
                        <p className="mt-2 text-muted-foreground line-clamp-3">
                           İslam'ı anlama ve yaşama yolculuğunuzda size rehber olacak yazılar.
                        </p>
                         <Button asChild variant="link" className="p-0 mt-4">
                              <Link href="/islami-bloglar">
                                  Daha Fazla
                                  <ArrowRight className="ml-1.5 h-4 w-4" />
                              </Link>
                          </Button>
                      </div>
                  </article>
                </ScrollAnimationWrapper>
             </div>
          </section>

          <ScrollAnimationWrapper>
            <DidYouKnowSection />
          </ScrollAnimationWrapper>

          {/* Social Media Section */}
          <section className="mb-16 md:mb-24">
            <ScrollAnimationWrapper>
              <Card className="bg-primary/10 border-primary/20">
                <CardContent className="p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="text-center lg:text-left">
                    <h3 className="flex items-center justify-center lg:justify-start gap-3 text-2xl font-bold text-primary">
                      <HeartPulse className="w-7 h-7"/>
                      <span>Sosyal Medyada Bizi Takip Edin</span>
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-lg">
                      Topluluğumuza katılın, en son içeriklerden, duyurulardan ve ilham verici paylaşımlardan ilk siz haberdar olun.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button asChild variant="outline" className="rounded-full">
                        <a href="https://www.instagram.com/mecmaul.bahreyn/" target="_blank" rel="noopener noreferrer">
                            <Instagram className="mr-2 h-4 w-4"/>
                            Instagram
                        </a>
                    </Button>
                     <Button asChild variant="outline" className="rounded-full">
                        <a href="https://www.youtube.com/@mecmaulbahreyn/videos" target="_blank" rel="noopener noreferrer">
                            <Youtube className="mr-2 h-4 w-4"/>
                            YouTube
                        </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          </section>

        </main>

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