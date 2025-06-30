"use client";

import { Modal } from "../modal";
import { useBuyerModal } from "@/hooks/use-buyer-modal";
import { BuyerForm } from "@/app/(admin)/dashboard/buyers/[buyerId]/_components/buyer-form"; // ou outro caminho

export const BuyerModal = () => {
  const settingsModal = useBuyerModal();

  return (
    <Modal
      title="Novo cliente"
      description=""
      isOpen={settingsModal.isOpen}
      onClose={settingsModal.onClose}
    >
      <BuyerForm initialData={null} isModal/>
    </Modal>
  );
};