
import { ActorType, TimeSlotCategory } from '@/types/zone';

export interface PricingRule {
  id: string;
  name: string;
  description: string;
  actorType: ActorType;
  timeSlot?: TimeSlotCategory;
  dayType?: 'weekday' | 'weekend' | 'holiday';
  facilityTypes?: string[];
  multiplier: number;
  fixedPrice?: number;
  isActive: boolean;
  validFrom?: Date;
  validTo?: Date;
  priority: number; // Higher priority rules override lower priority
}

// Norwegian municipal pricing rules based on common practices
export const municipalPricingRules: PricingRule[] = [
  // Lag og Foreninger (Sports clubs and associations) - Heavily subsidized
  {
    id: "lag-foreninger-base",
    name: "Lag og foreninger - Grunnpris",
    description: "Grunnrabatt for registrerte lag og foreninger",
    actorType: "lag-foreninger",
    multiplier: 0.4, // 60% discount
    isActive: true,
    priority: 100
  },
  {
    id: "lag-foreninger-youth",
    name: "Ungdomslag - Ekstra rabatt",
    description: "Ytterligere rabatt for ungdomsaktiviteter",
    actorType: "lag-foreninger",
    multiplier: 0.2, // 80% discount
    isActive: true,
    priority: 110
  },

  // Paraply (Umbrella organizations) - Maximum discount
  {
    id: "paraply-base",
    name: "Paraplyorganisasjoner",
    description: "Maksimal rabatt for paraplyorganisasjoner",
    actorType: "paraply",
    multiplier: 0.1, // 90% discount
    isActive: true,
    priority: 120
  },

  // Kommunale enheter (Municipal units) - Internal rates
  {
    id: "kommunale-enheter-base",
    name: "Kommunale enheter",
    description: "Intern kommunal pris",
    actorType: "kommunale-enheter",
    multiplier: 0.3, // 70% discount
    isActive: true,
    priority: 130
  },

  // Private firma (Private companies) - Commercial rates
  {
    id: "private-firma-base",
    name: "Private bedrifter - Standard",
    description: "Kommersiell pris for private bedrifter",
    actorType: "private-firma",
    multiplier: 1.5, // 50% surcharge
    isActive: true,
    priority: 80
  },
  {
    id: "private-firma-evening",
    name: "Private bedrifter - Kveld",
    description: "Ekstra tillegg for kveldstid",
    actorType: "private-firma",
    timeSlot: "evening",
    multiplier: 2.0, // 100% surcharge
    isActive: true,
    priority: 85
  },

  // Private person (Private individuals) - Standard rates
  {
    id: "private-person-base",
    name: "Privatpersoner",
    description: "Standard pris for privatpersoner",
    actorType: "private-person",
    multiplier: 1.0, // No discount/surcharge
    isActive: true,
    priority: 90
  },

  // Time-based pricing
  {
    id: "evening-premium",
    name: "Kveldstillegg",
    description: "Tillegg for kveldstid (17:00-23:00)",
    actorType: "private-person", // Default, can be overridden
    timeSlot: "evening",
    multiplier: 1.3, // 30% surcharge
    isActive: true,
    priority: 50
  },
  {
    id: "night-premium",
    name: "Nattetillegg",
    description: "Tillegg for nattetid (23:00-06:00)",
    actorType: "private-person", // Default, can be overridden
    timeSlot: "night",
    multiplier: 1.8, // 80% surcharge
    isActive: true,
    priority: 60
  },

  // Weekend pricing
  {
    id: "weekend-premium",
    name: "Helgetillegg",
    description: "Tillegg for helger",
    actorType: "private-person", // Default, can be overridden
    dayType: "weekend",
    multiplier: 1.2, // 20% surcharge
    isActive: true,
    priority: 40
  },

  // Holiday pricing
  {
    id: "holiday-premium",
    name: "Helligdagstillegg",
    description: "Tillegg for helligdager",
    actorType: "private-person", // Default, can be overridden
    dayType: "holiday",
    multiplier: 1.5, // 50% surcharge
    isActive: true,
    priority: 45
  },

  // Facility-specific rules
  {
    id: "auditorium-premium",
    name: "Auditorium tillegg",
    description: "Ekstra kostnad for auditorier med scenebelysning",
    actorType: "private-person", // Default, can be overridden
    facilityTypes: ["Auditorium"],
    multiplier: 1.4, // 40% surcharge
    isActive: true,
    priority: 30
  },
  {
    id: "swimming-pool-premium",
    name: "Svømmehall tillegg",
    description: "Ekstra kostnad for svømmehaller",
    actorType: "private-person", // Default, can be overridden
    facilityTypes: ["Svømmehall"],
    multiplier: 1.6, // 60% surcharge
    isActive: true,
    priority: 35
  }
];

// Base prices per facility type (NOK per hour)
export const basePrices: Record<string, number> = {
  "Gymsal": 400,
  "Aktivitetshall": 600,
  "Auditorium": 800,
  "Møtesal": 200,
  "Møterom": 150,
  "Svømmehall": 1000,
  "Fotballhall": 800,
  "Studio": 300,
  "Klasserom": 180,
  "Idrettshall": 700,
  "Forsamlingssal": 500,
  "Teatersal": 900,
  "Aktivitetsrom": 250,
  "Menighetsal": 400,
  "Festsal": 600
};

// Helper functions
export const getBasePriceForFacilityType = (facilityType: string): number => {
  return basePrices[facilityType] || 300; // Default price
};

export const getApplicableRules = (
  actorType: ActorType,
  facilityType?: string,
  timeSlot?: TimeSlotCategory,
  dayType?: 'weekday' | 'weekend' | 'holiday'
): PricingRule[] => {
  return municipalPricingRules
    .filter(rule => {
      // Check actor type match
      if (rule.actorType !== actorType) return false;
      
      // Check facility type match (if specified)
      if (rule.facilityTypes && facilityType) {
        if (!rule.facilityTypes.includes(facilityType)) return false;
      }
      
      // Check time slot match (if specified)
      if (rule.timeSlot && timeSlot) {
        if (rule.timeSlot !== timeSlot) return false;
      }
      
      // Check day type match (if specified)
      if (rule.dayType && dayType) {
        if (rule.dayType !== dayType) return false;
      }
      
      return rule.isActive;
    })
    .sort((a, b) => b.priority - a.priority); // Higher priority first
};

export const calculateFinalPrice = (
  basePrice: number,
  applicableRules: PricingRule[]
): { finalPrice: number; appliedRules: PricingRule[] } => {
  let finalPrice = basePrice;
  const appliedRules: PricingRule[] = [];

  for (const rule of applicableRules) {
    if (rule.fixedPrice) {
      finalPrice = rule.fixedPrice;
    } else {
      finalPrice *= rule.multiplier;
    }
    appliedRules.push(rule);
  }

  return {
    finalPrice: Math.round(finalPrice),
    appliedRules
  };
};
