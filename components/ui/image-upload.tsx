"use client";

import { Button } from "@/components/ui/button";
import { ImagePlusIcon, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useTheme } from "next-themes";

interface ImageUploadProps {
  disable?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  onRemove,
  value,
  disable,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) return null;

  const paletteDark = {
    window: "#1e1e1e",
    sourceBg: "#2e2e2e",
    windowBorder: "#000000",
    tabIcon: "#FFFFFF",
    textDark: "#FFFFFF",
    link: "#00BFFF",
    action: "#FF620C",
    inactiveTabIcon: "#888888",
    error: "#F44235",
    inProgress: "#0078FF",
    complete: "#20B832",
    progressCircle: "#0078FF",
    browseButton: "#FF620C",
  };

  const paletteLight = {
    window: "#FFFFFF",
    sourceBg: "#F5F5F5",
    windowBorder: "#DDDDDD",
    tabIcon: "#000000",
    textDark: "#000000",
    link: "#0078FF",
    action: "#0078FF",
    inactiveTabIcon: "#888888",
    error: "#F44235",
    inProgress: "#0078FF",
    complete: "#20B832",
    progressCircle: "#0078FF",
    browseButton: "#0078FF",
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget
        onSuccess={onUpload}
        uploadPreset="eccomercepreset"
        options={{
          styles: {
            palette: theme === "dark" ? paletteDark : paletteLight,
          },
        }}
      >
        {({ open }) => {
          const onClick = () => open?.();
          return (
            <Button
              type="button"
              disabled={disable}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlusIcon className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
