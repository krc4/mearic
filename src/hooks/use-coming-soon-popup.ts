import { create } from 'zustand';

interface PopupContent {
  title: string;
  content: string;
}

interface ComingSoonPopupState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  popupContent: PopupContent;
  setPopupContent: (content: PopupContent) => void;
}

export const useComingSoonPopup = create<ComingSoonPopupState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  popupContent: { title: "", content: "" },
  setPopupContent: (popupContent) => set({ popupContent }),
}));
