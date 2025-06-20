
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { FacilityService } from './facility.service.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const facilityService = new FacilityService(supabase)
    
    const url = new URL(req.url)
    const method = req.method
    const pathParts = url.pathname.split('/').filter(Boolean)
    
    // Routes: /facilities, /facilities/:id, /facilities/:id/zones, etc.
    
    if (method === 'GET') {
      if (pathParts.length === 1) {
        // GET /facilities - list with filters
        const searchParams = url.searchParams
        const filters = {
          searchTerm: searchParams.get('search') || undefined,
          facilityType: searchParams.get('type') || undefined,
          location: searchParams.get('location') || undefined,
          accessibility: searchParams.get('accessibility') || undefined,
          availableNow: searchParams.get('availableNow') === 'true',
          page: parseInt(searchParams.get('page') || '1'),
          limit: parseInt(searchParams.get('limit') || '20')
        }
        
        const result = await facilityService.getFacilities(filters)
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: result.success ? 200 : 400
        })
      } else if (pathParts.length === 2) {
        // GET /facilities/:id - get single facility
        const facilityId = parseInt(pathParts[1])
        const result = await facilityService.getFacilityById(facilityId)
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: result.success ? 200 : 404
        })
      } else if (pathParts.length === 3 && pathParts[2] === 'zones') {
        // GET /facilities/:id/zones - get facility zones
        const facilityId = parseInt(pathParts[1])
        const result = await facilityService.getFacilityZones(facilityId)
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: result.success ? 200 : 404
        })
      }
    } else if (method === 'POST') {
      if (pathParts.length === 1) {
        // POST /facilities - create facility
        const facilityData = await req.json()
        const result = await facilityService.createFacility(facilityData)
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: result.success ? 201 : 400
        })
      }
    } else if (method === 'PUT') {
      if (pathParts.length === 2) {
        // PUT /facilities/:id - update facility
        const facilityId = parseInt(pathParts[1])
        const facilityData = await req.json()
        const result = await facilityService.updateFacility(facilityId, facilityData)
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: result.success ? 200 : 400
        })
      }
    } else if (method === 'DELETE') {
      if (pathParts.length === 2) {
        // DELETE /facilities/:id - delete facility
        const facilityId = parseInt(pathParts[1])
        const result = await facilityService.deleteFacility(facilityId)
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: result.success ? 200 : 400
        })
      }
    }

    return new Response(JSON.stringify({ error: 'Route not found' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 404
    })
  } catch (error) {
    console.error('Facility function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
