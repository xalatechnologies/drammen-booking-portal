
import { Booking } from '@/types/booking';

// Recurring booking scenarios
export const recurringBookings: Booking[] = [
  {
    id: "booking-003",
    facilityId: "2",
    facilityName: "Fjell Skole - Aktivitetshall",
    zoneId: "zone-2-main",
    zoneName: "Hele aktivitetshallen",
    userId: "user-003",
    organizationId: "org-002",
    status: "confirmed",
    type: "fastlan",
    actorType: "paraply",
    
    startDate: new Date(2025, 4, 26, 19, 0),
    endDate: new Date(2025, 4, 26, 21, 0),
    duration: 120,
    timeSlot: "19:00-21:00",
    isRecurring: true,
    recurrencePattern: {
      type: "weekly",
      interval: 1,
      daysOfWeek: [1], // Monday
      endDate: new Date(2025, 11, 15), // December 15, 2025
      exceptions: [
        new Date(2025, 6, 14), // Skip July 14 (summer break)
        new Date(2025, 6, 21), // Skip July 21 (summer break)
        new Date(2025, 9, 6)   // Skip October 6 (fall break)
      ]
    },
    
    purpose: "Håndballtrening Drammen Håndballklubb",
    eventType: "training",
    expectedAttendees: 30,
    ageGroup: "mixed",
    description: "Fast håndballtrening for seniorlag. Paraplyorganisasjon for flere lokale håndballklubber.",
    
    contactName: "Kari Nordahl",
    contactEmail: "kari.nordahl@drammenhk.no",
    contactPhone: "+47 456 78 901",
    
    additionalServices: [],
    
    pricing: {
      basePrice: 1200,
      servicesCost: 0,
      discounts: [
        {
          type: "paraply",
          description: "Maksimal rabatt for paraplyorganisasjoner",
          amount: 1080,
          percentage: 90
        }
      ],
      surcharges: [],
      taxes: [],
      totalPrice: 120,
      currency: "NOK",
      calculatedAt: new Date(2025, 3, 15, 11, 0),
      breakdown: [
        { description: "Grunnpris aktivitetshall (2 timer)", amount: 1200, type: "base" },
        { description: "Paraplyorganisasjon rabatt (-90%)", amount: -1080, type: "discount" }
      ]
    },
    
    requiresApproval: true,
    approvalStatus: "approved",
    approvalWorkflow: {
      id: "workflow-003",
      steps: [
        {
          id: "step-003",
          stepNumber: 1,
          approverRole: "sports-coordinator",
          status: "approved",
          isRequired: true,
          approvedAt: new Date(2025, 3, 18, 14, 20),
          approvedBy: "coordinator-001",
          notes: "Fast lån godkjent for sesong 2025/2026"
        }
      ],
      currentStep: 1,
      autoApprovalRules: [],
      escalationRules: []
    },
    
    createdAt: new Date(2025, 3, 15, 11, 0),
    updatedAt: new Date(2025, 3, 18, 14, 20),
    notes: [
      {
        id: "note-002",
        userId: "coordinator-001",
        userRole: "sports-coordinator",
        content: "Fast lån godkjent for hele sesongen. Kontakt ved endringer i treningstider.",
        isInternal: false,
        createdAt: new Date(2025, 3, 18, 14, 20)
      }
    ],
    attachments: []
  }
];

// Municipal/internal bookings
export const municipalBookings: Booking[] = [
  {
    id: "booking-005",
    facilityId: "3",
    facilityName: "Papirbredden - Auditorium",
    zoneId: "zone-3-main",
    zoneName: "Auditorium",
    userId: "user-005",
    organizationId: "org-003",
    status: "confirmed",
    type: "engangs",
    actorType: "kommunale-enheter",
    
    startDate: new Date(2025, 5, 10, 9, 0),
    endDate: new Date(2025, 5, 10, 15, 0),
    duration: 360,
    timeSlot: "09:00-15:00",
    isRecurring: false,
    
    purpose: "Årlig medarbeiderkonferanse Drammen Kommune",
    eventType: "conference",
    expectedAttendees: 120,
    ageGroup: "adults",
    description: "Intern konferanse for alle kommunalt ansatte. Tema: Digital transformasjon.",
    
    contactName: "Anne Knutsen",
    contactEmail: "anne.knutsen@drammen.kommune.no",
    contactPhone: "+47 32 04 70 00",
    
    additionalServices: [
      {
        serviceId: "service-005",
        serviceName: "Teknisk support hele dagen",
        quantity: 6,
        unitPrice: 400,
        totalPrice: 2400,
        description: "Teknisk bemanning 6 timer"
      },
      {
        serviceId: "service-006",
        serviceName: "Lunch catering",
        quantity: 120,
        unitPrice: 150,
        totalPrice: 18000,
        description: "Lunch for alle deltakere"
      }
    ],
    
    pricing: {
      basePrice: 9000,
      servicesCost: 20400,
      discounts: [
        {
          type: "kommunale-enheter",
          description: "Intern kommunal pris",
          amount: 6300,
          percentage: 70
        }
      ],
      surcharges: [],
      taxes: [],
      totalPrice: 23100,
      currency: "NOK",
      calculatedAt: new Date(2025, 4, 5, 10, 0),
      breakdown: [
        { description: "Grunnpris auditorium (6 timer)", amount: 9000, type: "base" },
        { description: "Kommunal enhet rabatt (-70%)", amount: -6300, type: "discount" },
        { description: "Teknisk support (6t)", amount: 2400, type: "service" },
        { description: "Lunch catering (120 pers)", amount: 18000, type: "service" }
      ]
    },
    
    requiresApproval: false,
    approvalStatus: "not-required",
    
    createdAt: new Date(2025, 4, 5, 10, 0),
    updatedAt: new Date(2025, 4, 5, 10, 0),
    notes: [],
    attachments: []
  }
];
