/**
 * Environment configuration
 * 
 * This file centralizes access to environment variables and provides
 * fallback values for development. In production, these values should
 * be set in the actual environment.
 */

// Supabase configuration
export const SUPABASE_URL = "https://szpdoihoxzlivothoyva.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cGRvaWhveHpsaXZvdGhveXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0Mzk5MzksImV4cCI6MjA2NjAxNTkzOX0.4j3PYVkUpQZce-631weYhyICrUKfBk3LV5drs_tYExc";

// Edge Functions
export const EDGE_FUNCTION_BASE_URL = `${SUPABASE_URL}/functions/v1`;
export const GENERIC_ENTITY_URL = `${EDGE_FUNCTION_BASE_URL}/generic-entity`;
