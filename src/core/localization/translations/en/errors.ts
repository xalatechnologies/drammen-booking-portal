/**
 * English error message translations
 */

export const errors = {
  // Generic error types
  validation: 'Validation error occurred',
  notFound: 'The requested resource was not found',
  unauthorized: 'You are not authorized to access this resource',
  forbidden: 'You do not have permission to perform this action',
  conflict: 'A conflict occurred with the current state of the resource',
  internal: 'An internal server error occurred',
  network: 'A network error occurred',
  timeout: 'The operation timed out',
  badRequest: 'The request was invalid',
  
  // Validation detail messages
  validationDetails: 'Validation failed for the following fields: {{fields}}',
  
  // Facility specific errors
  facilityNotFound: 'Facility with ID {{id}} not found',
  facilityCreateFailed: 'Failed to create facility',
  facilityUpdateFailed: 'Failed to update facility with ID {{id}}',
  facilityDeleteFailed: 'Failed to delete facility with ID {{id}}'
};
