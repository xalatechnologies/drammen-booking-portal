
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { 
  createEdgeFunctionHandler, 
  successResponse, 
  errorResponse 
} from '../_shared/edge-function-utils.ts'

serve(createEdgeFunctionHandler(async (req, params, supabase) => {
  const { facilityId, hours } = params;

  if (req.method === 'GET') {
    console.log('Fetching opening hours for facility:', facilityId)
    
    const { data, error } = await supabase
      .from('facility_opening_hours')
      .select('*')
      .eq('facility_id', facilityId)
      .order('day_of_week')

    if (error) {
      console.error('Error fetching opening hours:', error)
      return errorResponse('Error fetching opening hours', error.message, 400)
    }

    console.log('Opening hours fetched successfully:', data)
    return successResponse(data)
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
      return errorResponse('Error deleting existing hours', deleteError.message, 400)
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
      return errorResponse('Error inserting opening hours', error.message, 400)
    }

    console.log('Opening hours saved successfully:', data)
    return successResponse(data)
  }

  return errorResponse('Method not allowed', null, 405)
}))
