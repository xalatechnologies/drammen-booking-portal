# Admin Pages Requirements

Checked by AI on 2024-06-18: [x] = some implementation present, [ ] = not implemented or not visible in codebase.

1. [x] As a superadmin, I want to create, edit, and delete roles (Fagsystemforvalter, Administrator, Saksbehandler, Paraplyrepresentant, Support, Innbygger) so I can grant appropriate permissions for different user classes
2. [x] As a superadmin, I want to assign and revoke roles to/from users and Azure AD groups via SCIM 2.0 so access aligns with organizational changes
3. [x] As an admin, I want to search, view, and manage user accounts (external via BankID/ID-porten and internal via Entra ID) so I can support onboarding and offboarding
4. [x] As an admin, I want to blacklist or suspend individual users or entire organizations temporarily or permanently with defined reasons and durations so misuse can be prevented
5. [x] As an admin, I want to create, edit, and delete facilities with metadata (name, address, coordinates, images, capacity, facilities, contact info) and custom fields so each venue is accurately represented
6. [x] As an admin, I want to define which booking types (engangslån, fastlån, rammetid, strøtimer) are allowed per facility so the booking options align with venue policies
7. [x] As an admin, I want to configure opening hours, booking intervals (15 min, 30 min, daily), and seasonal availability per facility so bookings reflect real-world constraints
8. [ ] As an admin, I want to manage zone segmentation within large facilities (e.g. splitting halls into courts) with conflict rules so sub-areas can be booked independently or as a whole
9. [ ] As an admin, I want to view and filter all bookings, pending applications, and blocked periods across multiple calendars simultaneously so I can monitor overall utilization
10. [x] As an admin, I want to approve, reject, or propose alternate times for engangslån and fastlån requests—including editing times, durations, and dates—with optional auto-approval workflows so bookings are processed efficiently
11. [ ] As an admin, I want to import and sync external calendar events (iCal/ICS, Exchange) and automatically block conflicts so third-party bookings are respected
12. [ ] As an admin, I want to block time periods for maintenance or internal events, with override options that notify affected users so facility downtime is strictly enforced
13. [ ] As an admin, I want to allocate fixed weekly time blocks (rammetid) to umbrella organizations over defined periods and visualize overlaps so core allocation rights are honored
14. [ ] As an admin, I want to configure delegation options for umbrella representatives to redistribute or release rammetid as drop-in slots so downstream groups can self-manage allocations
15. [ ] As an admin, I want to configure email/SMS templates and triggers (confirmations, rejections, reminders, escalations) with placeholder variables so communications are consistent and automated
16. [ ] As an admin, I want to set up subscription-based alerts (email/SMS/in-app) for users on available drop-in slots by location and criteria so they can subscribe to notifications
17. [x] As an admin, I want to generate custom reports by facility, time period, booking type, and user role, and export to Excel/CSV so I can analyze utilization and revenue
18. [x] As an admin, I want to view dashboards with charts on booking counts, utilization rates, and financials, filterable by category, location, and date range so I get rapid operational insights
19. [ ] As an admin, I want to configure authentication providers (BankID/ID-porten, Vipps, Entra ID) with OIDC settings and SCIM group sync so identities are managed centrally
20. [ ] As an admin, I want to configure Exchange integration (Graph API credentials, resource selection) so selected meeting rooms are bookable through the system
21. [ ] As an admin, I want to manage API keys, webhooks, and external service endpoints (Sendinblue, Twilio, Aktørregister) so integrations remain secure and functional
22. [ ] As a system administrator, I want to view and export audit logs of all actions (user, action, timestamp, IP) so I maintain traceability for GDPR and security audits
23. [ ] As a system administrator, I want to configure data retention and anonymization rules (e.g., delete personal data after 24 months) so GDPR compliance is enforced
24. [ ] As a system administrator, I want to configure Azure environments (dev/test/prod), deployment strategies (blue/green), and backup schedules so high availability and disaster recovery are ensured
25. [ ] As a system administrator, I want to configure monitoring (Application Insights, Azure Monitor, Sentry) and set alert thresholds (CPU>80%, errors>100/min) so operational issues are detected proactively
26. [ ] As a support agent, I want to access a ticketing dashboard for incident management with SLA tracking and escalation workflows so support requests are handled per contract
27. [x] As an admin, I want to manage localization settings (primary language NB Bokmål, English alternative) and universal-design toggles so the UI meets accessibility and language requirements
28. [ ] As an admin, I want to manage system-wide business rules (pricing levels, auto-approve configurations, booking thresholds) via a configuration interface so changes require no code deployments
29. [ ] As an admin, I want to define and manage support SLA parameters (response times, escalation contacts, compensation rules) so the system enforces contract SLAs and alerts on breaches
30. [ ] As an admin, I want to configure future electronic-lock integrations (NFC/digital keys) settings so physical access is automatically granted for booked time slots
