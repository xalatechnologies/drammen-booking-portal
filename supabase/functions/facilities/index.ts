import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
            .eq('status', 'active')

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

        // Fetch single facility with all related data - return RAW database fields
        const { data: facility, error: facilityError } = await supabaseClient
          .from('facilities')
          .select(`
            *,
            facility_opening_hours(day_of_week, open_time, close_time, is_open),
            zones(id, name, type, capacity, description, bookable_independently, equipment, accessibility_features, status, area_sqm),
            facility_images(id, image_url, alt_text, is_featured, display_order, caption)
          `)
          .eq('id', facilityId)
          .eq('status', 'active')
          .single()

        if (facilityError) {
          console.error('Facility fetch error:', facilityError)
          return new Response(
            JSON.stringify({ success: false, error: { message: 'Facility not found', code: 'NOT_FOUND' } }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Return RAW facility data without transformation - let frontend handle it
        return new Response(
          JSON.stringify({ success: true, data: facility }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // List facilities with pagination and filters
      const page = parseInt(url.searchParams.get('page') || '1')
      const limit = parseInt(url.searchParams.get('limit') || '10')
      const offset = (page - 1) * limit

      // Build query - return RAW database fields
      let query = supabaseClient
        .from('facilities')
        .select(`
          *,
          facility_opening_hours(day_of_week, open_time, close_time, is_open),
          facility_images(id, image_url, alt_text, is_featured, display_order, caption)
        `, { count: 'exact' })
        .eq('status', 'active')

      // Apply filters
      const searchTerm = url.searchParams.get('search')
      const facilityType = url.searchParams.get('type')
      const location = url.searchParams.get('location')
      const accessibility = url.searchParams.get('accessibility')
      const sortBy = url.searchParams.get('sortBy') || 'name'
      const sortDir = url.searchParams.get('sortDir') || 'asc'

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,area.ilike.%${searchTerm}%`)
      }

      if (facilityType) {
        query = query.eq('type', facilityType)
      }

      if (location) {
        query = query.or(`area.ilike.%${location}%,address_city.ilike.%${location}%`)
      }

      if (accessibility) {
        query = query.contains('accessibility_features', [accessibility])
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortDir === 'asc' })

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

      // Return RAW facilities data without transformation - let frontend handle it
      console.log('Edge function - Raw facilities from DB:', facilities?.[0]);

      // Calculate pagination
      const totalPages = Math.ceil((count || 0) / limit)
      const hasNext = page < totalPages
      const hasPrev = page > 1

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            data: facilities || [],
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
      
      // Validate required fields
      if (!facilityData.name || !facilityData.type || !facilityData.area) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: { 
              message: 'Missing required fields: name, type, area',
              code: 'VALIDATION_ERROR'
            }
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Creating facility with data:', facilityData)

      const { data: facility, error } = await supabaseClient
        .from('facilities')
        .insert([{
          name: facilityData.name,
          address_street: facilityData.address_street || '',
          address_city: facilityData.address_city || '',
          address_postal_code: facilityData.address_postal_code || '',
          address_country: facilityData.address_country || 'Norway',
          type: facilityData.type,
          area: facilityData.area,
          description: facilityData.description,
          capacity: facilityData.capacity || 1,
          area_sqm: facilityData.area_sqm || null,
          accessibility_features: facilityData.accessibility_features || [],
          equipment: facilityData.equipment || [],
          amenities: facilityData.amenities || [],
          price_per_hour: facilityData.price_per_hour || 450,
          has_auto_approval: facilityData.has_auto_approval || false,
          time_slot_duration: facilityData.time_slot_duration || 1,
          allowed_booking_types: facilityData.allowed_booking_types || ['engangs'],
          season_from: facilityData.season_from,
          season_to: facilityData.season_to,
          contact_name: facilityData.contact_name,
          contact_email: facilityData.contact_email,
          contact_phone: facilityData.contact_phone,
          booking_lead_time_hours: facilityData.booking_lead_time_hours || 2,
          max_advance_booking_days: facilityData.max_advance_booking_days || 365,
          cancellation_deadline_hours: facilityData.cancellation_deadline_hours || 24,
          latitude: facilityData.latitude,
          longitude: facilityData.longitude,
          is_featured: facilityData.is_featured || false,
          status: facilityData.status || 'active'
        }])
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
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle PUT requests (update facility)
    if (req.method === 'PUT') {
      if (pathSegments.length < 2 || !pathSegments[1]) {
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Facility ID is required' } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const facilityId = parseInt(pathSegments[1])
      if (isNaN(facilityId)) {
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Invalid facility ID' } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const updateData = await req.json()
      console.log('Updating facility', facilityId, 'with data:', updateData)
      
      // Clean the update data - remove any frontend-specific fields that don't exist in the database
      const cleanUpdateData = {
        name: updateData.name,
        address_street: updateData.address_street,
        address_city: updateData.address_city,
        address_postal_code: updateData.address_postal_code,
        address_country: updateData.address_country,
        type: updateData.type,
        area: updateData.area,
        description: updateData.description,
        capacity: updateData.capacity,
        area_sqm: updateData.area_sqm,
        accessibility_features: updateData.accessibility_features,
        equipment: updateData.equipment,
        amenities: updateData.amenities,
        price_per_hour: updateData.price_per_hour,
        has_auto_approval: updateData.has_auto_approval,
        time_slot_duration: updateData.time_slot_duration,
        allowed_booking_types: updateData.allowed_booking_types,
        season_from: updateData.season_from,
        season_to: updateData.season_to,
        contact_name: updateData.contact_name,
        contact_email: updateData.contact_email,
        contact_phone: updateData.contact_phone,
        booking_lead_time_hours: updateData.booking_lead_time_hours,
        max_advance_booking_days: updateData.max_advance_booking_days,
        cancellation_deadline_hours: updateData.cancellation_deadline_hours,
        latitude: updateData.latitude,
        longitude: updateData.longitude,
        is_featured: updateData.is_featured,
        status: updateData.status,
        updated_at: new Date().toISOString()
      }

      // Remove undefined values
      Object.keys(cleanUpdateData).forEach(key => {
        if (cleanUpdateData[key] === undefined) {
          delete cleanUpdateData[key]
        }
      })

      const { data: facility, error } = await supabaseClient
        .from('facilities')
        .update(cleanUpdateData)
        .eq('id', facilityId)
        .select()
        .single()

      if (error) {
        console.error('Facility update error:', error)
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Failed to update facility', details: error } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Facility updated successfully:', facility)
      return new Response(
        JSON.stringify({ success: true, data: facility }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle DELETE requests (soft delete facility)
    if (req.method === 'DELETE') {
      if (pathSegments.length < 2 || !pathSegments[1]) {
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Facility ID is required' } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const facilityId = parseInt(pathSegments[1])
      if (isNaN(facilityId)) {
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Invalid facility ID' } }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: facility, error } = await supabaseClient
        .from('facilities')
        .update({ 
          status: 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('id', facilityId)
        .select()
        .single()

      if (error) {
        console.error('Facility deletion error:', error)
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Failed to delete facility', details: error } }),
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
