
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<any>;
}

export interface ViewMode {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface SelectFilter {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onBack?: () => void;
  homePath?: string;
  homeLabel?: string;
  className?: string;
}

export interface FiltersBarProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  selectFilters?: SelectFilter[];
  children?: React.ReactNode;
  className?: string;
}

export interface ViewToggleProps {
  views: ViewMode[];
  activeView: string;
  onViewChange: (viewId: string) => void;
  className?: string;
}

export interface PageLayoutProps {
  children: React.ReactNode;
  maxWidth?: string;
  padding?: string;
  className?: string;
}

export interface DashboardLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export interface FormLayoutProps {
  title: string;
  description?: string;
  breadcrumb?: React.ReactNode;
  tabs?: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
    disabled?: boolean;
  }>;
  actions: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  children?: React.ReactNode;
}

export interface EmptyStateProps {
  icon?: React.ComponentType<any>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export interface LoadingStateProps {
  variant?: 'spinner' | 'skeleton' | 'pulse';
  message?: string;
  className?: string;
}

export interface ErrorStateProps {
  title: string;
  description?: string;
  retry?: () => void;
  className?: string;
}
