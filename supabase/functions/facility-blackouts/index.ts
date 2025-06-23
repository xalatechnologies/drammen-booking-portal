
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { 
  createEdgeFunctionHandler, 
  successResponse, 
  errorResponse,
  getPathSegments
} from '../_shared/edge-function-utils.ts'

serve(createEdgeFunctionHandler(async (req, params, supabase) => {
  const pathSegments = getPathSegments(req)

  // Handle GET requests
  if (req.method === 'GET') {
    // Single blackout period by ID
    if (pathSegments.length >= 2 && pathSegments[1]) {
      const blackoutId = pathSegments[1]
      
      const { data: blackout, error } = await supabase
        .from('facility_blackout_periods')
        .select(`
          *,
          facility:facilities(id, name, type)
        `)
        .eq('id', blackoutId)
        .single()

      if (error) {
        console.error('Blackout fetch error:', error)
        return errorResponse('Blackout period not found', { code: 'NOT_FOUND' }, 404)
      }

      return successResponse(blackout)
    }

      // List blackout periods with filters
      const { facilityId, page = 1, limit = 10, active } = params;
      const offset = (Number(page) - 1) * Number(limit);

      let query = supabase
        .from('facility_blackout_periods')
        .select(`
          *,
          facility:facilities(id, name, type)
        `, { count: 'exact' })

      if (facilityId) {
        query = query.eq('facility_id', Number(facilityId))
      }

      if (active === 'true') {
        const now = new Date().toISOString()
        query = query.gte('end_date', now)
      }

      query = query.range(offset, offset + Number(limit) - 1).order('start_date', { ascending: false })

      const { data: blackouts, error, count } = await query

      if (error) {
        console.error('Blackouts fetch error:', error)
        return errorResponse('Failed to fetch blackout periods', error, 500)
      }

      const totalPages = Math.ceil((count || 0) / Number(limit))

      return successResponse({
        data: blackouts || [],
            pagination: {
              page,
              limit,
              total: count || 0,
              totalPages,
              hasNext: page < totalPages,
              hasPrev: page > 1
            }
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle POST requests (create blackout period)
    if (req.method === 'POST') {
      const blackoutData = await req.json()
      
      // Validate required fields
      if (!blackoutData.facility_id || !blackoutData.start_date || !blackoutData.end_date || !blackoutData.reason) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: { 
              message: 'Missing required fields: facility_id, start_date, end_date, reason',
              code: 'VALIDATION_ERROR'
            }
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get user ID from auth context
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (!user) {
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Unauthorized' } }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: blackout, error } = await supabaseClient
        .from('facility_blackout_periods')
        .insert([{
          facility_id: blackoutData.facility_id,
          start_date: blackoutData.start_date,
          end_date: blackoutData.end_date,
          reason: blackoutData.reason,
          type: blackoutData.type || 'maintenance',
          created_by: user.id
        }])
        .select()
        .single()

      if (error) {
        console.error('Blackout creation error:', error)
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Failed to create blackout period', details: error } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data: blackout }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle PUT requests (update blackout period)
    if (req.method === 'PUT') {
      if (pathSegments.length < 2 || !pathSegments[1]) {
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Blackout period ID is required' } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const blackoutId = pathSegments[1]
      const updateData = await req.json()
      
      const { data: blackout, error } = await supabaseClient
        .from('facility_blackout_periods')
        .update(updateData)
        .eq('id', blackoutId)
        .select()
        .single()

      if (error) {
        console.error('Blackout update error:', error)
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Failed to update blackout period', details: error } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data: blackout }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle DELETE requests
    if (req.method === 'DELETE') {
      if (pathSegments.length < 2 || !pathSegments[1]) {
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Blackout period ID is required' } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const blackoutId = pathSegments[1]

      const { data: blackout, error } = await supabaseClient
        .from('facility_blackout_periods')
        .delete()
        .eq('id', blackoutId)
        .select()
        .single()

      if (error) {
        console.error('Blackout deletion error:', error)
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Failed to delete blackout period', details: error } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data: blackout }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: false, error: { message: 'Method not allowed' } }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Internal server error', details: error.message } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
