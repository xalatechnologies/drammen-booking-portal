
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
      // Single facility by ID
      if (pathSegments.length >= 2 && pathSegments[1]) {
        const facilityId = parseInt(pathSegments[1])
        
        if (isNaN(facilityId)) {
          return new Response(
            JSON.stringify({ success: false, error: { message: 'Invalid facility ID' } }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Check if requesting zones
        if (pathSegments[2] === 'zones') {
          const { data: zones, error: zonesError } = await supabaseClient
            .from('zones')
            .select('*')
            .eq('facility_id', facilityId)

          if (zonesError) {
            console.error('Zones fetch error:', zonesError)
            return new Response(
              JSON.stringify({ success: false, error: { message: 'Failed to fetch zones', details: zonesError } }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          return new Response(
            JSON.stringify({ success: true, data: zones || [] }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Fetch single facility with all related data
        const { data: facility, error: facilityError } = await supabaseClient
          .from('facilities')
          .select(`
            *,
            facility_opening_hours(day_of_week, open_time, close_time, is_open)
          `)
          .eq('id', facilityId)
          .single()

        if (facilityError) {
          console.error('Facility fetch error:', facilityError)
          return new Response(
            JSON.stringify({ success: false, error: { message: 'Facility not found', code: 'NOT_FOUND' } }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Transform the facility data to match frontend expectations
        const transformedFacility = {
          id: facility.id,
          name: facility.name,
          address: `${facility.address_street}, ${facility.address_city}`,
          type: facility.type,
          area: facility.area,
          description: facility.description,
          capacity: facility.capacity,
          image: facility.image_url || 'https://images.unsplash.com/photo-1525361147853-4bf9f54a0e98?w=600&auto=format&fit=crop',
          nextAvailable: facility.next_available || 'Available now',
          accessibility: facility.accessibility_features || [],
          suitableFor: [], // This would need to be derived from facility type or stored separately
          equipment: facility.equipment || [],
          rating: facility.rating || 4.0,
          reviewCount: facility.review_count || 0,
          pricePerHour: facility.price_per_hour,
          amenities: facility.amenities || [],
          hasAutoApproval: facility.has_auto_approval,
          timeSlotDuration: facility.time_slot_duration || 1,
          openingHours: facility.facility_opening_hours?.map(oh => ({
            dayOfWeek: oh.day_of_week,
            opens: oh.open_time,
            closes: oh.close_time
          })) || [],
          season: {
            from: facility.season_from || '2024-01-01',
            to: facility.season_to || '2024-12-31'
          },
          allowedBookingTypes: facility.allowed_booking_types || ['engangs'],
          zones: [] // Zones would be fetched separately if needed
        }

        return new Response(
          JSON.stringify({ success: true, data: transformedFacility }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // List facilities with pagination and filters
      const page = parseInt(url.searchParams.get('page') || '1')
      const limit = parseInt(url.searchParams.get('limit') || '10')
      const offset = (page - 1) * limit

      // Build query
      let query = supabaseClient
        .from('facilities')
        .select(`
          *,
          facility_opening_hours(day_of_week, open_time, close_time, is_open)
        `, { count: 'exact' })

      // Apply filters
      const searchTerm = url.searchParams.get('search')
      const facilityType = url.searchParams.get('type')
      const location = url.searchParams.get('location')
      const accessibility = url.searchParams.get('accessibility')

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }

      if (facilityType) {
        query = query.eq('type', facilityType)
      }

      if (location) {
        query = query.eq('area', location)
      }

      if (accessibility) {
        query = query.contains('accessibility_features', [accessibility])
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1)

      const { data: facilities, error, count } = await query

      if (error) {
        console.error('Facilities fetch error:', error)
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Failed to fetch facilities', details: error } }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Transform facilities data
      const transformedFacilities = facilities?.map(facility => ({
        id: facility.id,
        name: facility.name,
        address: `${facility.address_street}, ${facility.address_city}`,
        type: facility.type,
        area: facility.area,
        description: facility.description,
        capacity: facility.capacity,
        image: facility.image_url || 'https://images.unsplash.com/photo-1525361147853-4bf9f54a0e98?w=600&auto=format&fit=crop',
        nextAvailable: facility.next_available || 'Available now',
        accessibility: facility.accessibility_features || [],
        suitableFor: [], // This would need to be derived from facility type or stored separately
        equipment: facility.equipment || [],
        rating: facility.rating || 4.0,
        reviewCount: facility.review_count || 0,
        pricePerHour: facility.price_per_hour,
        amenities: facility.amenities || [],
        hasAutoApproval: facility.has_auto_approval,
        timeSlotDuration: facility.time_slot_duration || 1,
        openingHours: facility.facility_opening_hours?.map(oh => ({
          dayOfWeek: oh.day_of_week,
          opens: oh.open_time,
          closes: oh.close_time
        })) || [],
        season: {
          from: facility.season_from || '2024-01-01',
          to: facility.season_to || '2024-12-31'
        },
        allowedBookingTypes: facility.allowed_booking_types || ['engangs'],
        zones: []
      })) || []

      // Calculate pagination
      const totalPages = Math.ceil((count || 0) / limit)
      const hasNext = page < totalPages
      const hasPrev = page > 1

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            data: transformedFacilities,
            pagination: {
              page,
              limit,
              total: count || 0,
              totalPages,
              hasNext,
              hasPrev
            }
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle POST requests (create facility)
    if (req.method === 'POST') {
      const facilityData = await req.json()
      
      const { data: facility, error } = await supabaseClient
        .from('facilities')
        .insert([facilityData])
        .select()
        .single()

      if (error) {
        console.error('Facility creation error:', error)
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Failed to create facility', details: error } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data: facility }),
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
