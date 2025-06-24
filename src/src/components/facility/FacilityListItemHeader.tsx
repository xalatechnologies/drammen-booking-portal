import React from "react";

interface FacilityListItemHeaderProps {
  facilityName: string;
  isFavorited: boolean;
  onFavorite: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
}

export function FacilityListItemHeader({
  facilityName,
  isFavorited,
  onFavorite,
  onShare
}: FacilityListItemHeaderProps) {
  // This component is no longer used as we've moved all content to FacilityListItemContent
  // Keeping it for backward compatibility but it's essentially empty now
  return null;
}
