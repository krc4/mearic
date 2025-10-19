
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState, useEffect } from "react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (password?: string) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  requiresPassword?: boolean;
}

export function DeleteConfirmationDialog({ 
  isOpen, 
  onOpenChange, 
  onConfirm,
  title = "Emin misiniz?",
  description = "Bu işlem geri alınamaz. Bu veriyi kalıcı olarak silecektir.",
  confirmText = "Sil",
  requiresPassword = false
}: DeleteConfirmationDialogProps) {
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(requiresPassword ? password : undefined);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {requiresPassword && (
          <div className="space-y-2">
            <Label htmlFor="password-confirm">Devam etmek için lütfen şifrenizi girin.</Label>
            <Input 
              id="password-confirm"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction 
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleConfirm}
            disabled={requiresPassword && !password}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

    