import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLocalization } from "@/core/localization/hooks/useLocalization";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

/**
 * NotFound Page Component
 * 
 * Following Single Responsibility Principle by focusing only on 404 error display
 * Following Open/Closed principle by using localization for extension without modification
 */
const NotFound = () => {
  const location = useLocation();
  const { translate } = useLocalization();

  // Log the 404 error for analytics and debugging
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-5xl font-bold mb-4 text-red-500">404</h1>
        <p className="text-xl text-gray-600 mb-6">{translate('common.pageNotFound')}</p>
        <p className="text-gray-500 mb-6">{translate('common.pageNotFoundMessage')}</p>
        <Button asChild className="flex items-center gap-2">
          <Link to="/">
            <Home className="w-4 h-4" />
            {translate('common.returnToHome')}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
