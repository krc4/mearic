'use client';
import Link from 'next/link';
import {
  LogOut,
  User as UserIcon,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useComingSoonPopup } from '@/hooks/use-coming-soon-popup';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from './ui/skeleton';

export function Header() {
  const { setPopupContent, setIsOpen } = useComingSoonPopup();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };
  
  const handleForumClick = () => {
    setPopupContent({
      title: "Forum Çok Yakında!",
      content: "Topluluğumuzla bir araya geleceğiniz, fikir alışverişinde bulunacağınız ve sorularınızı sorabileceğiniz interaktif forum bölümümüzü hazırlıyoruz."
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
             <Link
              href="/islami-bloglar"
              className="transition-colors hover:text-primary text-foreground"
            >
              İslami Bloglar
            </Link>
            <Link
              href="/forum"
              className="transition-colors hover:text-primary text-foreground/60"
            >
              Forum
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
           {loading ? (
            <Skeleton className="h-8 w-20 rounded-md" />
            ) : user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                <AvatarImage 
                                    src={user.photoURL || `https://api.dicebear.com/7.x/thumbs/svg?seed=${user.uid}`} 
                                    alt={user.displayName || user.email || ''} 
                                />
                                <AvatarFallback>{user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.displayName || "Kullanıcı"}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                         <DropdownMenuItem asChild>
                            <Link href="/admin">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Admin Paneli</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                             <UserIcon className="mr-2 h-4 w-4" />
                            <span>Profil</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                             <LogOut className="mr-2 h-4 w-4" />
                            <span>Çıkış Yap</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button asChild size="sm">
                    <Link href="/giris">Giriş Yap</Link>
                </Button>
            )}
        </div>
      </div>
    </header>
  );
}
