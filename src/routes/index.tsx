import React from 'react';
import { RouteObject } from 'react-router-dom';
import facilityRoutes from '@/features/facility/routes';

// Legacy routes imports
import Index from "@/pages/Index";
import BookingPage from "@/pages/booking/[facilityId]";
import BookingsPage from "@/pages/bookings/index";
import { BookingSuccessPage } from "@/components/facility/booking/BookingSuccessPage";
import LoginPage from "@/pages/LoginSelection";
import ProfilePage from "@/pages/profile/index";
import SettingsPage from "@/pages/settings/index";

// Admin page imports would go to backoffice feature later
import AdminDashboard from "@/pages/admin/Dashboard";

// 404 Page
import NotFound from "@/pages/NotFound";

/**
 * Application routes configuration
 * 
 * Following Open/Closed Principle by allowing extension (adding new feature routes)
 * without modifying existing code.
 * 
 * Following Single Responsibility Principle by delegating route configuration
 * to individual features.
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Index />
  },
  
  // These routes will be migrated to feature-based structure in future work
  {
    path: '/booking/:facilityId',
    element: <BookingPage />
  },
  {
    path: '/bookings',
    element: <BookingsPage />
  },
  {
    // Using a render function to extract params from state when navigating
    path: '/booking-success',
    element: <BookingSuccessPage bookingReference="" facilityId="" />
    // In a real application, this would use useLocation to extract state passed during navigation
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/profile',
    element: <ProfilePage />
  },
  {
    path: '/settings',
    element: <SettingsPage />
  },
  {
    path: '/admin/*',
    element: <AdminDashboard />
  },
  
  // 404 route
  {
    path: '*',
    element: <NotFound />
  },
  
  // Feature-based routes - these are combined at the root level
  // This allows individual features to define their own routes
  ...facilityRoutes,
];

export default routes;
