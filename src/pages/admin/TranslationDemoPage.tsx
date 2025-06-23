import React from 'react';
import TranslationDemo from '@/components/admin/TranslationDemo';

/**
 * Translation Demo Page
 * 
 * This page demonstrates the new JSON-based translation system.
 */
const TranslationDemoPage: React.FC = () => {
  return (
    <div className="container py-6">
      <TranslationDemo />
    </div>
  );
};

export default TranslationDemoPage;
