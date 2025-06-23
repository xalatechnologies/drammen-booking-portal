import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Creates a Supabase client with proper authorization headers
 * @param req The request object
 * @param useServiceRole Whether to use the service role key (for admin operations)
 * @returns Supabase client instance
 */
export function createSupabaseClient(req: Request, useServiceRole = false) {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    useServiceRole 
      ? (Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')
      : (Deno.env.get('SUPABASE_ANON_KEY') ?? ''),
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  )
}

/**
 * Handles CORS preflight requests
 * @param req The request object
 * @returns Response for OPTIONS requests
 */
export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  return null
}

/**
 * Parses request parameters from either URL query params or JSON body
 * @param req The request object
 * @returns Parsed parameters
 */
export async function parseRequestParams(req: Request): Promise<Record<string, any>> {
  const url = new URL(req.url)
  
  // For GET requests, parse from URL parameters
  if (req.method === 'GET') {
    const params: Record<string, any> = {}
    url.searchParams.forEach((value, key) => {
      // Try to parse numeric values
      if (!isNaN(Number(value)) && value.trim() !== '') {
        params[key] = Number(value)
      } else if (value === 'true') {
        params[key] = true
      } else if (value === 'false') {
        params[key] = false
      } else {
        params[key] = value
      }
    })
    return params
  } 
  
  // For other methods, parse from JSON body
  try {
    return await req.json()
  } catch (error) {
    console.error('Error parsing request body:', error)
    return {}
  }
}

/**
 * Creates a success response
 * @param data The data to return
 * @param status HTTP status code (default: 200)
 * @returns Response object
 */
export function successResponse(data: any, status = 200): Response {
  return new Response(
    JSON.stringify({ success: true, data }),
    { 
      status, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}

/**
 * Creates an error response
 * @param message Error message
 * @param details Additional error details
 * @param status HTTP status code (default: 400)
 * @returns Response object
 */
export function errorResponse(message: string, details?: any, status = 400): Response {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: { 
        message,
        ...(details ? { details } : {})
      } 
    }),
    { 
      status, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}

/**
 * Extracts path parameters from URL
 * @param req The request object
 * @returns Array of path segments
 */
export function getPathSegments(req: Request): string[] {
  const url = new URL(req.url)
  return url.pathname.split('/').filter(Boolean)
}

/**
 * Wraps an Edge Function handler with standard error handling and CORS support
 * @param handler The handler function
 * @returns A function that can be passed to serve()
 */
export function createEdgeFunctionHandler(
  handler: (req: Request, params: Record<string, any>, supabase: any) => Promise<Response>
) {
  return async (req: Request) => {
    // Handle CORS preflight
    const corsResponse = handleCors(req)
    if (corsResponse) return corsResponse
    
    try {
      // Parse parameters
      const params = await parseRequestParams(req)
      
      // Create Supabase client
      const supabase = createSupabaseClient(req)
      
      // Call handler
      return await handler(req, params, supabase)
    } catch (error) {
      console.error('Edge function error:', error)
      return errorResponse('Internal server error', error.message, 500)
    }
  }
}
