"use client";




import { SettingsModal } from "@/components/settings";
import { useEffect, useState } from "react";


export const SettingsModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    })

    if (!isMounted) {
        return null;
    }

    return (
        <>
          <SettingsModal/>
        </>
    );
};