import React from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8">
      <div className="flex-grow">
        <h1 id="page-title" className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          {title}
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed max-w-4xl">
          {description}
        </p>
      </div>
      {actions && <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0 flex items-center gap-2">{actions}</div>}
    </header>
  );
};

export default PageHeader; 