'use client';
import { Twitter, Facebook, Linkedin, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from "@/hooks/use-toast"

export function SocialShare() {
  const { toast } = useToast()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Başarılı!",
      description: "Yazı linki panoya kopyalandı.",
    })
  };

  return (
    <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground hidden sm:block">Paylaş:</p>
      <Button variant="outline" size="icon" onClick={() => window.open('https://twitter.com/intent/tweet?url=' + window.location.href, '_blank')}>
        <Twitter className="h-4 w-4" />
        <span className="sr-only">Twitter'da Paylaş</span>
      </Button>
      <Button variant="outline" size="icon" onClick={() => window.open('https://www.facebook.com/sharer/sharer.php?u=' + window.location.href, '_blank')}>
        <Facebook className="h-4 w-4" />
        <span className="sr-only">Facebook'ta Paylaş</span>
      </Button>
      <Button variant="outline" size="icon" onClick={() => window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + window.location.href, '_blank')}>
        <Linkedin className="h-4 w-4" />
        <span className="sr-only">LinkedIn'de Paylaş</span>
      </Button>
      <Button variant="outline" size="icon" onClick={copyToClipboard}>
        <Copy className="h-4 w-4" />
        <span className="sr-only">Linki Kopyala</span>
      </Button>
    </div>
  );
}
