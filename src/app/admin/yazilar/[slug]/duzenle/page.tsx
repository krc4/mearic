
"use client"
import Link from "next/link"
import { notFound, useRouter, useParams } from 'next/navigation';
import {
  ChevronLeft,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Editor } from "@/components/editor"
import { type Post } from "@/lib/posts";
import { getPostBySlug, updatePost, PostPayload } from "@/lib/firebase/services"
import { useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [readTime, setReadTime] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      setLoading(true);
      const fetchedPost = await getPostBySlug(slug);
      if (fetchedPost) {
        setPost(fetchedPost);
        setTitle(fetchedPost.title);
        setContent(fetchedPost.content);
        setCategory(fetchedPost.category);
        setImageUrl(fetchedPost.image);
        setDescription(fetchedPost.description);
        setReadTime(fetchedPost.readTime);
      } else {
        notFound();
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  const handlePublish = async () => {
    if (!post || !user) {
         toast({
          title: "Hata!",
          description: "Bu işlemi yapmak için giriş yapmalısınız.",
          variant: "destructive"
       });
        return;
    };

    const updatedPayload: Partial<PostPayload> = {
        title,
        content,
        category,
        image: imageUrl,
        description,
        readTime
    };

    const { success, message } = await updatePost(post.id, user.uid, updatedPayload);

    if (success) {
      toast({
          title: "Yazı Başarıyla Güncellendi!",
          description: "Değişiklikleriniz kaydedildi.",
      });
      const categorySlug = {
          "Kuran Mucizeleri": "kuran-mucizeleri",
          "Hadis Mucizeleri": "hadis-mucizeleri",
          "İslami Bloglar": "islami-bloglar"
      }[category] || "kuran-mucizeleri";
      
      const newSlug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      router.push(`/admin/yazilar/${newSlug}/duzenle`); // Navigate to the new slug after update
      router.refresh(); // Refresh the page to reflect changes
    } else {
       toast({
          title: "Hata!",
          description: message,
          variant: "destructive"
       });
    }
  }

  const categorySlug = {
    "Kuran Mucizeleri": "kuran-mucizeleri",
    "Hadis Mucizeleri": "hadis-mucizeleri",
    "İslami Bloglar": "islami-bloglar"
  }[post?.category || ""] || "kuran-mucizeleri";


  if (loading) {
      return (
        <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-6 w-40" />
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px]">
                <div className="grid auto-rows-max items-start gap-4">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-full" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                               <Skeleton className="h-10 w-full" />
                               <Skeleton className="h-40 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                 <div className="grid auto-rows-max items-start gap-4">
                     <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent>
                           <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent>
                           <Skeleton className="h-10 w-full" />
                           <Skeleton className="h-40 w-full mt-2" />
                        </CardContent>
                    </Card>
                 </div>
            </div>
        </div>
      )
  }

  if (!post) {
    // This case should ideally be handled by the notFound() in useEffect, but as a fallback:
    return notFound();
  }
  
  const isUrlValid = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href={`/admin/${categorySlug}`}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Geri</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Yazıyı Düzenle
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button size="sm" onClick={handlePublish}>Değişiklikleri Kaydet</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-3">
            <Card>
            <CardHeader>
                <CardTitle>Yazı Detayları</CardTitle>
                <CardDescription>
                Yazınızın başlığını ve içeriğini düzenleyin. Editör Markdown formatını desteklemektedir.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="title">Başlık</Label>
                    <Input
                    id="title"
                    type="text"
                    className="w-full"
                    placeholder="Yazı başlığını buraya girin..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                 <div className="grid gap-3">
                    <Label htmlFor="description">Açıklama</Label>
                    <Input
                    id="description"
                    type="text"
                    className="w-full"
                    placeholder="Kısa bir açıklama girin..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="content">İçerik</Label>
                    <Editor initialContent={content} onUpdate={setContent} />
                </div>
                </div>
            </CardContent>
            </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-4">
                <Card>
                <CardHeader>
                    <CardTitle>Kategori</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="category">Kategori</Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger id="category" aria-label="Kategori Seç">
                              <SelectValue placeholder="Kategori Seç" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Kuran Mucizeleri">Kuran Mucizeleri</SelectItem>
                              <SelectItem value="Hadis Mucizeleri">Hadis Mucizeleri</SelectItem>
                              <SelectItem value="İslami Bloglar">İslami Bloglar</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="readTime">Okuma Süresi (dk)</Label>
                        <Input
                            id="readTime"
                            type="number"
                            className="w-full"
                            value={readTime}
                            onChange={(e) => setReadTime(Number(e.target.value))}
                        />
                    </div>
                    </div>
                </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Başlık Resmi</CardTitle>
                        <CardDescription>
                            Yazı için bir resim URL'si girin.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3">
                            <Label htmlFor="imageUrl">Resim URL'si</Label>
                            <Input
                                id="imageUrl"
                                type="url"
                                placeholder="https://ornek.com/resim.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                            {isUrlValid(imageUrl) && (
                                <div className="relative aspect-video w-full overflow-hidden rounded-md mt-2">
                                    <Image 
                                        src={imageUrl} 
                                        alt="Resim Önizlemesi" 
                                        fill 
                                        className="object-cover"
                                        onError={(e) => e.currentTarget.style.display = 'none'}
                                    />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
       <div className="flex items-center justify-center gap-2 md:hidden">
          <Button size="sm" onClick={handlePublish}>Değişiklikleri Kaydet</Button>
        </div>
    </div>
  )
}
