
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
import { addPost, PostPayload } from "@/lib/firebase/services";
import { Editor } from "@/components/editor";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import Link from "next/link";
import { Send } from "lucide-react";

interface NewTopicDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const topicSchema = z.object({
  title: z.string().min(5, { message: "Başlık en az 5 karakter olmalıdır." }),
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

    const newTopicPayload: PostPayload = {
      title: data.title,
      content: content,
      category: "Forum",
      description: content.substring(0, 150),
      readTime: Math.ceil(content.split(" ").length / 200),
      image: "https://placehold.co/1280x720.png", // Placeholder image
    };

    try {
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
                <Label htmlFor="content">İçerik</Label>
                <Editor onUpdate={setContent} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                   {isSubmitting ? "Gönderiliyor..." : "Konu Aç"}
                </Button>
              </DialogFooter>
            </form>
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
