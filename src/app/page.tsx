'use client';
import Image from 'next/image';
import { Clock, ArrowRight, HeartPulse, Star, Sparkles, ChevronsDown } from 'lucide-react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReadingProgressBar } from '@/components/reading-progress-bar';
import Link from 'next/link';
import { DidYouKnowSection } from '@/components/did-you-know';
import { ScrollAnimationWrapper } from '@/components/ScrollAnimationWrapper';
import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import type * as THREE from 'three';
import { motion } from 'framer-motion';

function Stars(props: any) {
  const ref = useRef<THREE.Points>(null!);
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.2 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function HeroBackground() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Suspense fallback={null}>
                    <Stars />
                </Suspense>
            </Canvas>
        </div>
    );
}

export default function Home() {

  const handleEnter = () => {
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <ReadingProgressBar />
      <Header />
      
      {/* HERO SECTION - REPLACES LANDING PAGE */}
      <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-black text-white">
        <HeroBackground />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                className="font-cinzel text-5xl md:text-7xl font-extrabold tracking-widest"
                style={{
                    color: 'transparent',
                    background: 'linear-gradient(135deg, #ffffff 20%, #e0e0e0 50%, #a9a9a9 80%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    textShadow: '0 0 30px rgba(255, 255, 255, 0.3)'
                }}
            >
                MEARİC
            </motion.h1>

            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                className="h-0.5 bg-gradient-to-r from-transparent via-white to-transparent my-5"
            />

            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
                className="font-amiri text-lg md:text-2xl text-gray-300 max-w-2xl"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
            >
                "İslam'ın ışığında, Kuran ve Sünnetin rehberliğinde ebedi bir yolculuk."
            </motion.p>
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 2, ease: "easeOut" }}
             >
                <Button 
                    onClick={handleEnter} 
                    variant="outline"
                    className="mt-10 bg-white/5 border-white/40 text-white font-cinzel text-lg tracking-widest uppercase rounded-sm backdrop-blur-sm transition-all duration-400 ease-in-out
                               hover:bg-white/10 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 hover:tracking-[4px] group"
                >
                    Bismillah
                </Button>
            </motion.div>
        </div>
         <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 2.5, duration: 1.5 }}
             className="absolute bottom-10 animate-bounce"
         >
            <ChevronsDown className="w-8 h-8 text-white/70" />
        </motion.div>
      </section>

      <div id="main-content" className="bg-background">
        <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
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
                          src="https://picsum.photos/seed/1/600/800"
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
                          src="https://picsum.photos/seed/2/600/800"
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
                          src="https://picsum.photos/seed/3/600/800"
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
                            Instagram
                        </a>
                    </Button>
                      <Button asChild variant="outline" className="rounded-full">
                        <a href="https://www.youtube.com/@mecmaulbahreyn/videos" target="_blank" rel="noopener noreferrer">
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
