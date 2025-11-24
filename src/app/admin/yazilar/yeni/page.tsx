
"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  Upload,
} from "lucide-react"
import mammoth from "mammoth"
import * as pdfjs from "pdfjs-dist"

// Set worker source for pdfjs
if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}


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
import { useState, ChangeEvent } from "react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { addPost, type PostPayload } from "@/lib/firebase/services"
import { useAuth } from "@/hooks/use-auth"
import { marked } from "marked";

export default function NewPostPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('## Yazı içeriği buraya gelecek...');

  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePublish = async () => {
    if (!title || !category || !imageUrl || !description || !content) {
        toast({
            title: "Eksik Alanlar",
            description: "Lütfen tüm alanları doldurun.",
            variant: "destructive",
        });
        return;
    }
    
    if (!user) {
        toast({
            title: "Yetkilendirme Hatası",
            description: "Yazı yayınlamak için giriş yapmış olmalısınız.",
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
        content, // Content is already in Markdown format
        author: user.displayName || "Mearic Ekibi",
        authorId: user.uid,
        authorPhotoURL: user.photoURL || "https://github.com/shadcn.png" 
    };

    try {
        const { success, message, postId } = await addPost(newPost);

        if (success && postId) {
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
                description: message,
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
  
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const fileType = file.type;
    
    // Convert HTML to Markdown
    const htmlToMarkdown = async (html: string) => {
        const { TurndownService } = await import('turndown');
        const turndownService = new TurndownService();
        return turndownService.turndown(html);
    };

    if (fileType === "text/plain" || fileType === 'text/markdown') {
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        setContent(fileContent);
        toast({ title: "İçerik Yüklendi", description: "Metin dosyası başarıyla editöre aktarıldı." });
      };
      reader.readAsText(file);
    } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") { // .docx
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        try {
          const result = await mammoth.convertToHtml({ arrayBuffer });
          const markdownContent = await htmlToMarkdown(result.value);
          setContent(markdownContent);
          toast({ title: "İçerik Yüklendi", description: "Word dosyası başarıyla editöre aktarıldı." });
        } catch (error) {
          console.error("Error converting docx to html", error);
          toast({ title: "Word Dosyası Hatası", description: "Dosya dönüştürülürken bir hata oluştu.", variant: "destructive" });
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (fileType === "application/pdf") {
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        try {
          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => 'str' in item ? item.str : '').join(" ");
            fullText += pageText + "\n\n";
          }
          setContent(fullText); // PDF text is plain, so it's fine as Markdown
          toast({ title: "İçerik Yüklendi", description: "PDF dosyası başarıyla editöre aktarıldı." });
        } catch (error) {
          console.error("Error reading pdf file", error);
          toast({ title: "PDF Dosyası Hatası", description: "Dosya okunurken bir hata oluştu.", variant: "destructive" });
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast({
        title: "Geçersiz Dosya Türü",
        description: "Lütfen sadece .txt, .md, .pdf, .doc veya .docx uzantılı bir dosya seçin.",
        variant: "destructive",
      });
    }

    // Reset file input to allow uploading the same file again
    e.target.value = '';
  };


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
          <Button variant="outline" size="sm">
            Taslak Olarak Kaydet
          </Button>
          <Button size="sm" onClick={handlePublish}>Yayınla</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-3">
            <Card>
            <CardHeader>
                <CardTitle>Yazı Detayları</CardTitle>
                <CardDescription>
                Yazınızın başlığını ve içeriğini girin. Dilerseniz içerik için bir dosya yükleyebilirsiniz. Editör Markdown formatını desteklemektedir.
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
                        <div className="flex justify-between items-center">
                            <Label htmlFor="content">İçerik</Label>
                            <Label htmlFor="file-upload" className="cursor-pointer text-sm font-medium text-primary hover:underline flex items-center gap-1">
                                <Upload className="h-3 w-3"/>
                                Dosya Yükle (.txt, .md, .pdf, .docx)
                            </Label>
                             <Input 
                                id="file-upload" 
                                type="file" 
                                className="hidden"
                                accept=".txt,.md,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={handleFileChange}
                            />
                        </div>
                        <Editor initialContent={content} onUpdate={(md) => setContent(md)} />
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
      </div>
       <div className="flex items-center justify-center gap-2 md:hidden">
          <Button variant="outline" size="sm">
            Taslak Olarak Kaydet
          </Button>
          <Button size="sm" onClick={handlePublish}>Yayınla</Button>
        </div>
    </div>
  )
}
