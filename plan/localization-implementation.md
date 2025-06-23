# Localization Implementation Plan

## Overview
Implement comprehensive Norwegian (NO) and English (EN) localization across all components and pages in the Drammen Booking Portal. Ensure consistent use of translation hooks and proper multilingual support throughout the application.

## Current State Analysis ✅

### Existing Infrastructure
- [x] **LanguageContext** - Language switching with localStorage persistence
- [x] **Static Translation System** - i18n folder with structured translations
- [x] **Dynamic Translation System** - Database-driven translations via Supabase
- [x] **Translation Hooks** - Multiple hooks for different use cases
- [x] **Base Translation Files** - 15+ translation files covering major areas

### Current Translation Coverage
- [x] Admin interface (`admin.ts`)
- [x] Facility management (`facility.ts`)
- [x] Booking system (`booking.ts`)
- [x] Common UI elements (`common.ts`)
- [x] Forms and validation (`forms.ts`, `validation.ts`)
- [x] Navigation (`navigation.ts`)
- [x] Error messages (`errors.ts`)
- [x] Enums and models (`enums.ts`, `models.ts`)

### Identified Issues
- [ ] **Inconsistent hook usage** - Mix of `@/i18n` and `@/hooks/useTranslation`
- [ ] **Missing translations** - Some components still use hardcoded text
- [ ] **Incomplete coverage** - Not all pages have proper localization
- [ ] **Translation key organization** - Needs better structure and naming
- [ ] **Missing fallbacks** - Some translations lack proper fallback values

## Phase 1: Hook Standardization & Cleanup

### Standardize Translation Hook Usage
- [ ] **Audit all components** for translation hook usage
- [ ] **Decide on primary hook** - Choose between static and dynamic systems
- [ ] **Update import statements** to use consistent hook
- [ ] **Remove duplicate hooks** or clearly define use cases

### Recommended Hook Strategy
```typescript
// For static, core application text (recommended for most cases)
import { useTranslation } from '@/i18n';
const { t, formatCurrency, formatDate } = useTranslation();

// For dynamic, user-configurable content (admin-configurable text)
import { useTranslation } from '@/hooks/useTranslation';
const { tSync } = useTranslation();
```

### Hook Cleanup Tasks
- [ ] **Core UI Components** → Use static hook from `@/i18n`
- [ ] **Admin configurable content** → Use dynamic hook from `@/hooks`
- [ ] **Update all import statements** for consistency
- [ ] **Add TypeScript types** for better type safety

## Phase 2: Translation Key Structure Enhancement

### Improved Key Naming Convention
```typescript
// Current: Inconsistent structure
admin.facilities.management
booking.types.engangs

// Proposed: Hierarchical structure
admin.facilities.list.title
admin.facilities.form.labels.name
admin.facilities.actions.create
booking.types.single.label
booking.status.pending.label
common.actions.save.label
common.messages.loading.text
```

### Key Organization Strategy
- [ ] **Namespace by feature area** (admin, booking, facility, etc.)
- [ ] **Sub-namespace by component type** (list, form, modal, etc.)
- [ ] **Consistent suffix patterns** (.label, .title, .description, .placeholder, .error)
- [ ] **Shared common keys** for repeated text across features

### Translation Key Migration
- [ ] **Audit existing keys** for inconsistencies
- [ ] **Create new key structure** documentation
- [ ] **Migrate existing translations** to new structure
- [ ] **Update components** to use new keys
- [ ] **Maintain backwards compatibility** during transition

## Phase 3: Complete Component Coverage

### Component-by-Component Audit
- [ ] **Admin Components**
  - [ ] FacilityListView - Ensure all text uses translations
  - [ ] EnhancedFacilityForm - Check all form labels and messages
  - [ ] FacilityTableView - Table headers and actions
  - [ ] AdminSidebar - All navigation items and descriptions
  - [ ] AdminHeader - Search placeholders and menu items
  
- [ ] **Booking Components**
  - [ ] BookingForm - All form fields and validation messages
  - [ ] BookingsList - Status labels and filters
  - [ ] CalendarView - Date formatting and labels
  - [ ] CheckoutFlow - Step names and instructions
  
- [ ] **Facility Components**
  - [ ] FacilityCard - All displayed information
  - [ ] FacilityDetail - Descriptions and amenity lists
  - [ ] FacilitySearch - Filters and search placeholders
  - [ ] FacilityMap - Map controls and popups

- [ ] **Shared Components**
  - [ ] Navigation - All menu items and breadcrumbs
  - [ ] Footer - Links and copyright information
  - [ ] Error boundaries - Error messages
  - [ ] Loading states - Loading text and skeletons

### Page-Level Localization
- [ ] **Admin Pages**
  - [ ] Dashboard - All cards, charts, and statistics
  - [ ] User management - Forms and tables
  - [ ] Reports - Column headers and filters
  - [ ] Settings - All configuration options
  
- [ ] **Public Pages**
  - [ ] Home/Landing - Hero text and features
  - [ ] Facility listing - Filters and sorting
  - [ ] Booking flow - All steps and confirmations
  - [ ] User profile - Settings and preferences

### Missing Translation Areas
- [ ] **Toast notifications** - Success/error messages
- [ ] **Modal dialogs** - Confirmation and info modals
- [ ] **Validation messages** - Form-specific errors
- [ ] **Status indicators** - Loading, empty states
- [ ] **Accessibility labels** - Screen reader text

## Phase 4: New Translation Files

### Create Missing Translation Files
- [ ] **`dashboard.ts`** - Admin dashboard specific translations
- [ ] **`calendar.ts`** - Calendar-specific terminology
- [ ] **`pricing.ts`** - Pricing and billing terms
- [ ] **`zones.ts`** - Zone management terminology
- [ ] **`reports.ts`** - Analytics and reporting
- [ ] **`notifications.ts`** - System notifications
- [ ] **`onboarding.ts`** - User onboarding flow
- [ ] **`help.ts`** - Help and documentation

### Translation File Structure Template
```typescript
export const newFeatureTranslations = {
  NO: {
    title: "Norsk tittel",
    description: "Norsk beskrivelse",
    actions: {
      create: "Opprett",
      edit: "Rediger",
      delete: "Slett"
    },
    labels: {
      name: "Navn",
      email: "E-post"
    },
    messages: {
      loading: "Laster...",
      success: "Vellykket!",
      error: "Det oppstod en feil"
    },
    placeholders: {
      search: "Søk...",
      email: "Skriv inn e-post"
    }
  },
  EN: {
    title: "English title",
    description: "English description",
    actions: {
      create: "Create",
      edit: "Edit", 
      delete: "Delete"
    },
    labels: {
      name: "Name",
      email: "Email"
    },
    messages: {
      loading: "Loading...",
      success: "Success!",
      error: "An error occurred"
    },
    placeholders: {
      search: "Search...",
      email: "Enter email"
    }
  }
};
```

## Phase 5: Enhanced Localization Features

### Advanced Date/Time Formatting
- [ ] **Norwegian date formats** - DD.MM.YYYY format
- [ ] **English date formats** - MM/DD/YYYY format
- [ ] **Time zone handling** - Norwegian time zone
- [ ] **Relative dates** - "i dag", "i morgen" vs "today", "tomorrow"
- [ ] **Business hours** - Norwegian time conventions

### Number and Currency Formatting
- [ ] **Norwegian number format** - Space as thousands separator
- [ ] **Currency display** - NOK with proper symbols
- [ ] **Decimal handling** - Comma vs period in Norwegian
- [ ] **Percentage formatting** - Localized percentage display

### Enhanced Pluralization
```typescript
// Add pluralization support
const { t, plural } = useTranslation();

// Usage
plural('booking.count', count, {
  NO: { one: '1 reservasjon', other: '{count} reservasjoner' },
  EN: { one: '1 booking', other: '{count} bookings' }
});
```

### RTL Support Preparation
- [ ] **Layout considerations** - Prepare for future RTL languages
- [ ] **Icon direction** - Directional icons handling
- [ ] **Text alignment** - Flexible alignment system

## Phase 6: Translation Management Tools

### Development Tools
- [ ] **Translation key linter** - Detect missing translations
- [ ] **Unused key detector** - Find orphaned translation keys
- [ ] **Translation coverage report** - Track localization progress
- [ ] **Key extraction tool** - Auto-extract strings from components

### Admin Interface for Translations
- [ ] **Translation management UI** - Admin interface for editing
- [ ] **Real-time preview** - See changes immediately
- [ ] **Translation export/import** - Backup and restore
- [ ] **Translation history** - Track changes over time

### Quality Assurance
- [ ] **Translation validation** - Check for missing parameters
- [ ] **Consistency checking** - Ensure consistent terminology
- [ ] **Length validation** - Warn about very long translations
- [ ] **Special character handling** - Norwegian characters support

## Phase 7: Testing & Quality Assurance

### Automated Testing
- [ ] **Translation key tests** - Ensure all keys exist
- [ ] **Component rendering tests** - Test with both languages
- [ ] **E2E language switching** - Test language toggle functionality
- [ ] **Formatting tests** - Test date/currency formatting

### Manual Testing Checklist
- [ ] **Complete user flows** in both languages
- [ ] **UI layout testing** - Check for text overflow
- [ ] **Accessibility testing** - Screen reader compatibility
- [ ] **Mobile responsiveness** - Different text lengths

### Translation Quality Review
- [ ] **Native speaker review** - Norwegian translation accuracy
- [ ] **Context appropriateness** - Formal vs informal tone
- [ ] **Technical terminology** - Consistent domain terms
- [ ] **Cultural adaptation** - Norwegian business customs

## Phase 8: Performance Optimization

### Bundle Size Optimization
- [ ] **Code splitting** - Load only needed translations
- [ ] **Tree shaking** - Remove unused translation branches
- [ ] **Compression** - Minimize translation file sizes
- [ ] **Caching strategy** - Effective translation caching

### Runtime Performance
- [ ] **Translation preloading** - Load critical translations first
- [ ] **Lazy loading** - Load translations on demand
- [ ] **Memory management** - Efficient translation storage
- [ ] **Service worker** - Cache translations for offline use

## Implementation Guidelines

### Component Integration Pattern
```typescript
// Standard pattern for components
import { useTranslation } from '@/i18n';

export const MyComponent = () => {
  const { t, formatCurrency, formatDate } = useTranslation();
  
  return (
    <div>
      <h1>{t('myFeature.title')}</h1>
      <p>{t('myFeature.description')}</p>
      <Button>{t('common.actions.save')}</Button>
    </div>
  );
};
```

### Form Integration Pattern
```typescript
// Form validation with translations
import { z } from 'zod';
import { useTranslation } from '@/i18n';

export const useFormSchema = () => {
  const { t } = useTranslation();
  
  return z.object({
    name: z.string().min(1, t('validation.required.name')),
    email: z.string().email(t('validation.email.invalid'))
  });
};
```

## Success Criteria

### Technical Requirements
- [ ] **100% component coverage** - All components use translation hooks
- [ ] **Zero hardcoded text** - All user-facing text is translatable
- [ ] **Type safety** - Full TypeScript support for translation keys
- [ ] **Performance** - No significant impact on bundle size or runtime
- [ ] **Consistent patterns** - Uniform translation usage across codebase

### User Experience Requirements
- [ ] **Seamless language switching** - Instant language changes
- [ ] **Proper formatting** - Correct date/number formats per language
- [ ] **Complete translations** - No missing text in either language
- [ ] **Cultural appropriateness** - Norwegian business context awareness
- [ ] **Accessibility compliance** - Screen reader compatibility

### Maintenance Requirements
- [ ] **Easy updates** - Simple process for adding/changing translations
- [ ] **Developer experience** - Clear documentation and tools
- [ ] **Quality control** - Automated checks for translation completeness
- [ ] **Scalability** - Easy to add new languages in the future

## Timeline Estimate

- **Phase 1**: 2-3 days (Hook standardization)
- **Phase 2**: 3-4 days (Key structure enhancement)
- **Phase 3**: 7-10 days (Component coverage)
- **Phase 4**: 2-3 days (New translation files)
- **Phase 5**: 3-4 days (Enhanced features)
- **Phase 6**: 4-5 days (Management tools)
- **Phase 7**: 3-4 days (Testing & QA)
- **Phase 8**: 2-3 days (Performance optimization)

**Total Estimated Time**: 26-36 days

## Risk Mitigation

- **Backwards compatibility** - Maintain old keys during migration
- **Incremental rollout** - Component-by-component implementation
- **Fallback strategy** - Always provide English fallbacks
- **Native speaker review** - Ensure quality Norwegian translations
- **Automated testing** - Catch missing translations early
- **Documentation** - Clear guidelines for developers 