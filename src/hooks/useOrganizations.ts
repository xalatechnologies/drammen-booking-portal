
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export function useOrganizations() {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ['organizations', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_actors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);

      // Transform data to include localized names
      const organizations = (data || []).map((actor: any) => ({
        id: actor.id,
        name: typeof actor.name === 'object' 
          ? actor.name[language] || actor.name['NO'] || actor.name['EN'] || 'Unknown'
          : actor.name || 'Unknown',
        type: actor.type,
        orgNumber: actor.org_number,
        isParaply: actor.is_paraply || false,
        contactInfo: actor.contact_info || {},
        metadata: actor.metadata || {},
        parentActorId: actor.parent_actor_id,
        created_at: actor.created_at,
        updated_at: actor.updated_at
      }));

      return organizations;
    },
    staleTime: 0,
  });
}

export function useOrganization(organizationId: string) {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ['organization', organizationId, language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_actors')
        .select('*')
        .eq('id', organizationId)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) return null;

      return {
        id: data.id,
        name: typeof data.name === 'object' 
          ? data.name[language] || data.name['NO'] || data.name['EN'] || 'Unknown'
          : data.name || 'Unknown',
        type: data.type,
        orgNumber: data.org_number,
        isParaply: data.is_paraply || false,
        contactInfo: data.contact_info || {},
        metadata: data.metadata || {},
        parentActorId: data.parent_actor_id,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    },
    enabled: !!organizationId,
    staleTime: 0,
  });
}
