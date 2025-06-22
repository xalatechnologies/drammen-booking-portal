Here’s the **updated checklist** with a dedicated **🧹 Cleanup Phase** added to the end, ensuring the legacy code is safely removed and the final structure is clean and consistent.

---

# ✅ Drammen Booking Portal Refactoring Checklist

---

## 📦 Phase 1: Core Infrastructure Setup

* [ ] Create `/features/` directory structure
* [ ] Create `/core/` folder with:

  * [ ] `/core/logger.ts`
  * [ ] `/core/errors/HttpError.ts`
* [ ] Set up environment config system with interfaces
* [ ] Implement dependency injection system
* [ ] Create shared types in `/types/api` and `/types/common`
* [ ] Move generic utilities to `/core/utils/`

  * [ ] `/utils/date/dateUtils.ts`
  * [ ] `/utils/validation/validationUtils.ts`
  * [ ] `/utils/string/stringUtils.ts`

---

## 🚀 Phase 2: Feature Migration (Repeat per feature)

### Example: Booking

* [ ] Create `features/booking/` subfolders:

  * [ ] `data/interfaces/IBookingRepository.ts`
  * [ ] `data/repositories/BookingRepository.ts`
  * [ ] `services/interfaces/IBookingService.ts`
  * [ ] `services/implementations/BookingService.ts`
  * [ ] `types/domain/`, `dtos/`, `requests/`, `responses/`
  * [ ] `mappers/BookingMapper.ts`
  * [ ] `state/useBookingStore.ts`
* [ ] Replace legacy `/dal/booking` and `/services/booking` references
* [ ] Remove mock data references from `/data/bookings`

🔁 Repeat for:

* [ ] Facility
* [ ] User
* [ ] Auth
* [ ] Localization

---

## 🧭 Phase 3: Public/Admin Interface Separation

* [ ] Create layout components:

  * [ ] `ui/layouts/public/`
  * [ ] `ui/layouts/admin/`
  * [ ] `ui/layouts/app/`
* [ ] Implement `RouteGuard.tsx` and `PermissionGuard.tsx`
* [ ] Move pages into `features/{feature}/pages/{public|admin|app}`
* [ ] Migrate feature-specific components from `/components` to `features/{feature}/components/`

---

## 🔐 Phase 4: Cross-Cutting Concerns

### Authentication & Authorization

* [ ] Create `features/auth/` structure
* [ ] Implement:

  * [ ] `IAuthService.ts`, `AuthService.ts`
  * [ ] `IAuthRepository.ts`, `AuthRepository.ts`
  * [ ] `AuthProvider.tsx`
  * [ ] `useAuth.ts`, `usePermissions.ts`
* [ ] Integrate:

  * [ ] BankID
  * [ ] Feide
  * [ ] Microsoft SSO
* [ ] Add `supabaseSync.ts` callback
* [ ] Define `roles.ts`, `permissions.ts`, and `canAccess.ts`

### Localization

* [ ] Create `features/localization/` folder
* [ ] Implement:

  * [ ] `ILocalizationService.ts`, `LocalizationService.ts`
  * [ ] `useLocale.ts`, `useTranslation.ts`
  * [ ] `LocalizationProvider.tsx`
* [ ] Move static translation files to `/core/localization/translations/en.ts`, `no.ts`
* [ ] Define `TranslationKeys.ts`
* [ ] Add dynamic localization from Supabase

---

## 🧪 Phase 5: Testing & Documentation

* [ ] Snapshot test existing UI components
* [ ] Set up visual regression testing (e.g., Playwright, Chromatic)
* [ ] Create unit tests for:

  * [ ] Repositories
  * [ ] Services
  * [ ] Mappers
* [ ] Create integration tests for booking flows
* [ ] Document:

  * [ ] Folder and architecture structure
  * [ ] DI and configuration
  * [ ] Auth and permission system
  * [ ] Developer setup and onboarding

---

## 🧼 Static Data Cleanup & Database Migration

* [ ] Move `/data/*.ts` → `/database/seeds/`
* [ ] Write Supabase migrations for:

  * [ ] Facilities
  * [ ] Services
  * [ ] Bookings
* [ ] Create proper seed scripts
* [ ] Build `FacilityDataService.ts`, `ServiceDataService.ts`
* [ ] Delete `/data` folder once verified

---

## ⚙️ Utility Layer Refactoring

* [ ] Group and move utils:

  * [ ] Feature-specific → `features/{feature}/utils`
  * [ ] Shared → `/core/utils/`
* [ ] Create interfaces for advanced utilities
* [ ] Improve type safety and validation

---

## 🔧 Configuration Refactor

* [ ] Refactor `/config` to:

  * [ ] `/core/config/interfaces/`
  * [ ] `/core/config/implementations/`
  * [ ] `/core/config/providers/ConfigProvider.tsx`
* [ ] Implement strategy pattern for `DevelopmentConfig`, `ProductionConfig`
* [ ] Add runtime validation for config values

---

## 🧹 Phase 6: Cleanup & Finalization

* [ ] Delete deprecated folders:

  * [ ] `/dal/`
  * [ ] `/services/` (non-feature-based)
  * [ ] `/data/`
  * [ ] `/components/` (migrated parts only)
  * [ ] `/contexts/`, `/stores/` (after feature migration)
* [ ] Delete all `any` types and replace with strict types
* [ ] Ensure all `index.ts` files only re-export typed interfaces and implementations
* [ ] Remove legacy static translation logic if no longer used
* [ ] Validate all routing layers and ensure all old paths are removed
* [ ] Re-run snapshot and integration tests post-cleanup
* [ ] Freeze final directory layout in README

---

Would you like this exported to `.md`, `.csv`, or `.json` for use in a project management tool?
