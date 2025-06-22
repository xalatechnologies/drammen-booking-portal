import React from 'react';
import { RouteObject } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { FacilitiesListPage } from './pages/FacilitiesListPage';
import { FacilityFormPage } from './pages/FacilityFormPage';
import { FacilityManagementPage } from './pages/FacilityManagementPage';

/**
 * Backoffice Facility Feature Routes
 * 
 * Following Single Responsibility Principle by separating admin routes
 * from public-facing facility routes.
 * 
 * Following Open/Closed Principle by allowing extension of admin routes
 * without modifying public facility routes.
 */
export const backofficeRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'facilities',
        children: [
          {
            index: true,
            element: <FacilitiesListPage />
          },
          {
            path: 'new',
            element: <FacilityFormPage />
          },
          {
            path: ':id',
            element: <FacilityFormPage />
          },
          {
            path: 'management',
            element: <FacilityManagementPage />
          }
        ]
      }
    ]
  }
];
