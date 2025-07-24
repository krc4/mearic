import Image from 'next/image';
import { Clock, Rss, ArrowUpRight } from 'lucide-react';
import { mockPosts, mainArticle } from '@/lib/posts';
import { Header } from '@/components/header';
import { PostCard } from '@/components/post-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReadingProgressBar } from '@/components/reading-progress-bar';
import { SocialShare } from '@/components/social-share';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <>
      <ReadingProgressBar />
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Sidebar */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-28">
                <h3 className="text-xl font-bold mb-6 text-foreground">
                  Son Yazılar
                </h3>
                <div className="space-y-6">
                  {mockPosts.slice(0, 3).map((post) => (
                    <PostCard key={post.id} post={post} orientation="vertical" />
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="col-span-12 lg:col-span-6">
              <article className="prose prose-stone dark:prose-invert max-w-none">
                <Card className="overflow-hidden transition-shadow hover:shadow-xl duration-300">
                  <CardContent className="p-0">
                    <div className="relative w-full h-[400px]">
                       <Image
                        src={mainArticle.image}
                        alt={mainArticle.title}
                        fill
                        className="object-cover"
                        data-ai-hint="galaxy stars"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                       <div className="absolute bottom-6 left-6 md:left-8">
                        <Badge variant="secondary" className="mb-2">{mainArticle.category}</Badge>
                         <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight text-white">
                          {mainArticle.title}
                        </h1>
                         <div className="flex items-center text-sm text-white/80">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Tahmini okuma süresi: {mainArticle.readTime} dakika</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <div className="p-6 md:p-8">
                    <div
                      className="space-y-6 text-lg text-foreground/90"
                      dangerouslySetInnerHTML={{ __html: mainArticle.content }}
                    />
                    
                    <Separator className="my-8" />

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="https://placehold.co/48x48" alt="Admin" data-ai-hint="man portrait"/>
                          <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">Admin</p>
                          <p className="text-sm text-muted-foreground">Nurunyolu Editörü</p>
                        </div>
                      </div>
                      <SocialShare />
                    </div>
                  </div>
                </Card>
              </article>
            </main>

            {/* Right Sidebar */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-28 space-y-8">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Popüler Yazılar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {mockPosts.slice(3, 6).map((post) => (
                        <PostCard key={post.id} post={post} orientation="horizontal" compact={true}/>
                    ))}
                  </CardContent>
                </Card>
                 <Card className="bg-primary/10 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-primary">
                      <Rss className="w-6 h-6"/>
                      <span>Bültenimize Katılın</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      En son yazılardan ve gelişmelerden haberdar olmak için abone olun.
                    </p>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Abone Ol <ArrowUpRight className="w-4 h-4 ml-2"/>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>

        </div>

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