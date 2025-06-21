
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
      const facilityId = url.searchParams.get('facilityId')
      const zoneId = url.searchParams.get('zoneId')
      
      if (!facilityId && !zoneId) {
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Either facilityId or zoneId is required' } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (facilityId) {
        const { data: hours, error } = await supabaseClient
          .from('facility_opening_hours')
          .select('*')
          .eq('facility_id', parseInt(facilityId))
          .order('day_of_week')

        if (error) {
          console.error('Opening hours fetch error:', error)
          return new Response(
            JSON.stringify({ success: false, error: { message: 'Failed to fetch opening hours', details: error } }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, data: hours || [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (zoneId) {
        const { data: hours, error } = await supabaseClient
          .from('zone_opening_hours')
          .select('*')
          .eq('zone_id', zoneId)
          .order('day_of_week')

        if (error) {
          console.error('Zone opening hours fetch error:', error)
          return new Response(
            JSON.stringify({ success: false, error: { message: 'Failed to fetch zone opening hours', details: error } }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, data: hours || [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Handle POST requests (create/update opening hours)
    if (req.method === 'POST') {
      const hoursData = await req.json()
      
      if (!hoursData.facility_id && !hoursData.zone_id) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: { 
              message: 'Either facility_id or zone_id is required',
              code: 'VALIDATION_ERROR'
            }
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const tableName = hoursData.facility_id ? 'facility_opening_hours' : 'zone_opening_hours'
      const idField = hoursData.facility_id ? 'facility_id' : 'zone_id'
      const idValue = hoursData.facility_id ? parseInt(hoursData.facility_id) : hoursData.zone_id

      // Delete existing opening hours for this facility/zone
      await supabaseClient
        .from(tableName)
        .delete()
        .eq(idField, idValue)

      // Insert new opening hours
      const hoursToInsert = hoursData.opening_hours.map((hour: any) => ({
        [idField]: idValue,
        day_of_week: hour.day_of_week,
        open_time: hour.open_time,
        close_time: hour.close_time,
        is_open: hour.is_open,
        valid_from: hour.valid_from,
        valid_to: hour.valid_to
      }))

      const { data: hours, error } = await supabaseClient
        .from(tableName)
        .insert(hoursToInsert)
        .select()

      if (error) {
        console.error('Opening hours creation error:', error)
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Failed to create opening hours', details: error } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data: hours }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
