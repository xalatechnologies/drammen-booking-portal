# Advanced Feature Specification: Pricing Engine

This document provides a deep and comprehensive specification for the Drammen Booking Portal's pricing engine. It is intended to be the definitive guide for developers, product managers, and testers to understand how prices are calculated under all conditions.

## 1. Core Engine Philosophy

The pricing engine is not a static price list. It is a dynamic, rule-based system designed to implement complex business and community policies. The final price is a result of a pipeline of calculations, where a base price is modified by a series of discounts and surcharges.

**Guiding Principle:** The final price must always be transparent and justifiable. The engine must produce a detailed breakdown of how it arrived at the total, which can be displayed to the user.

## 2. Core Pricing Factors

The final price is derived from four key factors:

1.  **Base Price:** Determined by the specific `Zone` being booked and the duration of the booking.
2.  **Actor Type (Price Group):** *Who* is booking. This is the most significant factor, applying major discounts or surcharges.
3.  **Booking Type:** *How* they are booking (e.g., a one-time event vs. a long-term recurring slot).
4.  **Time of Booking:** *When* they are booking (e.g., evenings and weekends are more expensive).

### Pricing Factor Tables

These tables, derived from `pricingEngine.ts`, define the core multipliers.

**Table 2.1: Actor Type Multipliers**

| Actor Type (`Price Group`) | Multiplier | Effect |
| :--- | :--- | :--- |
| `paraply` (Umbrella Org) | 0.3 | 70% Discount |
| `lag-foreninger` (Club/Assoc.) | 0.5 | 50% Discount |
| `kommunale-enheter` (Municipal) | 0.7 | 30% Discount |
| `private-person` (Private Person) | 1.0 | Standard Price |
| `private-firma` (Private Company) | 1.2 | 20% Surcharge |

**Table 2.2: Booking Type Multipliers**

| Booking Type | Multiplier | Effect |
| :--- | :--- | :--- |
| `fastlan` (Recurring Lease) | 0.9 | 10% Discount |
| `engangs` (One-time) | 1.0 | Standard Price |
| `strotimer` (Drop-in) | 1.0 | Standard Price |

**Table 2.3: Time-Based Multipliers**

| Time of Day | Hours | Multiplier | Effect |
| :--- | :--- | :--- | :--- |
| Morning | 08:00 - 11:59 | 1.0 | Standard Price |
| Afternoon | 12:00 - 16:59 | 1.0 | Standard Price |
| **Evening** | **17:00 - 21:59** | **1.3** | **30% Surcharge** |
| Night | 22:00 - 07:59 | 1.5 | 50% Surcharge |
| **Weekend** | **Sat / Sun** | **1.2** | **20% Surcharge** |

---

## 3. Price Group Analysis & Use Cases

### 3.1. Price Group: `lag-foreninger` (Clubs & Associations)

This group receives a **50% discount** on the base price as a primary incentive.

**Use Case 1: Standard Weekly Training**
- **Scenario:** The local football club books a 2-hour training session every Tuesday evening as a recurring booking (`fastlan`).
- **Details:** Zone Price: 1000 kr/hour, Time: 19:00-21:00 (Evening), Day: Tuesday.
- **Calculation:**
    1.  **Base Price:** 1000 kr * 2 hours = 2000 kr
    2.  **Actor Discount (50%):** 2000 kr * 0.5 = 1000 kr
    3.  **Booking Discount (10%):** 1000 kr * 0.9 = 900 kr
    4.  **Time Surcharge (30%):** 900 kr * 1.3 = **1170 kr**

**Use Case 2: Weekend Tournament**
- **Scenario:** The chess club hosts a one-time tournament on a Saturday afternoon.
- **Details:** Zone Price: 500 kr/hour, Time: 12:00-16:00 (Afternoon, 4 hours).
- **Calculation:**
    1.  **Base Price:** 500 kr * 4 hours = 2000 kr
    2.  **Actor Discount (50%):** 2000 kr * 0.5 = 1000 kr
    3.  **Weekend Surcharge (20%):** 1000 kr * 1.2 = **1200 kr**

**Use Case 3: Weekday Committee Meeting**
- **Scenario:** The knitting association books a small meeting room during the day.
- **Details:** Zone Price: 200 kr/hour, Time: 10:00-12:00 (Morning, 2 hours).
- **Calculation:**
    1.  **Base Price:** 200 kr * 2 hours = 400 kr
    2.  **Actor Discount (50%):** 400 kr * 0.5 = **200 kr** (No other multipliers apply)

**Use Case 4: Annual General Meeting**
- **Scenario:** A large association books the main hall for an evening meeting.
- **Details:** Zone Price: 1500 kr/hour, Time: 18:00-22:00 (Evening, 4 hours).
- **Calculation:**
    1.  **Base Price:** 1500 kr * 4 hours = 6000 kr
    2.  **Actor Discount (50%):** 6000 kr * 0.5 = 3000 kr
    3.  **Time Surcharge (30%):** 3000 kr * 1.3 = **3900 kr**

**Use Case 5: Drop-in Activity**
- **Scenario:** A local youth club books a drop-in (`strotimer`) session for kids after school.
- **Details:** Zone Price: 400 kr/hour, Time: 15:00-17:00 (Afternoon, 2 hours).
- **Calculation:**
    1.  **Base Price:** 400 kr * 2 hours = 800 kr
    2.  **Actor Discount (50%):** 800 kr * 0.5 = **400 kr**

### 3.2. Price Group: `private-firma` (Private Companies)

This group pays a **20% surcharge** on the base price.

**Use Case 1: Weekday Off-site Conference**
- **Scenario:** A tech company books the main hall for an all-day conference.
- **Details:** Zone Price: 1500 kr/hour, Time: 09:00-17:00 (8 hours).
- **Calculation:**
    1.  **Base Price:** 1500 kr * 8 hours = 12,000 kr
    2.  **Actor Surcharge (20%):** 12,000 kr * 1.2 = **14,400 kr**

**Use Case 2: Evening Team-Building Event**
- **Scenario:** An accounting firm books a smaller hall for a social event after work.
- **Details:** Zone Price: 800 kr/hour, Time: 18:00-21:00 (Evening, 3 hours).
- **Calculation:**
    1.  **Base Price:** 800 kr * 3 hours = 2400 kr
    2.  **Actor Surcharge (20%):** 2400 kr * 1.2 = 2880 kr
    3.  **Time Surcharge (30%):** 2880 kr * 1.3 = **3744 kr**

**Use Case 3: Recurring Weekly Project Meeting**
- **Scenario:** A consulting firm books a meeting room every Thursday morning (`fastlan`).
- **Details:** Zone Price: 300 kr/hour, Time: 09:00-11:00 (2 hours).
- **Calculation:**
    1.  **Base Price:** 300 kr * 2 hours = 600 kr
    2.  **Actor Surcharge (20%):** 600 kr * 1.2 = 720 kr
    3.  **Booking Discount (10%):** 720 kr * 0.9 = **648 kr**

**Use Case 4: Weekend Product Launch Party**
- **Scenario:** A marketing agency books the main hall for a launch event on a Saturday evening.
- **Details:** Zone Price: 1500 kr/hour, Time: 19:00-23:00 (Evening, 4 hours).
- **Calculation:**
    1.  **Base Price:** 1500 kr * 4 hours = 6000 kr
    2.  **Actor Surcharge (20%):** 6000 kr * 1.2 = 7200 kr
    3.  **Time Surcharge (30%):** 7200 kr * 1.3 = 9360 kr
    4.  **Weekend Surcharge (20%):** 9360 kr * 1.2 = **11,232 kr**

**Use Case 5: Quick Client Meeting**
- **Scenario:** A small startup books a small meeting room for one hour.
- **Details:** Zone Price: 200 kr/hour, Time: 14:00-15:00 (1 hour).
- **Calculation:**
    1.  **Base Price:** 200 kr * 1 hour = 200 kr
    2.  **Actor Surcharge (20%):** 200 kr * 1.2 = **240 kr**

### 3.3. Price Group: `private-person` (Private Individuals)

This group pays the **standard rate** with no actor-based multiplier.

**Use Case 1: Child's Birthday Party**
- **Scenario:** A parent books a small hall for a birthday party on a Saturday afternoon.
- **Details:** Zone Price: 400 kr/hour, Time: 14:00-17:00 (3 hours).
- **Calculation:**
    1.  **Base Price:** 400 kr * 3 hours = 1200 kr
    2.  **Weekend Surcharge (20%):** 1200 kr * 1.2 = **1440 kr**

**Use Case 2: Evening Hobby Group**
- **Scenario:** A group of friends book a room for their weekly board game night.
- **Details:** Zone Price: 250 kr/hour, Time: 19:00-22:00 (Evening, 3 hours).
- **Calculation:**
    1.  **Base Price:** 250 kr * 3 hours = 750 kr
    2.  **Time Surcharge (30%):** 750 kr * 1.3 = **975 kr**

**Use Case 3: Booking a Study Room**
- **Scenario:** A student books a small room for studying during the day.
- **Details:** Zone Price: 100 kr/hour, Time: 10:00-13:00 (3 hours).
- **Calculation:**
    1.  **Base Price:** 100 kr * 3 hours = **300 kr** (No other multipliers apply)

**Use Case 4: Long-term Art Class**
- **Scenario:** An individual books a room for an art class every Wednesday morning for 3 months (`fastlan`).
- **Details:** Zone Price: 300 kr/hour, Time: 09:00-12:00 (3 hours).
- **Calculation:**
    1.  **Base Price:** 300 kr * 3 hours = 900 kr
    2.  **Booking Discount (10%):** 900 kr * 0.9 = **810 kr**

**Use Case 5: Night-time Event (e.g., LAN Party)**
- **Scenario:** A group books a hall for an overnight event.
- **Details:** Zone Price: 600 kr/hour, Time: 22:00-06:00 (Night, 8 hours)
- **Calculation:**
    1.  **Base Price:** 600 kr * 8 hours = 4800 kr
    2.  **Time Surcharge (50%):** 4800 kr * 1.5 = **7200 kr**

*Note: The use cases for `paraply` and `kommunale-enheter` would follow the same logic, applying their respective 70% and 30% discounts instead.* 