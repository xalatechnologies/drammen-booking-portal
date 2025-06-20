# Facility Management & Display

This document details the architecture of the Facility Management and Display features in the Drammen Booking Portal. This system is responsible for presenting detailed information about each facility, managing its availability, and providing an intuitive interface for users to initiate a booking.

## Overview

The facility detail page serves as a central hub for all information related to a specific facility. It uses a component-based architecture to build a complex layout that includes an image gallery, detailed information tabs, an availability calendar, and a persistent booking sidebar.

The core principles of this feature are:
- **Rich Information Display:** To provide users with all necessary information, including photos, amenities, location, capacity, and detailed descriptions.
- **Interactive Availability:** A visual, interactive calendar (`FacilityDetailCalendar`) allows users to see available time slots and select them directly.
- **Seamless Booking Integration:** The facility page is tightly coupled with the booking system. User selections (like time slots) on this page directly feed into the booking process.
- **Responsive Design:** A `MobileBookingPanel` ensures a good user experience on smaller devices where a persistent sidebar is not feasible.
- **Data-Driven:** The page is dynamically rendered based on data fetched from the backend using custom hooks (`useOptimizedFacility`, `useZones`).

## Core Components & Data Flow

The facility detail page is constructed from a set of modular components orchestrated by `src/pages/facilities/[id].tsx`.

```mermaid
graph TD
    A[pages/facilities/[id].tsx] --> B[useOptimizadoFacility Hook];
    A --> C[useZones Hook];
    A --> D[GlobalHeader];
    A --> E[FacilityDetailBreadcrumb];
    A --> F[FacilityDetailLayout];
    A --> G[FacilityDetailCalendar];
    A --> H[MobileBookingPanel];

    subgraph FacilityDetailLayout
        direction LR
        F1[AirBnbStyleGallery]
        F2[FacilityHeader]
        F3[FacilityInfoTabs]
        F4[EnhancedFacilitySidebar]
    end

    F --> F1
    F --> F2
    F --> F3
    F --> F4
    
    subgraph EnhancedFacilitySidebar
        direction TB
        S1[BookingPriceCalculation]
        S2[BookingDetailsSection]
    end
    
    F4 --> S1
    F4 --> S2

    subgraph FacilityDetailCalendar
        direction TB
        G1[AvailabilityTab]
        G2[RecurrenceWizard]
    end
    G --> G1
    G --> G2
    
    G1 -- "Selects Slots" --> A
    A -- "Updates" --> F4
    A -- "Updates" --> G1

```

### Component Breakdown:

1.  **`pages/facilities/[id].tsx` (Facility Detail Page)**:
    - The main container component that fetches all necessary data for the facility and its associated zones using the `useOptimisedFacility` and `useZones` hooks.
    - It manages the state for user interactions, such as selected time slots (`useSlotSelection`), and passes this state and corresponding handlers down to child components.

2.  **`FacilityDetailLayout`**:
    - A layout component that arranges the primary sections of the page: the image gallery, the main info header, the tabbed information section, and the main booking sidebar.
    - **`AirBnbStyleGallery`**: An aesthetically pleasing, interactive image gallery to showcase the facility.
    - **`FacilityHeader`**: Displays the facility's name, location, and primary action buttons like "Share" and "Favorite."
    - **`FacilityInfoTabs`**: A tabbed interface to organize detailed information about the facility, such as description, amenities, rules, and reviews.
    - **`EnhancedFacilitySidebar`**: A key component that is persistently displayed on larger screens. It contains the real-time `BookingPriceCalculation` and a `BookingDetailsSection` that summarizes the user's selections and provides a call-to-action to start the booking process.

3.  **`FacilityDetailCalendar`**:
    - This is a major interactive component that displays the facility's availability.
    - **`AvailabilityTab`**: Shows a weekly or monthly grid of time slots, allowing users to click to select or deselect them. It handles bulk selections (e.g., dragging to select multiple slots).
    - **`RecurrenceWizard`**: A powerful tool that allows users to define recurring booking patterns (e.g., "every Monday for the next 5 weeks"). It then calculates the resulting dates and slots.

4.  **Data Hooks (`useOptimizedFacility`, `useZones`)**: These hooks are responsible for abstracting the data-fetching logic from the presentation layer. They handle fetching, loading states, error states, and caching (if integrated with a library like TanStack Query).

5.  **State Management (`useSlotSelection`)**: This custom hook centralizes the logic for managing which time slots a user has selected across different zones. It provides a clean API (`handleSlotClick`, `clearSelection`) for components to interact with the selection state.

## Key Workflows

### 1. Viewing a Facility

- A user navigates to `/facilities/123`.
- The `FacilityDetail` page component mounts and its `useParams` hook retrieves the `id`.
- The `useOptimizedFacility` and `useZones` hooks are called, which trigger API requests to fetch the relevant data.
- While data is loading, a `LoadingState` component is rendered.
- Once the data arrives, the `FacilityDetailLayout` and `FacilityDetailCalendar` are rendered with the facility and zone information.

### 2. Selecting Time Slots

- The user interacts with the `AvailabilityTab` inside the `FacilityDetailCalendar`.
- They click on an available time slot.
- The `onSlotClick` handler, which is passed down from the `FacilityDetail` page, is invoked.
- This handler calls `handleSlotClick` from the `useSlotSelection` hook, updating the central `selectedSlots` state.
- The state update triggers a re-render of components that depend on it:
    - The `AvailabilityTab` visually updates to show the slot as selected.
    - The `EnhancedFacilitySidebar` updates the `BookingDetailsSection` to list the selected slot and the `BookingPriceCalculation` to show the new estimated price.

This architecture effectively separates concerns, making the complex facility detail page manageable and performant. The use of custom hooks for data fetching and state management keeps the page component clean and focused on orchestration. 