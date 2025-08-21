
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { addPost, PostPayload, getUserDoc } from "@/lib/firebase/services";
import { Editor } from "@/components/editor";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import Link from "next/link";
import { Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem } from "./ui/form";


interface NewTopicDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const topicSchema = z.object({
  title: z.string().min(5, { message: "Başlık en az 5 karakter olmalıdır." }),
  imageUrl: z.string().url({ message: "Lütfen geçerli bir resim URL'si girin." }).min(1, "Resim URL'si boş bırakılamaz."),
  tag: z.string({ required_error: "Lütfen bir kategori seçin." }),
});

type TopicFormValues = z.infer<typeof topicSchema>;

export function NewTopicDialog({ isOpen, onOpenChange }: NewTopicDialogProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
    },
  });

   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (data: TopicFormValues) => {
    if (!user) {
         toast({
            title: "Giriş Gerekli",
            description: "Konu açmak için lütfen giriş yapın.",
            variant: "destructive",
        });
        return;
    }
    
    if (!content || content.length < 20) {
      toast({
        title: "Eksik İçerik",
        description: "Konu içeriği en az 20 karakter olmalıdır.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    try {
      // Get the most up-to-date user data from Firestore
      const userDoc = await getUserDoc(user.uid);
      const displayName = userDoc?.displayName || user.displayName || 'Anonim';
      const photoURL = userDoc?.photoURL || user.photoURL || `https://api.dicebear.com/7.x/thumbs/svg?seed=${user.uid}`;

      const newTopicPayload: PostPayload = {
        title: data.title,
        content: content,
        category: "Forum",
        description: content.substring(0, 150),
        readTime: Math.ceil(content.split(" ").length / 200),
        image: data.imageUrl,
        author: displayName,
        authorId: user.uid,
        authorPhotoURL: photoURL,
        tags: [data.tag]
      };

      const postId = await addPost(newTopicPayload);
      if (postId) {
        toast({
          title: "Konu Başarıyla Açıldı!",
          description: "Yeni konunuz forumda yayınlandı.",
        });
        onOpenChange(false);
        form.reset();
        setContent("");
        router.refresh();
      } else {
        throw new Error("Post ID could not be retrieved.");
      }
    } catch (error) {
      console.error("Error creating new topic:", error);
      toast({
        title: "Hata",
        description: "Konu oluşturulurken bir sorun oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Yeni Konu Başlat</DialogTitle>
          <DialogDescription>
            Toplulukla paylaşmak istediğiniz bir konu veya soru girin.
          </DialogDescription>
        </DialogHeader>
        {authLoading ? (
            <p>Yükleniyor...</p>
        ) : user ? (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Başlık</Label>
                <Input
                  id="title"
                  placeholder="Konu başlığını buraya yazın..."
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
               <div className="grid gap-2">
                <Label htmlFor="imageUrl">Kapak Resmi URL'si</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://ornek.com/resim.jpg"
                  {...form.register("imageUrl")}
                />
                {form.formState.errors.imageUrl && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.imageUrl.message}
                  </p>
                )}
              </div>
                <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Kategori</Label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Bir kategori seçin..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Teknoloji">Teknoloji</SelectItem>
                          <SelectItem value="Kuran">Kuran</SelectItem>
                          <SelectItem value="Tarih">Tarih</SelectItem>
                          <SelectItem value="Genel">Genel</SelectItem>
                          <SelectItem value="Diğer">Diğer</SelectItem>
                        </SelectContent>
                      </Select>
                       {form.formState.errors.tag && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.tag.message}
                        </p>
                        )}
                    </FormItem>
                  )}
                />
              <div className="grid gap-2">
                <Label htmlFor="content">İçerik</Label>
                <Editor onUpdate={setContent} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                   {isSubmitting ? "Gönderiliyor..." : "Konu Aç"}
                </Button>
              </DialogFooter>
            </form>
            </Form>
        ) : (
             <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Konu açabilmek için lütfen giriş yapın veya kayıt olun.</p>
                <div className="flex justify-center gap-4">
                    <Button asChild>
                        <Link href="/giris">
                            <Send className="mr-2 h-4 w-4"/> Giriş Yap
                        </Link>
                    </Button>
                     <Button asChild variant="outline">
                        <Link href="/kayit">Kayıt Ol</Link>
                    </Button>
                </div>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
