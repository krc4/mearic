import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

interface PostCardProps {
  post: Post;
  orientation?: 'vertical' | 'horizontal';
  compact?: boolean;
}

export function PostCard({ post, orientation = 'vertical', compact = false }: PostCardProps) {
  if (orientation === 'vertical') {
    return (
      <Link href="#" className="group block">
        <div className="overflow-hidden rounded-lg">
          <Image
            src={post.image}
            alt={post.title}
            width={300}
            height={200}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={post.id === 2 ? "desert sand" : "mountain sky"}
          />
        </div>
        <div className="mt-3">
          <h4 className="text-md font-headline font-semibold leading-snug group-hover:text-primary transition-colors">{post.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{post.readTime} dakika okuma</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href="#" className="group flex items-center gap-4">
      <div className="flex-shrink-0">
        <Image
          src={post.image}
          alt={post.title}
          width={compact ? 64 : 80}
          height={compact ? 64 : 80}
          className={cn(
            "object-cover rounded-md transition-transform duration-300 group-hover:scale-105",
             compact ? "w-16 h-16" : "w-20 h-20"
          )}
          data-ai-hint={post.id === 4 ? "earth space" : "human brain"}
        />
      </div>
      <div>
        <h4 className={cn("font-headline font-semibold leading-snug group-hover:text-primary transition-colors", compact ? "text-sm" : "text-md")}>{post.title}</h4>
        {!compact && <p className="text-sm text-muted-foreground mt-1">{post.readTime} dakika okuma</p>}
      </div>
    </Link>
  );
}
