
import React from "react";
import { Heading4 } from "@/components/common/Typography";

const Logo = () => {
  return (
    <div className="flex items-center gap-md">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-sm">DC</span>
      </div>
      <Heading4 className="text-foreground font-bold">
        Drammen Kommune
      </Heading4>
    </div>
  );
};

export default Logo;
