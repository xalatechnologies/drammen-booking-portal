
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

interface DescriptionTabProps {
  description: string;
  capacity: number;
  quickFacts: React.ReactNode;
}

export function DescriptionTab({ description, capacity, quickFacts }: DescriptionTabProps) {
  return (
    <div className="p-6 space-y-8">
      {/* Quick facts */}
      {quickFacts}

      <div>
        <h2 className="text-2xl font-semibold mb-6">Om lokalet</h2>
        <p className="text-lg text-gray-700 leading-relaxed">{description}</p>
      </div>
      
      <Card className="p-6">
        <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          Egnet for
        </h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.25px] text-base py-2 px-4 font-medium">Idrett</Badge>
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.25px] text-base py-2 px-4 font-medium">Trening</Badge>
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.25px] text-base py-2 px-4 font-medium">Arrangementer</Badge>
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.25px] text-base py-2 px-4 font-medium">Grupper</Badge>
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.25px] text-base py-2 px-4 font-medium">Dans</Badge>
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.25px] text-base py-2 px-4 font-medium">Ballsport</Badge>
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.25px] text-base py-2 px-4 font-medium">Presentasjoner</Badge>
        </div>
      </Card>
    </div>
  );
}
