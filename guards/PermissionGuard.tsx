"use client";

import { useAuth } from "@/context/auth";

interface PermissionGuardProps {
    // Accepts a string OR an array of strings
    group: string | string[];
    children: React.ReactNode;
}

export const PermissionGuard = ({ group, children }: PermissionGuardProps) => {
    const { user, isLoading } = useAuth();

    if (isLoading) return null;

    const requiredGroups = Array.isArray(group) ? group : [group];

    const hasAccess = user?.groups?.some((g: string) => requiredGroups.includes(g));

    if (!hasAccess) {
        return null;
    }

    return <>{children}</>;
};