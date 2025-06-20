# Booking System Architecture

This document outlines the architecture and key components of the booking system within the Drammen Booking Portal. The system is designed to be flexible and robust, supporting various booking scenarios through a modular, multi-step form.

## Overview

The booking system is built around a central `EnhancedBookingForm` component, which orchestrates a multi-step process for creating a booking. It integrates components for selecting facility zones, choosing additional services, entering contact information, and confirming the booking details.

The core principles of the booking system are:
- **Modularity:** Each part of the booking process (e.g., pricing, steps, navigation) is encapsulated in its own React component.
- **State Management:** It uses a combination of a dedicated `BookingFormProvider` (built on React Context) for form-wide state and `React Hook Form` for managing form field states and validation.
- **Extensibility:** The stepped approach allows for easy addition or removal of steps in the booking flow.
- **Validation:** Utilizes `Zod` for schema-based validation at each step, ensuring data integrity before proceeding.

## Core Components & Data Flow

The booking process is managed by a hierarchy of components that work together.

```mermaid
graph TD
    A[pages/booking/[facilityId].tsx] --> B[EnhancedBookingForm];
    B --> C[BookingFormProvider];
    C --> D[BookingFormContent];
    D --> E[CollapsibleFormStepper];
    D --> F[Form - React Hook Form];
    F --> G[BookingFormSteps];
    G --> H["Step 1: BookingDetailsStep"];
    G --> I["Step 2: ServiceSelectionStep"];
    G --> J["Step 3: BookingContactStep"];
    G --> K["Step 4: BookingConfirmStep"];
    D --> L[BookingFormNav];
    H --> M[EnhancedZoneSelector];
    H --> N[TimeSlotPicker];
    I --> O[ServiceSelectionCard];
    subgraph "Right Sidebar"
        P[IntegratedPriceCalculation] --> Q[EnhancedPriceCalculationCard]
        P --> R[BookingSummary]
    end
    H -.-> P
    I -.-> P
```

### Component Breakdown:

1.  **`EnhancedBookingForm`**: The main entry point. It wraps the entire form in the `BookingFormProvider` to provide shared state to all child components.

2.  **`BookingFormProvider` / `useBookingForm`**: A React Context provider that manages the overall state of the booking form, such as the `currentStep`, submission status (`isSubmitting`), and whether terms have been accepted. This avoids prop-drilling and centralizes form-level logic.

3.  **`BookingFormContent`**: The core layout of the form, which includes:
    *   **`CollapsibleFormStepper`**: A visual indicator of the user's progress through the booking steps. It allows navigation to previously completed steps.
    *   **`Form` (from `react-hook-form`)**: The foundation for the form fields, handling state, validation, and submission.
    *   **`BookingFormSteps`**: A component that acts as a router, rendering the appropriate step component based on the `currentStep` from the `useBookingForm` hook.
    *   **`BookingFormNav`**: Renders the "Next," "Previous," and "Submit" buttons, with logic to control their enabled/disabled state based on validation and the current step.

4.  **Step Components (`BookingDetailsStep`, etc.)**: Each of these components is responsible for rendering the fields and logic for a specific stage of the booking process. They consume and update the form state via `React Hook Form`.

5.  **Validation (`BookingFormValidation.ts` & `formSchema.ts`)**:
    *   `formSchema.ts`: Defines the Zod schema for the entire booking form, specifying the data types and validation rules for each field.
    *   `BookingFormValidation.ts`: Contains functions like `validateCurrentStep` that trigger validation for only the fields visible in the current step, providing a smooth user experience.

### Pricing & Summary

-   **`IntegratedPriceCalculation`**: A wrapper component, likely displayed alongside the form, that shows the real-time cost calculation.
-   **`EnhancedPriceCalculationCard`**: Listens for changes in the form (e.g., selected time slots, services) and uses a pricing engine to display a detailed breakdown of costs.
-   **`BookingSummary`**: Shows a summary of the user's selections so far.

## Key Workflows

### 1. Step Navigation

- The user clicks the "Next" button in the `BookingFormNav`.
- `handleNextStep` in `BookingFormContent` is called.
- It calls `validateCurrentStep` to run Zod validation against the fields of the active step.
- If validation passes, `canContinueToNextStep` performs any additional logic checks.
- If all checks pass, `setCurrentStep` is called, and the `BookingFormSteps` component renders the next step in the flow.

### 2. Submission

- On the final step, the user clicks "Submit."
- The `<form>`'s `onSubmit` handler is triggered.
- `onSubmit` in `BookingFormContent` performs a final check (e.g., `termsAccepted`).
- It sets `isSubmitting` to `true` to show loading states and prevent duplicate submissions.
- It makes an asynchronous call (currently a `setTimeout` placeholder) to a service that will handle the booking creation on the backend.
- Upon success, it calls the `onBookingComplete` callback to redirect the user or show a confirmation message.

This architecture creates a clean, decoupled, and highly interactive booking experience. The separation of form state, UI components, and business logic makes the system easier to understand, test, and extend in the future. 