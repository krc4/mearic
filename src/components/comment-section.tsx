"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, Send } from "lucide-react"

const mockComments = [
  {
    id: 1,
    author: "Ahmet Yılmaz",
    avatar: "https://placehold.co/40x40/EFEFEF/333333.png?text=AY",
    date: "2 gün önce",
    text: "Subhanallah, ne büyük bir mucize! Kuran'ın her ayeti üzerinde tefekkür ettikçe insanın imanı daha da artıyor. Bu değerli paylaşım için teşekkür ederim.",
  },
  {
    id: 2,
    author: "Fatma Kaya",
    avatar: "https://placehold.co/40x40/D8B4FE/FFFFFF.png?text=FK",
    date: "1 gün önce",
    text: "Gerçekten de bilim ve Kuran arasındaki bu uyumu görmek hayranlık verici. Evrenin genişlediği bilgisinin 1400 yıl önce bildirilmesi, aklı olan için büyük bir delil.",
  },
  {
    id: 3,
    author: "Mustafa Demir",
    avatar: "https://placehold.co/40x40/A7F3D0/333333.png?text=MD",
    date: "5 saat önce",
    text: "Paylaşım çok güzel ve bilgilendirici olmuş. Bu tür konuların daha fazla insana ulaşması gerekiyor. Emeğinize sağlık.",
  },
];


export function CommentSection() {
    const { toast } = useToast()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const comment = formData.get('comment');
        if (comment) {
            toast({
                title: "Yorumunuz için teşekkürler!",
                description: "Yorumunuz başarıyla gönderildi ve incelendikten sonra yayınlanacaktır.",
            })
            e.currentTarget.reset();
        } else {
            toast({
                title: "Hata",
                description: "Lütfen yorumunuzu girin.",
                variant: "destructive"
            })
        }
    }

  return (
    <section className="w-full py-12">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">
                Yorumlar ({mockComments.length})
            </h2>
        </div>

        <Card className="shadow-lg border-border/30">
          <form onSubmit={handleSubmit}>
            <CardHeader className="flex flex-row items-start gap-4 p-4">
              <Avatar>
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
              <div className="w-full space-y-2">
                <Textarea
                    name="comment"
                    placeholder="Düşüncelerinizi paylaşın..."
                    className="min-h-[100px] resize-y"
                />
              </div>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex justify-end">
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" />
                Yorum Yap
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="space-y-6">
          {mockComments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={comment.avatar} alt={comment.author} />
                <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{comment.author}</p>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground">{comment.date}</p>
                </div>
                <p className="text-sm text-foreground/90">
                  {comment.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
