# Administration Portal

This document provides an overview of the Administration Portal for the Drammen Booking Portal. The portal is a comprehensive suite of tools designed for administrators to manage, monitor, and configure every aspect of the application.

## Overview

The Admin Portal is a secure, role-based area of the application that provides access to a wide range of administrative functions. It is built with a consistent and intuitive layout, ensuring that administrators can efficiently manage the platform.

The core principles of the Admin Portal are:
- **Centralized Management:** A single place to manage all core data, including facilities, users, bookings, and roles.
- **Role-Based Access Control (RBAC):** The `AdminRoleProvider` ensures that administrators only see the tools and data relevant to their assigned role, enhancing security and usability.
- **Scalability:** The modular design, with each function in its own page component, allows for easy addition of new administrative features.
- **Monitoring & Auditing:** Includes dedicated pages for monitoring system health, viewing audit logs, and generating reports.

## Core Components & Layout

The entire Admin Portal is wrapped in a consistent `AdminLayout` component, which defines the primary user interface structure.

```mermaid
graph TD
    A[Admin Page (e.g., FacilityManagement)] --> B[AdminLayout];
    B --> C[AdminRoleProvider];
    B --> D[SidebarProvider];
    B --> E[AdminHeader];
    B --> F[AdminSidebar];
    B --> G[Main Content Area];
    
    subgraph AdminLayout
        direction TB
        C
        D
        E
        F
        G
    end
    
    A --> G

    F -- "Navigation Links" --> A
```

### Component Breakdown:

1.  **`AdminLayout`**: The foundational layout for the entire portal. It establishes a fixed header and a fixed sidebar, creating a consistent user experience across all admin pages.
2.  **`AdminRoleProvider`**: A crucial context provider that likely fetches and distributes the current administrator's role and permissions. This allows components throughout the admin portal to conditionally render UI elements based on those permissions.
3.  **`AdminHeader`**: The top bar of the portal, containing global actions, user information (e.g., admin's name), and potentially notifications or a search bar.
4.  **`AdminSidebar`**: The primary navigation component. It contains a list of links to all the available admin pages, likely organized into logical groups (e.g., Management, Configuration, Monitoring). The links displayed may also be controlled by the `AdminRoleProvider`.
5.  **Admin Pages (`pages/admin/*.tsx`)**: Each file in this directory represents a distinct tool or management screen. These are the components that get rendered in the main content area when a user clicks a link in the `AdminSidebar`.

## Key Admin Pages & Features

The `pages/admin` directory contains a wide array of features. Here is a summary of some of the key functionalities:

### Core Data Management
- **`Dashboard.tsx`**: The landing page for the admin portal, likely providing a high-level overview with key metrics and quick links.
- **`FacilityManagement.tsx`**: A comprehensive interface for CRUD (Create, Read, Update, Delete) operations on facilities. This is likely one of the most complex admin pages, allowing management of zones, pricing, availability, and more.
- **`BookingsOverview.tsx`**: Allows administrators to view, search, and manage all bookings in the system. This might include actions like approving, modifying, or canceling bookings.
- **`UsersRoles.tsx`**: The central point for user management. Admins can invite, edit, and assign roles to users.

### Configuration & Workflow
- **`ApprovalWorkflows.tsx`**: A powerful feature for defining custom approval chains for bookings, essential for managing facilities that require manual confirmation.
- **`SystemConfiguration.tsx`**: A page for setting global application parameters, such as default booking settings, notification preferences, and feature flags.
- **`AuthProvidersPage.tsx`**: For configuring third-party authentication methods (e.g., Google, Azure AD).
- **`IntegrationsPage.tsx`**: To manage connections with external systems, such as payment gateways or calendar services (`ExchangeIntegrationPage`, `ExternalCalendars.tsx`).

### Monitoring & Analytics
- **`AuditLogsPage.tsx`**: A critical security feature that provides a chronological record of all significant actions taken within the application, such as who booked what and when, or which admin changed a setting.
- **`ReportsAnalytics.tsx`**: A tool for generating reports and visualizing data related to bookings, revenue, facility usage, and user activity.
- **`MonitoringPage.tsx`**: Displays the real-time health and performance of the system.

This well-structured and feature-rich admin portal provides the necessary tools to effectively operate the Drammen Booking Portal platform. 