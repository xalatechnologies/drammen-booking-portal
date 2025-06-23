
import { useAdminRole } from "@/contexts/AdminRoleContext";
import { useMemo } from "react";

export type FacilityPermission = 
  | 'create_facility'
  | 'edit_facility'
  | 'delete_facility'
  | 'manage_all_facilities'
  | 'manage_assigned_facilities'
  | 'view_facility_analytics'
  | 'manage_pricing'
  | 'manage_zones'
  | 'manage_blackouts'
  | 'approve_bookings';

interface RolePermissions {
  [key: string]: FacilityPermission[];
}

const rolePermissions: RolePermissions = {
  systemadmin: [
    'create_facility',
    'edit_facility',
    'delete_facility',
    'manage_all_facilities',
    'view_facility_analytics',
    'manage_pricing',
    'manage_zones',
    'manage_blackouts',
    'approve_bookings'
  ],
  admin: [
    'create_facility',
    'edit_facility',
    'delete_facility',
    'manage_assigned_facilities',
    'view_facility_analytics',
    'manage_pricing',
    'manage_zones',
    'manage_blackouts',
    'approve_bookings'
  ],
  saksbehandler: [
    'edit_facility',
    'manage_assigned_facilities',
    'view_facility_analytics',
    'manage_blackouts',
    'approve_bookings'
  ]
};

export const useRoleBasedAccess = () => {
  const { currentRole } = useAdminRole();

  const permissions = useMemo(() => {
    return rolePermissions[currentRole] || [];
  }, [currentRole]);

  const hasPermission = (permission: FacilityPermission): boolean => {
    return permissions.includes(permission);
  };

  const canAccessTab = (tabId: string): boolean => {
    switch (tabId) {
      case 'basic':
        return hasPermission('edit_facility');
      case 'location':
        return hasPermission('edit_facility');
      case 'features':
        return hasPermission('edit_facility');
      case 'pricing':
        return hasPermission('manage_pricing');
      case 'zones':
        return hasPermission('manage_zones');
      case 'schedule':
        return hasPermission('edit_facility');
      case 'blackouts':
        return hasPermission('manage_blackouts');
      case 'images':
        return hasPermission('edit_facility');
      case 'analytics':
        return hasPermission('view_facility_analytics');
      case 'advanced':
        return hasPermission('manage_all_facilities');
      default:
        return false;
    }
  };

  const getAvailableTabs = (): string[] => {
    const allTabs = ['basic', 'location', 'features', 'pricing', 'zones', 'schedule', 'blackouts', 'images', 'analytics', 'advanced'];
    return allTabs.filter(tab => canAccessTab(tab));
  };

  return {
    currentRole,
    permissions,
    hasPermission,
    canAccessTab,
    getAvailableTabs
  };
};
