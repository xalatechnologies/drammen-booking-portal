
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { facilityId, hours } = await req.json()

    if (req.method === 'GET') {
      console.log('Fetching opening hours for facility:', facilityId)
      
      const { data, error } = await supabase
        .from('facility_opening_hours')
        .select('*')
        .eq('facility_id', facilityId)
        .order('day_of_week')

      if (error) {
        console.error('Error fetching opening hours:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Opening hours fetched successfully:', data)
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'POST') {
      console.log('Saving opening hours for facility:', facilityId, 'Hours:', hours)
      
      // Delete existing hours for this facility
      const { error: deleteError } = await supabase
        .from('facility_opening_hours')
        .delete()
        .eq('facility_id', facilityId)

      if (deleteError) {
        console.error('Error deleting existing hours:', deleteError)
        return new Response(
          JSON.stringify({ error: deleteError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Insert new hours
      const { data, error } = await supabase
        .from('facility_opening_hours')
        .insert(hours.map((hour: any) => ({
          facility_id: facilityId,
          day_of_week: hour.day_of_week,
          open_time: hour.open_time,
          close_time: hour.close_time,
          is_open: hour.is_open,
          valid_from: hour.valid_from,
          valid_to: hour.valid_to
        })))
        .select()

      if (error) {
        console.error('Error inserting opening hours:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Opening hours saved successfully:', data)
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
