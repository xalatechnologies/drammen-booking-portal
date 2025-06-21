
import React from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  actions,
  className = ""
}) => {
  return (
    <header className={`flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8 ${className}`}>
      <div className="flex-grow">
        <h1 id="page-title" className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
          {title}
        </h1>
        <p className="text-xl text-gray-700 leading-relaxed max-w-4xl">
          {description}
        </p>
      </div>
      {actions && (
        <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0 flex items-center gap-4">
          {actions}
        </div>
      )}
    </header>
  );
};

export default PageHeader;
