
"use client"
import Link from "next/link"
import { notFound, useRouter } from 'next/navigation';
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
import { mockPosts, mainArticle } from "@/lib/posts";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

export default function EditPostPage({ params }: { params: { slug: string } }) {
  const allPosts = [mainArticle, ...mockPosts];
  const post = allPosts.find((p) => p.slug === params.slug);
  const router = useRouter();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category);
      setImageUrl(post.image);
    }
  }, [post]);

  const handlePublish = () => {
    // TODO: Implement actual database logic here to update the post
    console.log("Updated Post Data:", {
        title,
        content,
        category,
        imageUrl,
    });
    toast({
        title: "Yazı Başarıyla Güncellendi!",
        description: "Değişiklikleriniz kaydedildi.",
    });
    const categorySlug = {
        "Kuran Mucizeleri": "kuran-mucizeleri",
        "Hadis Mucizeleri": "hadis-mucizeleri",
        "İslami Bloglar": "islami-bloglar"
    }[category] || "kuran-mucizeleri";
    router.push(`/admin/${categorySlug}`);
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href={`/admin/${post.category.toLowerCase().replace(/ /g, '-')}`}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Geri</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Yazıyı Düzenle
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm" onClick={handlePublish}>
            Değişiklikleri Kaydet
          </Button>
          <Button size="sm" onClick={handlePublish}>Yayınla</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px]">
        <div className="grid auto-rows-max items-start gap-4">
            <Card>
            <CardHeader>
                <CardTitle>Yazı Detayları</CardTitle>
                <CardDescription>
                Yazınızın başlığını ve içeriğini düzenleyin.
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
                    <Label htmlFor="content">İçerik</Label>
                    <Editor />
                </div>
                </div>
            </CardContent>
            </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4">
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
                         {imageUrl && (
                            <div className="relative aspect-video w-full overflow-hidden rounded-md mt-2">
                                <Image 
                                    src={imageUrl} 
                                    alt="Resim Önizlemesi" 
                                    fill 
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
       <div className="flex items-center justify-center gap-2 md:hidden">
          <Button variant="outline" size="sm" onClick={handlePublish}>
            Değişiklikleri Kaydet
          </Button>
          <Button size="sm" onClick={handlePublish}>Yayınla</Button>
        </div>
    </div>
  )
}
