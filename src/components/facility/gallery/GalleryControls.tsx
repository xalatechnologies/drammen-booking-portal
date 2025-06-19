
import React from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryControlsProps {
  facilityName: string;
  onShare: (e: React.MouseEvent) => void;
}

export function GalleryControls({ facilityName, onShare }: GalleryControlsProps) {
  return (
    <div className="absolute top-6 right-6 flex gap-2">
      <Button
        variant="secondary"
        size="sm"
        className="bg-white/95 hover:bg-white text-gray-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={onShare}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
