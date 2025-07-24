'use client';
import { Facebook, Copy, ShieldAlert } from 'lucide-react';
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

  const handleReport = () => {
    toast({
      title: "Bildiriminiz Alındı",
      description: "İçeriği inceleyip gerekli aksiyonları alacağız. Teşekkür ederiz.",
      variant: "destructive"
    })
  }

  return (
    <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground hidden sm:block">Paylaş:</p>
      <Button variant="outline" size="icon" onClick={() => window.open('https://www.facebook.com/sharer/sharer.php?u=' + window.location.href, '_blank')}>
        <Facebook className="h-4 w-4" />
        <span className="sr-only">Facebook'ta Paylaş</span>
      </Button>
      <Button variant="outline" size="icon" onClick={copyToClipboard}>
        <Copy className="h-4 w-4" />
        <span className="sr-only">Linki Kopyala</span>
      </Button>
      <Button variant="outline" size="icon" onClick={handleReport}>
        <ShieldAlert className="h-4 w-4" />
        <span className="sr-only">Şikayet Et</span>
      </Button>
    </div>
  );
}
