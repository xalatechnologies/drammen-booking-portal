
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BookingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#0B3D91] py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/97431924-b9fd-4ccd-b558-a9e90506c716.png" alt="Drammen Kommune Logo" className="h-10 w-auto" />
            <h1 className="text-2xl font-bold text-white">DRAMMEN KOMMUNE</h1>
          </div>
          <div className="text-white text-xl">Booking System</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => window.location.href = "/"}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Button>
        
        <h2 className="text-3xl font-bold mb-6">My Bookings</h2>
        
        <div className="bg-white rounded-md shadow p-6 text-center">
          <p className="text-gray-500">You haven't made any bookings yet.</p>
          <Button 
            className="mt-4 bg-[#1EAEDB] hover:bg-[#33C3F0]"
            onClick={() => window.location.href = "/"}
          >
            Book a facility
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-4 px-6 border-t">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900">
              Privacy policy
            </Button>
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900">
              Contact support
            </Button>
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900">
              Booking guidelines
            </Button>
          </div>
          <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900">
            English
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default BookingsPage;
