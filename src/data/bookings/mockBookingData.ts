
import { Booking } from '@/types/booking';
import { ActorType, BookingType } from '@/types/pricing';

// Base booking data for different scenarios
export const approvedBookings: Booking[] = [
  {
    id: "booking-001",
    facilityId: "1",
    facilityName: "Brandengen Skole - Gymsal",
    zoneId: "zone-1-main",
    zoneName: "Hele gymsalen",
    userId: "user-001",
    organizationId: "org-001",
    status: "approved",
    type: "engangs",
    actorType: "lag-foreninger",
    
    startDate: new Date(2025, 4, 25, 14, 0),
    endDate: new Date(2025, 4, 25, 16, 0),
    duration: 120,
    timeSlot: "14:00-16:00",
    isRecurring: false,
    
    purpose: "Fotballtrening for ungdomslag",
    eventType: "training",
    expectedAttendees: 25,
    ageGroup: "youth",
    description: "Ukentlig fotballtrening for G16-laget. Trenger hele gymsalen for oppvarming og teknikktrening.",
    
    contactName: "Lars Hansen",
    contactEmail: "lars.hansen@drammenif.no",
    contactPhone: "+47 987 65 432",
    
    additionalServices: [
      {
        serviceId: "service-001",
        serviceName: "Ekstra rengjøring",
        quantity: 1,
        unitPrice: 200,
        totalPrice: 200,
        description: "Grundig rengjøring etter trening"
      }
    ],
    
    pricing: {
      basePrice: 800,
      servicesCost: 200,
      discounts: [
        {
          type: "lag-foreninger",
          description: "Rabatt for registrerte lag og foreninger",
          amount: 480,
          percentage: 60
        }
      ],
      surcharges: [],
      taxes: [],
      totalPrice: 520,
      currency: "NOK",
      calculatedAt: new Date(2025, 4, 20, 10, 30),
      breakdown: [
        { description: "Grunnpris (2 timer)", amount: 800, type: "base" },
        { description: "Ekstra rengjøring", amount: 200, type: "service" },
        { description: "Lag/foreninger rabatt (-60%)", amount: -480, type: "discount" }
      ]
    },
    
    requiresApproval: true,
    approvalStatus: "approved",
    approvalWorkflow: {
      id: "workflow-001",
      steps: [
        {
          id: "step-001",
          stepNumber: 1,
          approverRole: "facility-manager",
          status: "approved",
          isRequired: true,
          approvedAt: new Date(2025, 4, 20, 10, 30),
          approvedBy: "manager-001"
        }
      ],
      currentStep: 1,
      autoApprovalRules: [],
      escalationRules: []
    },
    
    createdAt: new Date(2025, 4, 18, 14, 15),
    updatedAt: new Date(2025, 4, 20, 10, 30),
    notes: [
      {
        id: "note-001",
        userId: "manager-001",
        userRole: "facility-manager",
        content: "Godkjent. Husk å følge sikkerhetsrutiner for ungdomsaktiviteter.",
        isInternal: true,
        createdAt: new Date(2025, 4, 20, 10, 30)
      }
    ],
    attachments: []
  }
];

export const pendingBookings: Booking[] = [
  {
    id: "booking-002",
    facilityId: "3",
    facilityName: "Papirbredden - Auditorium",
    zoneId: "zone-3-main",
    zoneName: "Auditorium",
    userId: "user-002",
    status: "pending-approval",
    type: "engangs",
    actorType: "private-firma",
    
    startDate: new Date(2025, 5, 3, 18, 0),
    endDate: new Date(2025, 5, 3, 21, 0),
    duration: 180,
    timeSlot: "18:00-21:00",
    isRecurring: false,
    
    purpose: "Bedriftspresentasjon og produktlansering",
    eventType: "conference",
    expectedAttendees: 80,
    ageGroup: "adults",
    description: "Lansering av ny produktserie for kunder og partnere. Trenger profesjonelt lydsystem og projektor.",
    
    contactName: "Marte Olsen",
    contactEmail: "marte.olsen@techfirma.no",
    contactPhone: "+47 123 45 678",
    
    additionalServices: [
      {
        serviceId: "service-002",
        serviceName: "Teknisk support",
        quantity: 3,
        unitPrice: 400,
        totalPrice: 1200,
        description: "Teknisk bemanning under arrangement"
      },
      {
        serviceId: "service-003",
        serviceName: "Catering setup",
        quantity: 1,
        unitPrice: 800,
        totalPrice: 800,
        description: "Oppsett for servering i foajé"
      }
    ],
    
    pricing: {
      basePrice: 2700,
      servicesCost: 2000,
      discounts: [],
      surcharges: [
        {
          type: "evening-premium",
          description: "Kveldstillegg for private bedrifter",
          amount: 1200,
          percentage: 80
        }
      ],
      taxes: [],
      totalPrice: 4700,
      currency: "NOK",
      calculatedAt: new Date(2025, 4, 28, 9, 15),
      breakdown: [
        { description: "Grunnpris auditorium (3 timer)", amount: 1500, type: "base" },
        { description: "Kveldstillegg private bedrifter (+80%)", amount: 1200, type: "surcharge" },
        { description: "Teknisk support (3t)", amount: 1200, type: "service" },
        { description: "Catering setup", amount: 800, type: "service" }
      ]
    },
    
    requiresApproval: true,
    approvalStatus: "pending",
    approvalWorkflow: {
      id: "workflow-002",
      steps: [
        {
          id: "step-002",
          stepNumber: 1,
          approverRole: "facility-manager",
          status: "pending",
          isRequired: true,
          deadline: new Date(2025, 5, 1, 12, 0)
        }
      ],
      currentStep: 1,
      autoApprovalRules: [],
      escalationRules: [
        {
          id: "escalation-001",
          triggerAfterHours: 48,
          escalateTo: "department-head",
          notificationMessage: "Booking awaiting approval for over 48 hours"
        }
      ]
    },
    
    createdAt: new Date(2025, 4, 28, 9, 15),
    updatedAt: new Date(2025, 4, 28, 9, 15),
    notes: [],
    attachments: [
      {
        id: "attachment-001",
        fileName: "event-program.pdf",
        fileSize: 2048000,
        mimeType: "application/pdf",
        url: "/uploads/event-program.pdf",
        uploadedBy: "user-002",
        uploadedAt: new Date(2025, 4, 28, 9, 20)
      }
    ]
  }
];

export const rejectedBookings: Booking[] = [
  {
    id: "booking-004",
    facilityId: "1",
    facilityName: "Brandengen Skole - Gymsal",
    zoneId: "zone-1-main",
    zoneName: "Hele gymsalen",
    userId: "user-004",
    status: "rejected",
    type: "engangs",
    actorType: "private-person",
    
    startDate: new Date(2025, 4, 28, 19, 0),
    endDate: new Date(2025, 4, 28, 22, 0),
    duration: 180,
    timeSlot: "19:00-22:00",
    isRecurring: false,
    
    purpose: "Privat bursdagsfest",
    eventType: "celebration",
    expectedAttendees: 45,
    ageGroup: "mixed",
    description: "50-års bursdagsfest med middag og dans",
    
    contactName: "Per Johansen",
    contactEmail: "per.johansen@gmail.com",
    contactPhone: "+47 987 12 345",
    
    additionalServices: [
      {
        serviceId: "service-004",
        serviceName: "Alkoholservering",
        quantity: 1,
        unitPrice: 500,
        totalPrice: 500,
        description: "Tillatelse for alkoholservering"
      }
    ],
    
    pricing: {
      basePrice: 1200,
      servicesCost: 500,
      discounts: [],
      surcharges: [
        {
          type: "evening-premium",
          description: "Kveldstillegg",
          amount: 360,
          percentage: 30
        }
      ],
      taxes: [],
      totalPrice: 2060,
      currency: "NOK",
      calculatedAt: new Date(2025, 4, 25, 16, 30),
      breakdown: [
        { description: "Grunnpris gymsal (3 timer)", amount: 1200, type: "base" },
        { description: "Kveldstillegg (+30%)", amount: 360, type: "surcharge" },
        { description: "Alkoholservering", amount: 500, type: "service" }
      ]
    },
    
    requiresApproval: true,
    approvalStatus: "rejected",
    approvalWorkflow: {
      id: "workflow-004",
      steps: [
        {
          id: "step-004",
          stepNumber: 1,
          approverRole: "facility-manager",
          status: "rejected",
          isRequired: true,
          approvedAt: new Date(2025, 4, 26, 9, 45),
          approvedBy: "manager-001",
          rejectionReason: "Skolelokale kan ikke brukes til private fester med alkoholservering",
          notes: "Se kommunens retningslinjer for bruk av skolelokaler"
        }
      ],
      currentStep: 1,
      autoApprovalRules: [],
      escalationRules: []
    },
    
    createdAt: new Date(2025, 4, 25, 16, 30),
    updatedAt: new Date(2025, 4, 26, 9, 45),
    notes: [
      {
        id: "note-003",
        userId: "manager-001",
        userRole: "facility-manager",
        content: "Avslått pga. alkoholservering i skolelokale. Foreslår alternativt lokale som Papirbredden.",
        isInternal: false,
        createdAt: new Date(2025, 4, 26, 9, 45)
      }
    ],
    attachments: []
  }
];
