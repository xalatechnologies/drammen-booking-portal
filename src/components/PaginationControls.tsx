
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationControls: React.FC = () => {
  return (
    <div className="flex justify-center items-center gap-4">
      <Button variant="outline" size="sm">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Forrige
      </Button>
      <span className="text-sm text-muted-foreground">Side 1 av 3</span>
      <Button variant="outline" size="sm">
        Neste
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

export default PaginationControls;
