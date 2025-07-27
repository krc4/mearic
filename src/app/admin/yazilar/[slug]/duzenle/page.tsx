
"use client"
import Link from "next/link"
import { notFound } from 'next/navigation';
import {
  ChevronLeft,
  Upload,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
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

export default function EditPostPage({ params }: { params: { slug: string } }) {
  const allPosts = [mainArticle, ...mockPosts];
  const post = allPosts.find((p) => p.slug === params.slug);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category);
    }
  }, [post]);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/admin/yazilar">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Geri</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Yazıyı Düzenle
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm">
            Değişiklikleri Kaydet
          </Button>
          <Button size="sm">Yayınla</Button>
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
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3">
                        <Card className="overflow-hidden">
                            <CardContent className="flex items-center justify-center p-6">
                                <label htmlFor="cover-image-input" className="flex flex-col items-center gap-2 cursor-pointer text-center">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Resim Yükle</span>
                                    <span className="text-xs text-muted-foreground">PNG, JPG, WEBP (Maks. 2MB)</span>
                                    <Input id="cover-image-input" type="file" className="sr-only" />
                                </label>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
       <div className="flex items-center justify-center gap-2 md:hidden">
          <Button variant="outline" size="sm">
            Değişiklikleri Kaydet
          </Button>
          <Button size="sm">Yayınla</Button>
        </div>
    </div>
  )
}
