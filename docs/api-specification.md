# API Specification

This document outlines the RESTful API for the Drammen Booking Portal. The API is resource-oriented and uses standard HTTP verbs and status codes. All request and response bodies are in JSON format.

## Base URL

The base URL for all API endpoints will be: `/api/v1`

## Authentication

All API endpoints require authentication via a JWT Bearer token sent in the `Authorization` header.

```
Authorization: Bearer <your_jwt_token>
```

The token will contain the user's ID, role, and organization ID, which will be used for authorization at the endpoint level.

---

## 1. Facilities & Zones

Resource for managing facilities and their sub-zones.

### `GET /facilities`

-   **Description:** Retrieves a paginated list of all facilities, with support for filtering and sorting.
-   **Query Parameters:**
    -   `page` (int, default: 1): The page number for pagination.
    -   `limit` (int, default: 10): The number of items per page.
    -   `searchTerm` (string): A search term to filter by name or description.
    -   `facilityType` (string): Filter by a specific facility type.
    -   `sortBy` (string, e.g., 'name', 'pricePerHour'): Field to sort by.
    -   `sortDir` ('asc' | 'desc'): Sort direction.
-   **Success Response (200 OK):** `PaginatedResponse<Facility>`

### `GET /facilities/{id}`

-   **Description:** Retrieves a single facility by its unique ID.
-   **Success Response (200 OK):** `Facility`

### `GET /facilities/{id}/zones`

-   **Description:** Retrieves all zones associated with a specific facility.
-   **Success Response (200 OK):** `Zone[]`

### `GET /zones/{id}`

-   **Description:** Retrieves a single zone by its unique ID.
-   **Success Response (200 OK):** `Zone`

---

## 2. Bookings

Resource for creating and managing bookings.

### `POST /bookings`

-   **Description:** Creates a new booking. The server will perform validation and conflict checks before creating the record.
-   **Request Body:** `BookingCreateRequest`
-   **Success Response (201 Created):** `Booking`
-   **Error Response (409 Conflict):** If the requested time slot is not available. The response body will contain details about the conflict and suggested alternatives.

### `GET /bookings`

-   **Description:** Retrieves a paginated list of bookings, with filtering capabilities. Primarily for admins or users viewing their own booking history.
-   **Query Parameters:**
    -   `page`, `limit`
    -   `facilityId`, `userId`, `organizationId`
    -   `status` ('pending', 'confirmed', 'cancelled')
    -   `startDate`, `endDate`
-   **Success Response (200 OK):** `PaginatedResponse<Booking>`

### `GET /bookings/{id}`

-   **Description:** Retrieves a single booking by its ID.
-   **Success Response (200 OK):** `Booking`

### `PATCH /bookings/{id}`

-   **Description:** Updates an existing booking.
-   **Request Body:** `BookingUpdateRequest`
-   **Success Response (200 OK):** `Booking`

### `POST /bookings/{id}/cancel`

-   **Description:** Cancels a booking.
-   **Request Body:** `{ "reason": "User cancelled" }`
-   **Success Response (200 OK):** `Booking`

### `POST /bookings/{id}/approve`

-   **Description:** (Admin) Approves a booking that is pending approval.
-   **Success Response (200 OK):** `Booking`

### `POST /bookings/{id}/reject`

-   **Description:** (Admin) Rejects a booking that is pending approval.
-   **Request Body:** `{ "reason": "Does not meet requirements" }`
-   **Success Response (200 OK):** `Booking`

### `GET /availability/check`

-   **Description:** Checks for potential conflicts for a given set of time slots without creating a booking. This is used for real-time UI feedback.
-   **Query Parameters:**
    -   `zoneId` (string)
    -   `startDate` (datetime)
    -   `endDate` (datetime)
    -   `excludeBookingId` (string, optional): To check for conflicts when updating an existing booking.
-   **Success Response (200 OK):** `{ "hasConflict": boolean, "conflicts": Booking[], "alternatives": Timeslot[] }`

---

## 3. Users & Organizations

Resource for managing users and organizations. These endpoints are typically restricted to administrators.

### `GET /users`

-   **Description:** Retrieves a paginated list of users.
-   **Success Response (200 OK):** `PaginatedResponse<User>`

### `POST /users`

-   **Description:** Creates a new user.
-   **Request Body:** `UserCreateRequest`
-   **Success Response (201 Created):** `User`

### `GET /users/{id}`

-   **Description:** Retrieves a single user by ID.
-   **Success Response (200 OK):** `User`

### `PATCH /users/{id}`

-   **Description:** Updates a user's information or status.
-   **Request Body:** `UserUpdateRequest`
-   **Success Response (200 OK):** `User`

---

## 4. Additional Services

Resource for managing bookable add-on services.

### `GET /services`

-   **Description:** Retrieves a list of all available additional services.
-   **Success Response (200 OK):** `AdditionalService[]`

---

This API specification provides a clear contract for the backend team to build against, ensuring that it will meet the needs of the existing frontend application. 