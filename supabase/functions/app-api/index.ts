
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
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
    const resource = pathSegments[0] // users, actors, locations, etc.
    const action = pathSegments[1] // Optional action/id

    console.log(`App API - ${req.method} /${resource}/${action || ''}`)

    // Handle different resources
    switch (resource) {
      case 'users':
        return await handleUsers(req, supabaseClient, action)
      case 'actors':
        return await handleActors(req, supabaseClient, action)
      case 'locations':
        return await handleLocations(req, supabaseClient, action)
      case 'zones':
        return await handleZones(req, supabaseClient, action)
      case 'bookings':
        return await handleBookings(req, supabaseClient, action)
      case 'health':
        return new Response(
          JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      default:
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Resource not found' } }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('App API error:', error)
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Internal server error', details: error.message } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleUsers(req: Request, supabase: any, action?: string) {
  if (req.method === 'GET') {
    if (action) {
      // Get single user
      const { data, error } = await supabase
        .from('app_users')
        .select(`
          *,
          app_user_roles(
            app_roles(name, description)
          )
        `)
        .eq('id', action)
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: { message: 'User not found' } }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // List users
      const { data, error } = await supabase
        .from('app_users')
        .select(`
          id,
          email,
          name,
          locale,
          created_at,
          app_user_roles(
            app_roles(name, description)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Failed to fetch users' } }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data: data || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  }

  return new Response(
    JSON.stringify({ success: false, error: { message: 'Method not allowed' } }),
    { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleActors(req: Request, supabase: any, action?: string) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('app_actors')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Failed to fetch actors' } }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, data: data || [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ success: false, error: { message: 'Method not allowed' } }),
    { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleLocations(req: Request, supabase: any, action?: string) {
  if (req.method === 'GET') {
    if (action) {
      // Get single location with zones
      const { data, error } = await supabase
        .from('app_locations')
        .select(`
          *,
          app_zones(*)
        `)
        .eq('id', action)
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Location not found' } }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // List locations
      const { data, error } = await supabase
        .from('app_locations')
        .select(`
          *,
          app_zones(count)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Failed to fetch locations' } }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data: data || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  }

  return new Response(
    JSON.stringify({ success: false, error: { message: 'Method not allowed' } }),
    { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleZones(req: Request, supabase: any, action?: string) {
  if (req.method === 'GET') {
    const url = new URL(req.url)
    const locationId = url.searchParams.get('location_id')

    let query = supabase.from('app_zones').select('*')
    
    if (locationId) {
      query = query.eq('location_id', locationId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Failed to fetch zones' } }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, data: data || [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ success: false, error: { message: 'Method not allowed' } }),
    { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleBookings(req: Request, supabase: any, action?: string) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('app_bookings')
      .select(`
        *,
        app_users(name, email),
        app_actors(name),
        app_locations(name),
        app_zones(name)
      `)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Failed to fetch bookings' } }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, data: data || [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ success: false, error: { message: 'Method not allowed' } }),
    { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
