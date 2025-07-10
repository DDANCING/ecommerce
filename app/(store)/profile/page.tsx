"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import ImageUpload from "@/components/ui/image-upload";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SingleImageUpload from "@/components/ui/SingleImageUpload";

const OrdersPage = () => {
  const { data: session, update } = useSession();
  const userImage = session?.user?.image ?? "";
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (url: string) => {
    setLoading(true);
    await fetch("/api/user/image", {
      method: "POST",
      body: JSON.stringify({ image: url }),
      headers: { "Content-Type": "application/json" },
    });
    await update?.();
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-4 text-2xl font-bold">Profile</h2>
      <div className="flex items-center gap-6">
        <div>
          <SingleImageUpload value={userImage} onChange={handleImageChange} />
          {loading && <span>Atualizando imagem...</span>}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;