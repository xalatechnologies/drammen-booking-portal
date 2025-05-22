
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const FacilityGrid = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 relative">
              <img 
                src={`https://images.unsplash.com/photo-1577301886662-26e1b2e2a00b?auto=format&fit=crop&w=600&q=80`} 
                alt="Facility" 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-1">Gymsal {i} - Brandengen skole</h3>
              <p className="text-sm text-gray-500 mb-2">Knoffs gate 8, Drammen</p>
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-medium">Neste ledige tid:</span> I dag, 18:00
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-700 border-blue-200"
                  onClick={() => navigate(`/facilities/${i}`)}
                >
                  Se detaljer →
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FacilityGrid;
