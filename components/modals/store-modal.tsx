"use client"

import { useStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "@/components/modal"

export const StoreModal = () => {
    const StoreModal = useStoreModal(); 

    return (
    <Modal 
    title="Criar loja"
    description="adicione uma nova loja para adicional produtos e categorias"
    isOpen={StoreModal.isOpen}
    onClose={StoreModal.onClose}
    >
        Form
    </Modal>
    );
};