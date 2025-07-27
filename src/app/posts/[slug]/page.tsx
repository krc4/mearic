import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { mockPosts, mainArticle } from "@/lib/posts";
import { Header } from "@/components/header";
import { ReadingProgressBar } from "@/components/reading-progress-bar";
import { Badge } from "@/components/ui/badge";
import { Clock, Tag, Home, ChevronRight } from "lucide-react";
import styles from "@/app/page.module.css";
import { SocialShare } from "@/components/social-share";
import { CommentSection } from "@/components/comment-section";

type PostPageProps = {
  params: {
    slug: string;
  };
};

export default function PostPage({ params }: PostPageProps) {
  const allPosts = [mainArticle, ...mockPosts.map(p => ({...p, id: p.slug}))];
  const post = allPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <ReadingProgressBar />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative h-[50vh] flex items-end justify-center text-white overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              data-ai-hint="post image"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            <div className="relative z-10 container mx-auto px-4 pb-12 text-center">
              <Badge className="mb-4">{post.category}</Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
                {post.title}
              </h1>
              <div className="mt-4 flex items-center justify-center gap-4 text-white/80">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.readTime} dakika okuma süresi
                </span>
                <span className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4" />
                  {post.category}
                </span>
              </div>
            </div>
          </section>

          <div className="container mx-auto max-w-4xl px-4">
            {/* Breadcrumb */}
            <nav className="py-6 text-sm text-muted-foreground">
              <ol className="list-none p-0 inline-flex items-center">
                <li className="flex items-center">
                  <Link href="/" className="hover:text-primary">
                    <Home className="h-4 w-4" />
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-1" />
                </li>
                <li className="flex items-center">
                  <Link href={`/${post.category.toLowerCase().replace(/ /g, "-")}`} className="hover:text-primary">
                    {post.category}
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-1" />
                </li>
                <li className="truncate" style={{ maxWidth: "200px" }}>
                  <span className="text-foreground">{post.title}</span>
                </li>
              </ol>
            </nav>

            {/* Article Content */}
            <article
              className={`prose prose-lg dark:prose-invert max-w-none pb-12 ${styles.articleContent}`}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <hr className="my-8" />

            {/* Social Share */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-12">
              <SocialShare />
            </div>

            {/* Comments Section */}
            <CommentSection />

            {/* Footer */}
            <footer className="text-center py-16 text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Nurunyolu. Tüm hakları saklıdır.</p>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}
