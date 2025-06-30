import { create } from "zustand";

interface useStoreModalBuyer {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useBuyerModal = create<useStoreModalBuyer>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen : true}),
    onClose: () => set({ isOpen: false }),
}));