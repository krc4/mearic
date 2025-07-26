"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useComingSoonPopup } from "@/hooks/use-coming-soon-popup";
import { Construction, Sparkles } from "lucide-react";

export function ComingSoonPopup() {
  const { isOpen, setIsOpen, popupContent } = useComingSoonPopup();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Construction className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            {popupContent.title}
          </DialogTitle>
        </DialogHeader>
        <div className="text-center text-muted-foreground mt-2 space-y-4">
          <p>
            {popupContent.content}
          </p>
          <p className="flex items-center justify-center gap-2 font-semibold text-primary">
            <Sparkles className="w-4 h-4" />
            <span>Harika özellikler yolda...</span>
          </p>
          <p className="text-sm font-kufi text-primary/70">
            صبر جميل والله المستعان
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setIsOpen(false)}>Anladım</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
