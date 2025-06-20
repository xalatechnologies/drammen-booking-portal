# Feature Specification: Recurrent Bookings

This document outlines the functionality and technical specification for the Recurrent Bookings feature in the Drammen Booking Portal.

## 1. Feature Overview

The Recurrent Bookings feature allows users to book a facility for multiple dates in the future based on a repeating pattern, rather than creating each booking manually. This is essential for users like sports clubs who need a venue for weekly training sessions or organizations holding regular meetings.

The system is designed to be both powerful and intuitive, guiding the user through defining a pattern, previewing the resulting dates, and seeing potential conflicts before they confirm their selection.

## 2. User Stories

- **As a sports club manager,** I want to book a training hall every Monday and Wednesday evening for the entire season, so that I don't have to create 30 individual bookings manually.
- **As an instructor holding a course,** I want to book a classroom for four consecutive Tuesdays, so that I can secure the venue for the duration of my course.
- **As a municipal administrator,** I want to block out a specific room for a recurring weekly team meeting, so that it's reserved for internal use.
- **As a user creating a recurring booking,** I want to see which of my desired dates are already taken, so that I can adjust my selection or find an alternative without having to guess.

## 3. Use Case Scenario: Weekly Training Slot

- **Actor:** Sports Club Manager
- **Goal:** Book the main hall at "Drammen Kulturhus" every Tuesday from 18:00-20:00, from September 1st to December 15th.
- **Preconditions:** The user is logged in and is on the facility detail page for "Drammen Kulturhus".

**Step-by-Step Flow:**
1.  User clicks the "Create Recurring Booking" button, opening the `RecurrenceWizard` modal.
2.  **Step 1: Frequency & Pattern:**
    *   The user is presented with frequency options. They select "Weekly".
    *   A `WeekdaySelector` appears. The user clicks "Tuesday".
3.  **Step 2: Date Range & Time:**
    *   The user selects "September 1st" in the "Start Date" calendar and "December 15th" in the "End Date" calendar.
    *   A list of available time slots is shown. The user selects "18:00 - 20:00".
4.  **Step 3: Preview & Conflicts:**
    *   The `PatternPreview` component activates, displaying a list of all 16 Tuesdays between the selected dates.
    *   The system highlights "Tuesday, October 26th" in red, marking it as "Unavailable".
    *   The user un-checks the box next to "Tuesday, October 26th" to exclude it from their selection.
5.  **Confirmation:**
    *   The user clicks the "Confirm Selection (15 dates)" button at the bottom of the wizard.
6.  **Outcome:** The wizard closes. The `BookingSidebar` on the right of the page now lists 15 selected time slots. The `BookingPriceCalculation` component updates to show the total price for all 15 bookings combined.

## 4. Visual Walkthrough

1.  **Initiation:** On the facility detail page, below the main calendar grid, the user locates and clicks a button labeled "Planlegg gjentakende booking" (Plan Recurring Booking). A full-screen modal, the `RecurrenceWizard`, slides into view, overlaying the page content.
2.  **Step 1 - Frequency:** The modal title reads "Opprett gjentakende booking". The first section asks "Hvor ofte?" (How often?). The user clicks the "Ukentlig" (Weekly) option. Below this, a row of buttons representing the days of the week appears. The user clicks "Tirsdag" (Tuesday), which becomes highlighted.
3.  **Step 2 - Date & Time:** In the next section, the user interacts with two calendar inputs, "Startdato" and "Sluttdato", setting the desired range. Below the calendars, the user selects the "18:00 - 20:00" time slot from a list.
4.  **Step 3 - Preview:** The final section of the wizard, "Forhåndsvisning" (Preview), populates with a scrollable list of dates. Each row shows a date (e.g., "Tirsdag 7. september") and a green "Tilgjengelig" (Available) badge. One row, "Tirsdag 26. oktober", is visually distinct with a red "Utilgjengelig" (Unavailable) badge and its checkbox is disabled. The user sees this and decides to proceed without that date.
5.  **Confirmation:** The user clicks the main action button at the bottom of the modal, which now reads "Legg til 15 bookinger" (Add 15 bookings). The modal closes, and the user is returned to the facility detail page. The `BookingSidebar` on the right now contains 15 new items, and the total price has been updated accordingly.

## 5. Technical Details & Business Logic

The backend implementation of this feature must adhere to the following rules, which are specified by the frontend's `recurrenceEngine.ts`:

-   **Date Generation:** The logic in `recurrenceEngine.ts` must be replicated on the backend to ensure the same dates are generated from a given pattern. This includes correctly handling weekly, bi-weekly, and monthly patterns (e.g., "the last Tuesday of the month").
-   **Conflict Detection:** Before creating any bookings, the system must validate every single generated occurrence against the `bookings` table.
    -   The validation must check for overlapping time slots within the same `zoneId`.
-   **Transactional Integrity:** The creation of recurring bookings must be an **atomic transaction**.
    -   If a user confirms a pattern that generates 10 dates, the system must attempt to create 10 new rows in the `bookings` table.
    -   If even one of these dates fails the conflict check during the transaction, the entire transaction must be rolled back. No bookings should be created.
    -   A successful transaction results in all 10 booking records being created, linked by a common `recurrence_id`.
-   **State Management:**
    -   On the frontend, the `useSlotSelection` hook is responsible for managing the state of all time slots selected by the user, whether individually or through the recurrence wizard.
    -   When the user confirms their selection in the `RecurrenceWizard`, the component calls the `handleBulkSlotSelection` function provided by the hook, which adds all the valid, generated slots to the central `selectedSlots` state.
    -   This updated state then automatically propagates to the `BookingSidebar` and `BookingPriceCalculation` components, providing instant feedback to the user.

By following this specification, the Recurrent Bookings feature will be robust, user-friendly, and technically sound, providing a seamless experience from pattern definition to final booking confirmation.

## 6. User Journey & UI Components

The user interacts with this feature primarily through the **`RecurrenceWizard`** component, which is typically presented within a modal or a dedicated section on the `FacilityDetailCalendar`.

The wizard consists of a multi-step process:

```mermaid
graph TD
    A[User clicks "Create Recurring Booking"] --> B{RecurrenceWizard Modal};
    B --> C[Step 1: Frequency & Pattern];
    C --> D[Step 2: Date Range & Time];
    D --> E[Step 3: Preview & Conflicts];
    E --> F[User confirms selection];
    F --> G[Slots are added to Booking Sidebar];

    subgraph "Step 1: Frequency & Pattern"
        C1[Select Frequency: Weekly, Bi-weekly, Monthly]
        C2[Select Weekdays (for Weekly)]
        C3[Select Monthly Pattern (e.g., 'First Monday')]
    end
    C --> C1 & C2 & C3

    subgraph "Step 2: Date Range & Time"
        D1[Select Start Date]
        D2[Select End Date]
        D3[Select Time Slot(s)]
    end
    D --> D1 & D2 & D3

    subgraph "Step 3: Preview & Conflicts"
        E1[List of all generated dates]
        E2[Highlight conflicting dates (already booked)]
        E3[Allow user to de-select individual dates]
    end
    E --> E1 & E2 & E3
```

### Component Breakdown:

-   **`FrequencySelector`**: A UI control that allows the user to select the base pattern (`Weekly`, `Bi-weekly`, `Monthly`).
-   **`WeekdaySelector`**: A set of toggle buttons for the user to select which days of the week their booking should occur on (e.g., Monday, Wednesday, Friday).
-   **`DateRangeStep`**: Two calendar inputs for selecting the start and end dates of the entire recurrence period.
-   **`TimeSlotStep`**: A list of available time slots for the user to choose.
-   **`PatternPreview`**: A dedicated component that takes the user's selections and generates a list of all resulting dates. Crucially, this component will:
    -   Display each generated date.
    -   For each date, check its availability using the **Conflict Detection Engine**.
    -   Visually distinguish between available dates and conflicting dates (e.g., with a red icon and "Unavailable" text).
    -   Allow the user to uncheck individual dates from the generated list to resolve conflicts or skip specific occurrences.

## 7. Business Logic & Rules

The backend implementation of this feature must adhere to the following rules, which are specified by the frontend's `recurrenceEngine.ts`:

-   **Date Generation:** The logic in `recurrenceEngine.ts` must be replicated on the backend to ensure the same dates are generated from a given pattern. This includes correctly handling weekly, bi-weekly, and monthly patterns (e.g., "the last Tuesday of the month").
-   **Conflict Detection:** Before creating any bookings, the system must validate every single generated occurrence against the `bookings` table.
    -   The validation must check for overlapping time slots within the same `zoneId`.
-   **Transactional Integrity:** The creation of recurring bookings must be an **atomic transaction**.
    -   If a user confirms a pattern that generates 10 dates, the system must attempt to create 10 new rows in the `bookings` table.
    -   If even one of these dates fails the conflict check during the transaction, the entire transaction must be rolled back. No bookings should be created.
    -   A successful transaction results in all 10 booking records being created, linked by a common `recurrence_id`.
-   **State Management:**
    -   On the frontend, the `useSlotSelection` hook is responsible for managing the state of all time slots selected by the user, whether individually or through the recurrence wizard.
    -   When the user confirms their selection in the `RecurrenceWizard`, the component calls the `handleBulkSlotSelection` function provided by the hook, which adds all the valid, generated slots to the central `selectedSlots` state.
    -   This updated state then automatically propagates to the `BookingSidebar` and `BookingPriceCalculation` components, providing instant feedback to the user.

By following this specification, the Recurrent Bookings feature will be robust, user-friendly, and technically sound, providing a seamless experience from pattern definition to final booking confirmation. 