
# Booking Recurrence Implementation

This document outlines the implementation details for the booking recurrence functionality in the Drammen Kommune booking system.

## Schema Changes

The booking database schema has been updated to include the following fields:

- `start_datetime`: Timestamp for when the booking begins
- `end_datetime`: Timestamp for when the booking ends
- `recurrence_rule`: Optional iCal RRULE string for recurring bookings

This schema design supports three types of bookings:

1. **One-time bookings**: Single occurrences with specific start and end datetime
2. **Date-range bookings**: Consecutive days with the same time slot
3. **Recurring bookings**: Regular pattern of bookings defined by an iCal RRULE

### Example Database Table Schema

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  facility_id UUID NOT NULL REFERENCES facilities(id),
  user_id UUID NOT NULL REFERENCES users(id),
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  recurrence_rule TEXT,
  purpose TEXT NOT NULL,
  attendees INTEGER NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  organization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Authorization policy
CREATE POLICY bookings_user_policy ON bookings
  USING (user_id = auth.uid());

-- Admin policy (separate role-based policy)
CREATE POLICY bookings_admin_policy ON bookings
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
```

## UI Implementation

The booking form UI has been enhanced to support three booking modes:

1. **One-time booking**: User selects a single date and time slot
2. **Date-range booking**: User selects start and end dates with the same time slot each day
3. **Recurring booking**: User selects a pattern (daily, weekly, monthly) with frequency and duration options

### Booking Mode Selection

The UI presents a radio button group for selecting the booking mode, with context-specific form fields appearing based on the selected mode.

### Recurring Booking Options

For recurring bookings, users can specify:

- **Frequency**: Daily, weekly, or monthly
- **Interval**: Number of units (days, weeks, months) between occurrences
- **Duration**: Either a count of occurrences or an end date

## Conflict Detection Algorithm

The conflict detection algorithm handles all three booking types and checks for overlaps between the requested booking and existing bookings.

### Algorithm Steps

1. Convert the requested booking into a set of time slots (start/end datetime pairs)
2. Fetch existing bookings for the specified facility
3. Convert each existing booking into time slots:
   - For one-time bookings: single time slot
   - For date-range bookings: one slot per day
   - For recurring bookings: expand using the RRULE into individual occurrences
4. Check for any overlap between the requested slots and existing slots
5. Return conflict status and details of conflicting dates

### Conflict Check Function

```typescript
checkBookingConflict(
  facilityId: string,
  startDate: Date,
  timeSlot: string,
  bookingMode: "one-time" | "date-range" | "recurring",
  endDate?: Date,
  recurrenceRule?: string,
  existingBookings: BookingEntry[] = []
): Promise<{hasConflict: boolean, conflictingDates?: Date[]}>
```

## iCal RRULE Examples

The system uses the iCalendar RRULE format for defining recurring patterns:

- **Weekly**: `FREQ=WEEKLY;INTERVAL=1`
- **Every other week**: `FREQ=WEEKLY;INTERVAL=2`
- **Monthly on the same day**: `FREQ=MONTHLY;INTERVAL=1`
- **Daily for 10 days**: `FREQ=DAILY;INTERVAL=1;COUNT=10`
- **Weekly until Dec 31, 2023**: `FREQ=WEEKLY;INTERVAL=1;UNTIL=20231231T000000Z`

## Edge Cases and Considerations

### Daylight Saving Time

When a recurring booking spans across daylight saving time changes, the UTC time will remain constant, but the local time may shift by an hour. This is handled by storing all times with timezone information and using libraries that correctly account for DST changes.

### Long-running Recurrences

Recurring bookings without an end date could potentially create an infinite series. To prevent performance issues, the system:

- Requires either an end date or a count for recurring bookings
- Limits expansion of recurring rules to a reasonable timeframe (e.g., 1 year) when checking for conflicts

### Modification and Deletion

When modifying or canceling a recurring booking, the system offers options to:

- Change this occurrence only
- Change this and all future occurrences
- Change all occurrences

### Time Zone Handling

All dates and times are stored in UTC in the database, but presented to users in their local time zone. This ensures consistent handling of recurring bookings across time zone and DST changes.

## Sample Code for RRULE Generation

```typescript
// Generate an iCal RRULE string from parameters
export const generateRecurrenceRule = (
  frequency: 'daily' | 'weekly' | 'monthly',
  interval: number = 1,
  count?: number,
  until?: Date
): string => {
  let rule = `FREQ=${frequency.toUpperCase()};INTERVAL=${interval}`;
  
  if (count) {
    rule += `;COUNT=${count}`;
  } else if (until) {
    const untilStr = until.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    rule += `;UNTIL=${untilStr}`;
  }
  
  return rule;
};
```
