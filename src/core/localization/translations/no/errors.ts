/**
 * Norwegian error message translations
 */

export const errors = {
  // Generic error types
  validation: 'Valideringsfeil oppstod',
  notFound: 'Ressursen ble ikke funnet',
  unauthorized: 'Du er ikke autorisert til å få tilgang til denne ressursen',
  forbidden: 'Du har ikke tillatelse til å utføre denne handlingen',
  conflict: 'En konflikt oppstod med gjeldende tilstand til ressursen',
  internal: 'Det oppstod en intern serverfeil',
  network: 'Det oppstod en nettverksfeil',
  timeout: 'Operasjonen ble tidsavbrutt',
  badRequest: 'Forespørselen var ugyldig',
  
  // Validation detail messages
  validationDetails: 'Validering mislyktes for følgende felt: {{fields}}',
  
  // Facility specific errors
  facilityNotFound: 'Anlegg med ID {{id}} ble ikke funnet',
  facilityCreateFailed: 'Kunne ikke opprette anlegg',
  facilityUpdateFailed: 'Kunne ikke oppdatere anlegg med ID {{id}}',
  facilityDeleteFailed: 'Kunne ikke slette anlegg med ID {{id}}'
};
