
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/useTranslation";

const AdminSearchBar = () => {
  const { tSync } = useTranslation();

  return (
    <div className="flex-1 flex justify-center px-12">
      <div className="flex items-center gap-6 w-full max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            placeholder={tSync("admin.header.searchPlaceholder", "Search all content...")} 
            className="pl-12 h-12 text-base bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 rounded-lg" 
            aria-label={tSync("admin.header.searchPlaceholder", "Search the system")} 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSearchBar;
