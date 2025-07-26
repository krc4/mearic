import { create } from 'zustand';

interface ForumSoonPopupState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useForumSoonPopup = create<ForumSoonPopupState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
