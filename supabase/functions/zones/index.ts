
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/').filter(Boolean)

    // Handle GET requests
    if (req.method === 'GET') {
      // Single zone by ID
      if (pathSegments.length >= 2 && pathSegments[1]) {
        const zoneId = pathSegments[1]

        // Check for conflict detection endpoint
        if (pathSegments[2] === 'conflicts') {
          const startDate = url.searchParams.get('startDate')
          const endDate = url.searchParams.get('endDate')
          
          if (!startDate || !endDate) {
            return new Response(
              JSON.stringify({ success: false, error: { message: 'Start date and end date are required' } }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          // Check for zone conflicts
          const { data: conflicts, error: conflictError } = await supabaseClient
            .from('zone_conflict_rules')
            .select(`
              *,
              conflicting_zone:zones!zone_conflict_rules_conflicting_zone_id_fkey(id, name)
            `)
            .eq('zone_id', zoneId)
            .eq('is_active', true)

          if (conflictError) {
            console.error('Zone conflict check error:', conflictError)
            return new Response(
              JSON.stringify({ success: false, error: { message: 'Failed to check zone conflicts', details: conflictError } }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          // Check for existing bookings in conflicting zones
          const conflictingZoneIds = conflicts?.map(c => c.conflicting_zone_id) || []
          
          let hasConflicts = false
          let conflictDetails = []

          if (conflictingZoneIds.length > 0) {
            const { data: bookings, error: bookingError } = await supabaseClient
              .from('bookings')
              .select('*')
              .in('zone_id', conflictingZoneIds)
              .gte('start_date', startDate)
              .lte('end_date', endDate)
              .in('status', ['confirmed', 'pending'])

            if (!bookingError && bookings && bookings.length > 0) {
              hasConflicts = true
              conflictDetails = bookings.map(booking => ({
                bookingId: booking.id,
                zoneId: booking.zone_id,
                startDate: booking.start_date,
                endDate: booking.end_date,
                conflictType: 'booking_overlap'
              }))
            }
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              data: { 
                hasConflicts,
                conflicts: conflictDetails,
                rules: conflicts || []
              } 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Fetch single zone with all related data
        const { data: zone, error: zoneError } = await supabaseClient
          .from('zones')
          .select(`
            *,
            zone_opening_hours(day_of_week, open_time, close_time, is_open),
            zone_conflict_rules(id, conflict_type, conflicting_zone_id, description),
            facility:facilities(id, name, type, area)
          `)
          .eq('id', zoneId)
          .eq('status', 'active')
          .single()

        if (zoneError) {
          console.error('Zone fetch error:', zoneError)
          return new Response(
            JSON.stringify({ success: false, error: { message: 'Zone not found', code: 'NOT_FOUND' } }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, data: zone }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // List zones with filters
      const facilityId = url.searchParams.get('facilityId')
      const page = parseInt(url.searchParams.get('page') || '1')
      const limit = parseInt(url.searchParams.get('limit') || '10')
      const offset = (page - 1) * limit

      let query = supabaseClient
        .from('zones')
        .select(`
          *,
          facility:facilities(id, name, type, area)
        `, { count: 'exact' })
        .eq('status', 'active')

      if (facilityId) {
        query = query.eq('facility_id', parseInt(facilityId))
      }

      query = query.range(offset, offset + limit - 1).order('name')

      const { data: zones, error, count } = await query

      if (error) {
        console.error('Zones fetch error:', error)
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Failed to fetch zones', details: error } }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const totalPages = Math.ceil((count || 0) / limit)

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            data: zones || [],
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

    // Handle POST requests (create zone)
    if (req.method === 'POST') {
      const zoneData = await req.json()
      
      // Validate required fields
      if (!zoneData.name || !zoneData.facility_id) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: { 
              message: 'Missing required fields: name, facility_id',
              code: 'VALIDATION_ERROR'
            }
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: zone, error } = await supabaseClient
        .from('zones')
        .insert([{
          name: zoneData.name,
          facility_id: zoneData.facility_id,
          type: zoneData.type || 'room',
          capacity: zoneData.capacity || 1,
          description: zoneData.description,
          is_main_zone: zoneData.is_main_zone || false,
          parent_zone_id: zoneData.parent_zone_id,
          bookable_independently: zoneData.bookable_independently !== false,
          area_sqm: zoneData.area_sqm,
          floor: zoneData.floor,
          coordinates_x: zoneData.coordinates_x,
          coordinates_y: zoneData.coordinates_y,
          coordinates_width: zoneData.coordinates_width,
          coordinates_height: zoneData.coordinates_height,
          equipment: zoneData.equipment || [],
          accessibility_features: zoneData.accessibility_features || []
        }])
        .select()
        .single()

      if (error) {
        console.error('Zone creation error:', error)
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Failed to create zone', details: error } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data: zone }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle PUT requests (update zone)
    if (req.method === 'PUT') {
      if (pathSegments.length < 2 || !pathSegments[1]) {
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Zone ID is required' } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const zoneId = pathSegments[1]
      const updateData = await req.json()
      
      const { data: zone, error } = await supabaseClient
        .from('zones')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', zoneId)
        .select()
        .single()

      if (error) {
        console.error('Zone update error:', error)
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Failed to update zone', details: error } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data: zone }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle DELETE requests (soft delete zone)
    if (req.method === 'DELETE') {
      if (pathSegments.length < 2 || !pathSegments[1]) {
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Zone ID is required' } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const zoneId = pathSegments[1]

      const { data: zone, error } = await supabaseClient
        .from('zones')
        .update({ 
          status: 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('id', zoneId)
        .select()
        .single()

      if (error) {
        console.error('Zone deletion error:', error)
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Failed to delete zone', details: error } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data: zone }),
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
