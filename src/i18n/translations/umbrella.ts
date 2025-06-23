export const umbrellaTranslations = {
  NO: {
    // Sidebar navigation
    sidebar: {
      menu: "MENY",
      dashboard: "Dashboard",
      allocatedTime: "Tildelt rammetid",
      distribution: "Fordeling",
      users: "Brukere",
      historyLog: "Logg",
      messages: "Varsler",
      releaseTime: "Strøtimer"
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
  }
}; 