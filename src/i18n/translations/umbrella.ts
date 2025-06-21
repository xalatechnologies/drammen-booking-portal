export const umbrellaTranslations = {
  NO: {
    // Sidebar navigation
    sidebar: {
      menu: "MENY",
      dashboard: "Dashboard",
      allocatedTime: "Tildelt rammetid",
      distribution: "Fordeling",
      users: "Brukere",
      historyLog: "Logg / Historikk",
      messages: "Meldinger / Varsler",
      releaseTime: "Frigi tid til strøtimer"
    },

    // Header
    header: {
      searchPlaceholder: "Søk i din organisasjon...",
      notifications: "Varsler",
      markAllAsRead: "Marker alle som lest",
      noNewNotifications: "Ingen nye varsler",
      myAccount: "Min Konto",
      settings: "Innstillinger",
      logout: "Logg ut",
      umbrellaAdmin: "Paraplyadministrator"
    },

    // Overview page
    overview: {
      title: "Oversiktsside for Paraplyorganisasjon",
      description: "Administrer tildelt rammetid og fordeling til underaktører",
      allocatedTime: {
        title: "Mine tildelte tider (Rammetid)",
        description: "Kalenderoversikt over rammetid og status",
        total: "Totalt tildelt",
        used: "Fordelt",
        remaining: "Ufordelt",
        utilization: "Utnyttelse",
        viewCalendar: "Se kalenderoversikt"
      },
      distributions: {
        title: "Fordelinger til klubber/foreninger",
        description: "Liste over hvilke tider som er fordelt til hvem",
        hours: "timer",
        edit: "Endre",
        recall: "Tilbakekall"
      },
      releasedTime: {
        title: "Frigitt tid",
        description: "Oversikt over tider som er frigitt (automatisk eller manuelt)",
        released: "Frigitt",
        converted: "Konvertert til strøtimer",
        notConverted: "Ikke konvertert"
      },
      notifications: {
        title: "Varsler",
        description: "Kun relevante varsler"
      },
      history: {
        title: "Historikk og logg",
        description: "Hvem som har gjort hva",
        viewAll: "Se all historikk"
      },
      cards: {
        bookings: {
          title: "Reservasjoner",
          description: "Totalt antall reservasjoner denne måneden",
          trend: "fra forrige måned"
        },
        users: {
          title: "Brukere",
          description: "Totalt antall aktive brukere"
        },
        avgBookingDuration: {
          title: "Gjennomsnittlig reservasjonstid",
          description: "Gjennomsnittlig varighet av reservasjoner"
        },
        alerts: {
          title: "Varsler",
          description: "Systemvarsler og meldinger"
        },
        tasks: {
          title: "Oppgaver",
          description: "Pågående oppgaver og fremdrift"
        },
        loadingState: {
          title: "Laster til stand",
          description: "Viser en lastende tilstand"
        },
        errorState: {
          title: "Feil tilstand",
          description: "Viser en feil tilstand"
        }
      },
      alerts: {
        lowServerResources: "Lave serverressurser",
        pendingUserApprovals: "Ventende brukergodkjenninger"
      },
      tasks: {
        databaseOptimization: "Databaseoptimalisering",
        userInterfaceImprovements: "Brukergrensesnittforbedringer"
      },
      buttons: {
        loadData: "Last data",
        triggerError: "Utløs feil"
      },
      loading: "Laster...",
      error: "Feil: Kunne ikke hente data."
    },

    // Users page
    users: {
      title: "Brukere & Organisasjoner",
      description: "Administrer tilgang og roller for brukere i paraplysystemet.",
      addUser: "Legg til bruker",
      allUsers: "Alle brukere",
      allUsersDescription: "Oversikt over alle registrerte brukere og deres organisasjoner.",
      search: {
        placeholder: "Søk etter navn, e-post eller organisasjon...",
        filterByRole: "Filtrer etter rolle",
        filterByStatus: "Filtrer etter status",
        allRoles: "Alle roller",
        allStatuses: "Alle statuser"
      },
      roles: {
        leader: "Leder",
        contact: "Kontakt",
        responsible: "Ansvarlig"
      },
      status: {
        active: "Aktiv",
        inactive: "Inaktiv"
      },
      actions: {
        edit: "Rediger",
        delete: "Slett"
      }
    },

    // Distribution page
    distribution: {
      title: "Tidsfordeling",
      description: "Administrer fordeling av tilgjengelig tid mellom organisasjoner",
      timeAllocation: "Tidsfordeling",
      timeAllocationDescription: "Oversikt over hvordan tiden er fordelt mellom organisasjoner",
      addAllocation: "Legg til fordeling",
      organization: "Organisasjon",
      allocatedHours: "Tildelte timer",
      usedHours: "Brukte timer",
      remainingHours: "Gjenværende timer",
      percentage: "Prosent",
      actions: {
        edit: "Rediger fordeling",
        delete: "Slett fordeling"
      }
    },

    // History Log page
    historyLog: {
      title: "Historikk og Logg",
      description: "Se historikk over alle endringer og aktiviteter",
      activityLog: "Aktivitetslogg",
      activityLogDescription: "Detaljert oversikt over alle systemaktivitetene",
      filterByDate: "Filtrer etter dato",
      filterByUser: "Filtrer etter bruker",
      filterByAction: "Filtrer etter handling",
      allActions: "Alle handlinger",
      allUsers: "Alle brukere",
      date: "Dato",
      user: "Bruker",
      action: "Handling",
      details: "Detaljer",
      noActivity: "Ingen aktivitet funnet"
    },

    // Messages page
    messages: {
      title: "Meldinger og Varsler",
      description: "Administrer systemmeldinger og varsler",
      notifications: "Varsler",
      notificationsDescription: "Oversikt over alle systemvarsler og meldinger",
      sendMessage: "Send melding",
      newNotification: "Nytt varsel",
      newNotificationDescription: "Drammen Håndballklubb har fått 10 nye timer.",
      userAdded: "Bruker har blitt lagt til",
      userAddedDescription: "Geir Gulliksen er nå en del av din organisasjon.",
      timeAgo: {
        minutes: "minutter siden",
        hours: "timer siden",
        days: "dager siden"
      }
    },

    // Release Time page
    releaseTime: {
      title: "Frigi Tid til Strøtimer",
      description: "Administrer frigivelse av tildelt tid til strøtimer",
      releaseTime: "Frigi tid",
      releaseTimeDescription: "Frigi tildelt tid som kan brukes av andre organisasjoner",
      releaseHours: "Frigi timer",
      reason: "Årsak",
      confirmRelease: "Bekreft frigivelse",
      cancelRelease: "Avbryt frigivelse",
      releaseSuccess: "Tid frigitt successfully",
      releaseError: "Feil ved frigivelse av tid"
    },

    // Allocated Time page
    allocatedTime: {
      title: "Tildelt Rammetid",
      description: "Full oversikt over tildelt tid og verktøy for viderefordeling",
      allocatedTime: "Tildelt tid",
      allocatedTimeDescription: "Se og administrer tildelt rammetid",
      totalAllocated: "Totalt tildelt",
      used: "Brukt",
      remaining: "Gjenværende",
      utilization: "Utnyttelse",
      overview: {
        title: "Oversikt over tildelt tid",
        description: "Visning i tabell- og kalenderformat",
        tableView: "Tabell",
        calendarView: "Kalender",
        searchPlaceholder: "Søk etter lokasjon eller aktør...",
        filterLocation: "Filtrer lokasjon",
        filterStatus: "Filtrer status",
        statusDistributed: "Fordelt",
        statusUndistributed: "Ufordelt",
        statusPartially: "Delvis fordelt",
        export: "Eksporter",
        exportExcel: "Eksporter til Excel med metadata",
        exportPDF: "Eksporter til PDF med metadata",
        location: "Lokasjon",
        weekdays: "Ukedag(er)",
        timeSlot: "Klokkeslett",
        period: "Periode",
        status: "Status",
        distributedTo: "Fordelt til",
        actions: "Handlinger",
        calendarComingSoon: "Kalendervisning kommer snart",
        tooltips: {
          assign: "Tildel tid til underaktør",
          distribute: "Fordel tid til underaktør",
          edit: "Endre tildeling",
          release: "Frigi tildelt tid",
          partialDetails: "Klikk for å se detaljer om fordeling"
        }
      },
      assign: {
        title: "Tildel ufordelt tid",
        description: "Velg aktør og tildel tid som ikke er fordelt",
        selectActor: "Velg aktør",
        selectActorPlaceholder: "Velg aktør...",
        selectDates: "Velg dato(er)",
        assign: "Tildel"
      },
      partialDetails: {
        title: "Detaljer for delvis fordeling",
        description: "Oversikt over fordelt og ledig tid",
        distributed: "Fordelt tid",
        available: "Ledig tid",
        close: "Lukk"
      },
      distribute: {
        title: "Viderefordel rammetid",
        description: "Velg aktør og tildel tid",
        selectActor: "Velg aktør",
        selectActorPlaceholder: "Velg aktør...",
        selectDates: "Velg dato(er)",
        assign: "Tildel"
      },
      edit: {
        title: "Endre fordeling",
        description: "Endre eller trekke tilbake tildeling",
        newActor: "Ny aktør",
        selectNewActor: "Velg ny aktør...",
        recall: "Trekke tilbake"
      },
      release: {
        title: "Frigi tid",
        description: "Velg dato(er) eller periode og frigi tid",
        selectPeriod: "Velg periode",
        startDate: "Startdato",
        endDate: "Sluttdato",
        convertToSpare: "Konverter til strøtimer",
        confirm: "Frigi tid"
      },
      history: {
        title: "Historikk og logg",
        description: "Full loggvisning av alle endringer",
        exportLog: "Eksporter logg til Excel/PDF"
      }
    },

    // Common
    common: {
      loading: "Laster...",
      error: "Feil",
      success: "Suksess",
      cancel: "Avbryt",
      save: "Lagre",
      delete: "Slett",
      edit: "Rediger",
      view: "Vis",
      add: "Legg til",
      search: "Søk",
      filter: "Filtrer",
      export: "Eksporter",
      import: "Importer",
      refresh: "Oppdater",
      close: "Lukk",
      confirm: "Bekreft",
      yes: "Ja",
      no: "Nei",
      all: "Alle",
      none: "Ingen",
      high: "Høy",
      medium: "Medium",
      low: "Lav",
      active: "Aktiv",
      inactive: "Inaktiv",
      pending: "Ventende",
      approved: "Godkjent",
      rejected: "Avvist",
      completed: "Fullført",
      cancelled: "Kansellert",
      new: "Ny",
      adjust: "Juster tid"
    }
  },
  EN: {
    // Sidebar navigation
    sidebar: {
      menu: "MENU",
      dashboard: "Dashboard",
      allocatedTime: "Allocated Time",
      distribution: "Distribution",
      users: "Users",
      historyLog: "History Log",
      messages: "Messages & Notifications",
      releaseTime: "Release Time to Spare Hours"
    },

    // Header
    header: {
      searchPlaceholder: "Search in your organization...",
      notifications: "Notifications",
      markAllAsRead: "Mark all as read",
      noNewNotifications: "No new notifications",
      myAccount: "My Account",
      settings: "Settings",
      logout: "Logout",
      umbrellaAdmin: "Umbrella Administrator"
    },

    // Overview page
    overview: {
      title: "Umbrella Organization Overview",
      description: "Manage allocated time and distribution to subcontractors",
      allocatedTime: {
        title: "My Allocated Time (Frame Time)",
        description: "Calendar overview of frame time and status",
        total: "Total Allocated",
        used: "Distributed",
        remaining: "Undistributed",
        utilization: "Utilization",
        viewCalendar: "View Calendar Overview"
      },
      distributions: {
        title: "Distributions to clubs/associations",
        description: "List of which times are distributed to whom",
        hours: "hours",
        edit: "Edit",
        recall: "Recall"
      },
      releasedTime: {
        title: "Released Time",
        description: "Overview of times that have been released (automatic or manual)",
        released: "Released",
        converted: "Converted to spare hours",
        notConverted: "Not converted"
      },
      notifications: {
        title: "Notifications",
        description: "Only relevant notifications"
      },
      history: {
        title: "History and Log",
        description: "Who has done what",
        viewAll: "View All History"
      },
      cards: {
        bookings: {
          title: "Bookings",
          description: "Total number of bookings this month",
          trend: "from last month"
        },
        users: {
          title: "Users",
          description: "Total number of active users"
        },
        avgBookingDuration: {
          title: "Avg. Booking Duration",
          description: "Average duration of bookings"
        },
        alerts: {
          title: "Alerts",
          description: "System alerts and notifications"
        },
        tasks: {
          title: "Tasks",
          description: "Ongoing tasks and progress"
        },
        loadingState: {
          title: "Loading State",
          description: "Demonstrates a loading state"
        },
        errorState: {
          title: "Error State",
          description: "Demonstrates an error state"
        }
      },
      alerts: {
        lowServerResources: "Low server resources",
        pendingUserApprovals: "Pending user approvals"
      },
      tasks: {
        databaseOptimization: "Database optimization",
        userInterfaceImprovements: "User interface improvements"
      },
      buttons: {
        loadData: "Load Data",
        triggerError: "Trigger Error"
      },
      loading: "Loading...",
      error: "Error: Could not fetch data."
    },

    // Users page
    users: {
      title: "Users & Organizations",
      description: "Manage access and roles for users in the umbrella system.",
      addUser: "Add User",
      allUsers: "All Users",
      allUsersDescription: "Overview of all registered users and their organizations.",
      search: {
        placeholder: "Search by name, email or organization...",
        filterByRole: "Filter by role",
        filterByStatus: "Filter by status",
        allRoles: "All roles",
        allStatuses: "All statuses"
      },
      roles: {
        leader: "Leader",
        contact: "Contact",
        responsible: "Responsible"
      },
      status: {
        active: "Active",
        inactive: "Inactive"
      },
      actions: {
        edit: "Edit",
        delete: "Delete"
      }
    },

    // Distribution page
    distribution: {
      title: "Time Distribution",
      description: "Manage distribution of available time between organizations",
      timeAllocation: "Time Allocation",
      timeAllocationDescription: "Overview of how time is distributed between organizations",
      addAllocation: "Add Allocation",
      organization: "Organization",
      allocatedHours: "Allocated Hours",
      usedHours: "Used Hours",
      remainingHours: "Remaining Hours",
      percentage: "Percentage",
      actions: {
        edit: "Edit allocation",
        delete: "Delete allocation"
      }
    },

    // History Log page
    historyLog: {
      title: "History and Log",
      description: "View history of all changes and activities",
      activityLog: "Activity Log",
      activityLogDescription: "Detailed overview of all system activities",
      filterByDate: "Filter by date",
      filterByUser: "Filter by user",
      filterByAction: "Filter by action",
      allActions: "All actions",
      allUsers: "All users",
      date: "Date",
      user: "User",
      action: "Action",
      details: "Details",
      noActivity: "No activity found"
    },

    // Messages page
    messages: {
      title: "Messages and Notifications",
      description: "Manage system messages and notifications",
      notifications: "Notifications",
      notificationsDescription: "Overview of all system notifications and messages",
      sendMessage: "Send Message",
      newNotification: "New time allocated",
      newNotificationDescription: "Drammen Handball Club has received 10 new hours.",
      userAdded: "User has been added",
      userAddedDescription: "Geir Gulliksen is now part of your organization.",
      timeAgo: {
        minutes: "minutes ago",
        hours: "hours ago",
        days: "days ago"
      }
    },

    // Release Time page
    releaseTime: {
      title: "Release Time to Spare Hours",
      description: "Manage release of allocated time to spare hours",
      releaseTime: "Release Time",
      releaseTimeDescription: "Release allocated time that can be used by other organizations",
      releaseHours: "Release Hours",
      reason: "Reason",
      confirmRelease: "Confirm Release",
      cancelRelease: "Cancel Release",
      releaseSuccess: "Time released successfully",
      releaseError: "Error releasing time"
    },

    // Allocated Time page
    allocatedTime: {
      title: "Allocated Time",
      description: "Full overview of allocated time and tools for redistribution",
      allocatedTime: "Allocated Time",
      allocatedTimeDescription: "View and manage allocated time",
      totalAllocated: "Total Allocated",
      used: "Used",
      remaining: "Remaining",
      utilization: "Utilization",
      overview: {
        title: "Overview of Allocated Time",
        description: "View in table and calendar format",
        tableView: "Table",
        calendarView: "Calendar",
        searchPlaceholder: "Search by location or actor...",
        filterLocation: "Filter location",
        filterStatus: "Filter status",
        statusDistributed: "Distributed",
        statusUndistributed: "Undistributed",
        statusPartially: "Partially distributed",
        export: "Export",
        exportExcel: "Export to Excel with metadata",
        exportPDF: "Export to PDF with metadata",
        location: "Location",
        weekdays: "Weekday(s)",
        timeSlot: "Time",
        period: "Period",
        status: "Status",
        distributedTo: "Distributed to",
        actions: "Actions",
        calendarComingSoon: "Calendar view coming soon",
        tooltips: {
          assign: "Assign time to subcontractor",
          distribute: "Distribute time to subcontractor",
          edit: "Edit allocation",
          release: "Release allocated time",
          partialDetails: "Click for details about distribution"
        }
      },
      assign: {
        title: "Assign undistributed time",
        description: "Select actor and assign time that is not distributed",
        selectActor: "Select Actor",
        selectActorPlaceholder: "Select actor...",
        selectDates: "Select date(s)",
        assign: "Assign"
      },
      partialDetails: {
        title: "Details for partially distributed time",
        description: "Overview of distributed and available time",
        distributed: "Distributed time",
        available: "Available time",
        close: "Close"
      },
      distribute: {
        title: "Distribute time",
        description: "Select actor and assign time",
        selectActor: "Select Actor",
        selectActorPlaceholder: "Select actor...",
        selectDates: "Select date(s)",
        assign: "Assign"
      },
      edit: {
        title: "Edit Distribution",
        description: "Change or recall assignment",
        newActor: "New Actor",
        selectNewActor: "Select new actor...",
        recall: "Recall"
      },
      release: {
        title: "Release Time",
        description: "Select date(s) or period and release time",
        selectPeriod: "Select Period",
        startDate: "Start Date",
        endDate: "End Date",
        convertToSpare: "Convert to spare hours",
        confirm: "Release Time"
      },
      history: {
        title: "History and Log",
        description: "Full log view of all changes",
        exportLog: "Export log to Excel/PDF"
      }
    },

    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      add: "Add",
      search: "Search",
      filter: "Filter",
      export: "Export",
      import: "Import",
      refresh: "Refresh",
      close: "Close",
      confirm: "Confirm",
      yes: "Yes",
      no: "No",
      all: "All",
      none: "None",
      high: "High",
      medium: "Medium",
      low: "Low",
      active: "Active",
      inactive: "Inactive",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      completed: "Completed",
      cancelled: "Cancelled",
      new: "New",
      adjust: "Adjust Time"
    }
  }
}; 