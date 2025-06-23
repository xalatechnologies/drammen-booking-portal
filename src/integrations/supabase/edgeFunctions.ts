import { supabase } from './client';
import { ApiResponse } from '@/types/api';

// Constants for Edge Function calls
const BASE_URL = 'https://szpdoihoxzlivothoyva.supabase.co/functions/v1';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cGRvaWhveHpsaXZvdGhveXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0Mzk5MzksImV4cCI6MjA2NjAxNTkzOX0.4j3PYVkUpQZce-631weYhyICrUKfBk3LV5drs_tYExc';

/**
 * Enhanced Edge Function caller with retry logic and better error handling
 * Uses direct HTTP fetch which is more reliable than supabase.functions.invoke
 * @param functionName Name of the Edge Function to call
 * @param method HTTP method to use
 * @param body Request body
 * @param retries Number of retries on failure
 * @returns ApiResponse with data or error
 */
export async function callEdgeFunction<T>(
  functionName: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  retries = 2
): Promise<ApiResponse<T>> {
  let attempts = 0;
  const maxAttempts = retries + 1;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    try {
      console.log(`EdgeFunction.${functionName} - Attempt ${attempts}/${maxAttempts} with method ${method}`);
      
      // Add a small delay between retries
      if (attempts > 1) {
        await new Promise(resolve => setTimeout(resolve, 500 * attempts));
      }
      
      // Build URL and request options based on method
      let url = `${BASE_URL}/${functionName}`;
      
      // For GET requests with parameters, convert body to query params
      if (method === 'GET' && body) {
        const params = new URLSearchParams();
        Object.entries(body).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        url = `${url}?${params.toString()}`;
      }
      
      // Prepare fetch options
      const options: RequestInit = {
        method,
        headers: {
          'Authorization': `Bearer ${ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      };
      
      // Add body for non-GET requests
      if (method !== 'GET' && body) {
        options.body = JSON.stringify(body);
      }
      
      console.log(`EdgeFunction.${functionName} - Request URL:`, url);
      const response = await fetch(url, options);
      
      if (!response.ok) {
        console.error(`EdgeFunction.${functionName} - HTTP error:`, response.status, response.statusText);
        
        // If we've reached max attempts, return the error
        if (attempts >= maxAttempts) {
          return { 
            success: false, 
            error: { message: `HTTP error! status: ${response.status}` }
          };
        }
        // Otherwise continue to next retry
        continue;
      }
      
      const result = await response.json();
      console.log(`EdgeFunction.${functionName} - Success on attempt ${attempts}:`, result);
      
      // Handle the response format from Edge Functions
      if (result.success === false) {
        return { 
          success: false, 
          error: { message: result.error?.message || 'Unknown error from Edge Function' }
        };
      }
      
      return { 
        success: true, 
        data: (result.data !== undefined ? result.data : result) as T 
      };
    } catch (error: any) {
      console.error(`EdgeFunction.${functionName} - Exception on attempt ${attempts}:`, error);
      
      // If we've reached max attempts, return the error
      if (attempts >= maxAttempts) {
        return { 
          success: false, 
          error: { message: error.message || `Failed to call Edge Function: ${functionName}` }
        };
      }
      // Otherwise continue to next retry
    }
  }
  
  // This should never be reached due to the return in the final attempt
  return { 
    success: false, 
    error: { message: `Failed to call Edge Function after ${maxAttempts} attempts` }
  };
}
