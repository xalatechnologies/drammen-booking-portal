import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Creates a Supabase client with proper authorization headers
 */
function createSupabaseClient(req: Request, useServiceRole = false) {
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
 */
function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  return null
}

/**
 * Creates a success response
 */
function successResponse(data: any, status = 200): Response {
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
 */
function errorResponse(message: string, details?: any, status = 400): Response {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: { message, details } 
    }),
    { 
      status, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}

/**
 * Extracts path parameters from URL
 */
function getPathSegments(req: Request): string[] {
  const url = new URL(req.url)
  return url.pathname.split('/').filter(segment => segment !== '')
}

/**
 * Wraps an Edge Function handler with standard error handling and CORS support
 */
function createEdgeFunctionHandler(
  handler: (req: Request, params: Record<string, any>, supabase: any) => Promise<Response>
) {
  return async (req: Request) => {
    // Handle CORS preflight requests
    const corsResponse = handleCors(req)
    if (corsResponse) return corsResponse
    
    try {
      // Parse parameters
      const url = new URL(req.url)
      const params: Record<string, any> = {}
      url.searchParams.forEach((value, key) => {
        params[key] = value
      })
      
      // Create Supabase client
      const supabase = createSupabaseClient(req)
      
      // Call the handler
      return await handler(req, params, supabase)
    } catch (error) {
      console.error('Error in edge function:', error)
      return errorResponse('Internal server error', error.message, 500)
    }
  }
}

/**
 * Generic Entity Edge Function
 * 
 * This function provides a standardized API for CRUD operations on any entity.
 * It can be configured via query parameters to work with different tables.
 * 
 * Query Parameters:
 * - table: The database table to operate on (required)
 * - related: Comma-separated list of related tables to include in select queries
 * - idField: The primary key field name (default: 'id')
 * - statusField: The status field name (default: 'status')
 * - activeValue: The value that represents an active record (default: 'active')
 * 
 * Example usage:
 * GET /generic-entity?table=facilities
 * GET /generic-entity/1?table=facilities&related=zones,facility_images
 * POST /generic-entity?table=facilities
 * PUT /generic-entity/1?table=facilities
 * DELETE /generic-entity/1?table=facilities
 */
serve(createEdgeFunctionHandler(async (req, params, supabase) => {
  const pathSegments = getPathSegments(req)
  
  // Extract configuration from query parameters
  const { 
    table, 
    related = '', 
    idField = 'id', 
    statusField = 'status', 
    activeValue = 'active',
    orderBy,
    orderDirection = 'asc'
  } = params

  // Validate required parameters
  if (!table) {
    return errorResponse('Missing required parameter: table', null, 400)
  }

  // Parse related tables
  const relatedTables = related ? related.split(',').map(t => t.trim()) : []
  
  // Handle GET requests
  if (req.method === 'GET') {
    // Single entity by ID
    if (pathSegments.length >= 2 && pathSegments[1]) {
      const entityId = pathSegments[1]
      
      // Build select query with related tables
      let selectQuery = '*'
      if (relatedTables.length > 0) {
        selectQuery = `*, ${relatedTables.map(t => `${t}(*)`).join(', ')}`
      }
      
      // Fetch single entity with related data
      const { data: entity, error } = await supabase
        .from(table)
        .select(selectQuery)
        .eq(idField, entityId)
        .maybeSingle()

      if (error) {
        console.error(`${table} fetch error:`, error)
        return errorResponse(`${table} not found`, { code: 'NOT_FOUND' }, 404)
      }

      return successResponse(entity)
    }

    // List entities with pagination and filters
    const page = Number(params.page || 1)
    const limit = Number(params.limit || 10)
    const offset = (page - 1) * limit
    
    // Build select query with related tables
    let selectQuery = '*'
    if (relatedTables.length > 0) {
      selectQuery = `*, ${relatedTables.map(t => `${t}(*)`).join(', ')}`
    }

    // Build query
    let query = supabase
      .from(table)
      .select(selectQuery, { count: 'exact' })
    
    // Apply filters from params
    Object.keys(params).forEach(key => {
      // Skip special parameters
      if (!['table', 'related', 'idField', 'statusField', 'activeValue', 'page', 'limit', 'orderBy', 'orderDirection'].includes(key)) {
        query = query.eq(key, params[key])
      }
    })
    
    // Apply status filter if table has status field
    if (statusField && params.includeInactive !== 'true') {
      query = query.eq(statusField, activeValue)
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1)
    
    // Apply ordering
    if (orderBy) {
      query = query.order(orderBy, { ascending: orderDirection !== 'desc' })
    }
    
    // Execute query
    const { data: entities, error, count } = await query

    if (error) {
      console.error(`${table} list error:`, error)
      return errorResponse(`Failed to fetch ${table}`, error, 500)
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return successResponse({
      data: entities || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages
      }
    })
  }

  // Handle POST requests (create entity)
  if (req.method === 'POST') {
    const entityData = params.data || {}
    
    // Validate required fields based on table schema
    // This would ideally be more sophisticated with schema validation
    if (Object.keys(entityData).length === 0) {
      return errorResponse(`No data provided for ${table}`, null, 400)
    }
    
    // Insert new entity
    const { data: newEntity, error } = await supabase
      .from(table)
      .insert(entityData)
      .select()
    
    if (error) {
      console.error(`${table} creation error:`, error)
      return errorResponse(`Failed to create ${table}`, error, 400)
    }
    
    return successResponse(newEntity, 201)
  }

  // Handle PUT requests (update entity)
  if (req.method === 'PUT') {
    if (pathSegments.length < 2 || !pathSegments[1]) {
      return errorResponse(`${idField} is required`, null, 400)
    }
    
    const entityId = pathSegments[1]
    const entityData = params.data || {}
    
    // Validate data
    if (Object.keys(entityData).length === 0) {
      return errorResponse(`No data provided for ${table} update`, null, 400)
    }
    
    // Update entity
    const { data: updatedEntity, error } = await supabase
      .from(table)
      .update(entityData)
      .eq(idField, entityId)
      .select()
    
    if (error) {
      console.error(`${table} update error:`, error)
      return errorResponse(`Failed to update ${table}`, error, 400)
    }
    
    return successResponse(updatedEntity)
  }

  // Handle DELETE requests
  if (req.method === 'DELETE') {
    if (pathSegments.length < 2 || !pathSegments[1]) {
      return errorResponse(`${idField} is required`, null, 400)
    }
    
    const entityId = pathSegments[1]
    
    // Check if this is a soft delete
    if (statusField && params.hardDelete !== 'true') {
      // Soft delete - update status
      const { data: deletedEntity, error } = await supabase
        .from(table)
        .update({ [statusField]: 'inactive' })
        .eq(idField, entityId)
        .select()
      
      if (error) {
        console.error(`${table} soft delete error:`, error)
        return errorResponse(`Failed to delete ${table}`, error, 400)
      }
      
      return successResponse(deletedEntity)
    } else {
      // Hard delete
      const { data: deletedEntity, error } = await supabase
        .from(table)
        .delete()
        .eq(idField, entityId)
        .select()
      
      if (error) {
        console.error(`${table} hard delete error:`, error)
        return errorResponse(`Failed to delete ${table}`, error, 400)
      }
      
      return successResponse(deletedEntity)
    }
  }

  return errorResponse('Method not allowed', null, 405)
}))
