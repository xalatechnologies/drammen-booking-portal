export const LAYOUT_CONSTANTS = {
  // Spacing - keeping original values
  PAGE_PADDING: "py-8",
  SECTION_SPACING: "space-y-8",
  CARD_SPACING: "space-y-6",
  
  // Background
  PAGE_BACKGROUND: "bg-gray-50",
  CARD_BACKGROUND: "bg-white",
  
  // Layout dimensions - keeping original values
  SIDEBAR_WIDTH: "20rem", // 320px
  HEADER_HEIGHT: "4rem", // 64px
  
  // Typography - keeping original values
  PAGE_TITLE: "text-3xl font-bold text-gray-900",
  PAGE_DESCRIPTION: "text-gray-600 mt-2",
  SECTION_TITLE: "text-xl font-semibold text-gray-900",
  
  // Cards and containers
  CARD_STYLES: "shadow-lg border-0",
  CARD_CONTENT: "p-6",
  
  // Form styles
  FORM_ACTIONS: "border-t border-gray-200 bg-gray-50 px-6 py-4",
  FORM_BUTTON_SPACING: "flex justify-end space-x-4",
  
  // States
  LOADING_STATE: "flex items-center justify-center py-12",
  EMPTY_STATE: "text-center py-12 text-gray-500",
  ERROR_STATE: "text-center py-12",
  
  // Responsive
  RESPONSIVE_GRID: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  RESPONSIVE_CONTAINER: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
} as const;
