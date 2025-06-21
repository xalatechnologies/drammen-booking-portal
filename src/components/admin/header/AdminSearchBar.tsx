
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/useTranslation";

const AdminSearchBar = () => {
  const { tSync } = useTranslation();

  return (
    <div className="flex-1 flex justify-center px-8">
      <div className="flex items-center gap-4 w-full max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder={tSync("admin.header.searchPlaceholder", "Search all content...")} 
            className="pl-10 h-9 text-sm bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 rounded-lg" 
            aria-label={tSync("admin.header.searchPlaceholder", "Search the system")} 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSearchBar;
