
import React from "react";
import { HeroBanner } from "@/components/HeroBanner";
import { FacilityTypeGrid } from "@/components/FacilityTypeGrid";
import { GlobalHeader } from "@/components/GlobalHeader";
import { GlobalFooter } from "@/components/GlobalFooter";
import { useFacilities } from "@/hooks/useFacilities";
import { LoadingState } from "@/components/layouts/LoadingState";
import { ErrorState } from "@/components/layouts/ErrorState";

const Index = () => {
  const { data: facilities, isLoading, error } = useFacilities();

  console.log('Index page - facilities loading:', isLoading);
  console.log('Index page - facilities data:', facilities);
  console.log('Index page - facilities error:', error);

  return (
    <div className="min-h-screen">
      <GlobalHeader />
      <HeroBanner />
      
      <main className="container mx-auto px-4 py-8">
        {isLoading && <LoadingState />}
        
        {error && (
          <ErrorState 
            title="Unable to load facilities"
            message="Please try refreshing the page or check back later."
          />
        )}
        
        {!isLoading && !error && (
          <FacilityTypeGrid facilities={facilities || []} />
        )}
      </main>
      
      <GlobalFooter />
    </div>
  );
};

export default Index;
