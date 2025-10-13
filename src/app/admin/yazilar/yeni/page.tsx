
"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { useState } from "react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { addPost, type PostPayload } from "@/lib/firebase/services"

export default function NewPostPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('<p>Yazı içeriği buraya gelecek...</p>');

  const router = useRouter();
  const { toast } = useToast();

  const handlePublish = async () => {
    if (!title || !category || !imageUrl || !description || !content) {
        toast({
            title: "Eksik Alanlar",
            description: "Lütfen tüm alanları doldurun.",
            variant: "destructive",
        });
        return;
    }
    
    const newPost: PostPayload = {
        title,
        category,
        image: imageUrl,
        readTime: Number(readTime),
        description,
        content,
        author: "Mearic Ekibi",
        authorId: "system-admin",
        authorPhotoURL: "https://github.com/shadcn.png" 
    };

    try {
        const postId = await addPost(newPost);

        if (postId) {
            toast({
                title: "Yazı Başarıyla Yayınlandı!",
                description: "Yeni yazınız oluşturuldu ve yayınlandı.",
            });
            const categorySlug = {
                "Kuran Mucizeleri": "kuran-mucizeleri",
                "Hadis Mucizeleri": "hadis-mucizeleri",
                "İslami Bloglar": "islami-bloglar"
            }[category] || "kuran-mucizeleri";
            router.push(`/admin/${categorySlug}`);
        } else {
             toast({
                title: "Hata",
                description: "Yazı yayınlanırken bir sorun oluştu.",
                variant: "destructive",
            });
        }
    } catch (error) {
        console.error("Error publishing post: ", error);
        toast({
            title: "Hata",
            description: "Yazı yayınlanırken bir sorun oluştu. Lütfen konsolu kontrol edin.",
            variant: "destructive",
        });
    }
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
          <Link href="/admin">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Geri</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Yeni Yazı Oluştur
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm" onClick={handlePublish}>
            Taslak Olarak Kaydet
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
                Yazınızın başlığını ve içeriğini girin.
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
                        <Editor onUpdate={(html) => setContent(html)} />
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
                        <Select onValueChange={setCategory}>
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
       <div className="flex items-center justify-center gap-2 md:hidden">
          <Button variant="outline" size="sm" onClick={handlePublish}>
            Taslak Olarak Kaydet
          </Button>
          <Button size="sm" onClick={handlePublish}>Yayınla</Button>
        </div>
    </div>
  )
}
