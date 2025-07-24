import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { cn } from '@/lib/utils';
import { Clock, ArrowUpRight } from 'lucide-react';

interface PostCardProps {
  post: Post;
  orientation?: 'vertical' | 'horizontal';
  compact?: boolean;
}

export function PostCard({ post, orientation = 'vertical', compact = false }: PostCardProps) {
  if (orientation === 'vertical') {
    return (
      <Link href="#" className="group block bg-card rounded-lg overflow-hidden shadow-lg dark:shadow-none transition-all duration-300 hover:shadow-xl dark:hover:shadow-none hover:-translate-y-1">
        <div className="overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            width={300}
            height={200}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={post.id === 2 ? "desert sand" : "mountain sky"}
          />
        </div>
        <div className="p-4">
          <h4 className="text-md font-bold leading-snug group-hover:text-primary transition-colors">{post.title}</h4>
          <p className="text-sm text-muted-foreground mt-2 flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            {post.readTime} dakika okuma
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href="#" className="group flex items-center gap-4 transition-all duration-200 hover:bg-accent/50 p-2 rounded-md">
      <div className="flex-shrink-0">
        <Image
          src={post.image}
          alt={post.title}
          width={compact ? 48 : 80}
          height={compact ? 48 : 80}
          className={cn(
            "object-cover rounded-md",
             compact ? "w-12 h-12" : "w-20 h-20"
          )}
          data-ai-hint={post.id === 4 ? "earth space" : "human brain"}
        />
      </div>
      <div>
        <h4 className={cn("font-semibold leading-snug group-hover:text-primary transition-colors", compact ? "text-sm" : "text-md")}>{post.title}</h4>
        {!compact && 
            <p className="text-sm text-muted-foreground mt-1 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                {post.readTime} dakika okuma
            </p>
        }
      </div>
       <ArrowUpRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
