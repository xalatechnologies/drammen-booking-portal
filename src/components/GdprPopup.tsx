
import React from "react";
import { GdprBanner } from "./gdpr/GdprBanner";
import { GdprPreferencesModal } from "./gdpr/GdprPreferencesModal";

const GdprPopup = () => {
  return (
    <>
      <GdprBanner />
      <GdprPreferencesModal />
    </>
  );
};

export default GdprPopup;
