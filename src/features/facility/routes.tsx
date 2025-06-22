import React from 'react';
import { RouteObject } from 'react-router-dom';
import FacilityDetailPage from './pages/FacilityDetail';

/**
 * Facility feature routes configuration
 * 
 * Following Single Responsibility Principle by containing only facility-specific routes
 * This allows for better organization and maintainability of the routing system
 */
export const facilityRoutes: RouteObject[] = [
  {
    // New route structure with proper path parameters
    path: '/facilities/:id',
    element: <FacilityDetailPage />
  }
];

export default facilityRoutes;
