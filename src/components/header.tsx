'use client';
import Link from 'next/link';
import { Search, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import { useComingSoonPopup } from '@/hooks/use-coming-soon-popup';

export function Header() {
  const { setPopupContent, setIsOpen } = useComingSoonPopup();

  const handleForumClick = () => {
    setPopupContent({
      title: "Forum Çok Yakında!",
      content: "Topluluğumuzla bir araya geleceğiniz, fikir alışverişinde bulunacağınız ve sorularınızı sorabileceğiniz interaktif forum bölümümüzü hazırlıyoruz."
    });
    setIsOpen(true);
  }

  const handleBlogsClick = () => {
    setPopupContent({
      title: "Bloglar Çok Yakında!",
      content: "İslam'ı anlama ve yaşama yolculuğunuzda size rehber olacak, güncel ve özgün yazıların yer alacağı blog bölümümüzü hazırlıyoruz."
    });
    setIsOpen(true);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">Nurunyolu</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/kuran-mucizeleri"
              className="transition-colors hover:text-primary text-foreground"
            >
              Kuran Mucizeleri
            </Link>
            <Link
              href="/hadis-mucizeleri"
              className="transition-colors hover:text-primary text-foreground"
            >
              Hadislerdeki Mucizeler
            </Link>
            <Button
              variant="link"
              onClick={handleBlogsClick}
              className="transition-colors hover:text-primary text-foreground/60 p-0"
            >
              İslami Bloglar
            </Button>
            <Button
              variant="link"
              onClick={handleForumClick}
              className="transition-colors hover:text-primary text-foreground/60 p-0"
            >
              Forum
            </Button>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="relative w-full max-w-sm hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Sitede ara..."
              className="pl-9 bg-secondary"
            />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
