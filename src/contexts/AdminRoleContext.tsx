import React, { createContext, useState, useContext, ReactNode } from 'react';

export type AdminRole = 'systemadmin' | 'admin' | 'saksbehandler';

interface AdminRoleContextType {
    currentRole: AdminRole;
    setCurrentRole: (role: AdminRole) => void;
    availableRoles: AdminRole[];
}

const AdminRoleContext = createContext<AdminRoleContextType | undefined>(undefined);

export const AdminRoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentRole, setCurrentRole] = useState<AdminRole>('systemadmin');
    const availableRoles: AdminRole[] = ['systemadmin', 'admin', 'saksbehandler'];

    return (
        <AdminRoleContext.Provider value={{ currentRole, setCurrentRole, availableRoles }}>
            {children}
        </AdminRoleContext.Provider>
    );
};

export const useAdminRole = () => {
    const context = useContext(AdminRoleContext);
    if (context === undefined) {
        throw new Error('useAdminRole must be used within an AdminRoleProvider');
    }
    return context;
}; 