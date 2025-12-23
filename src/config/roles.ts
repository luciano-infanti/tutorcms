export type UserRole = 'CM' | 'GM' | 'SeniorTutor' | 'Tutor' | 'Player';

// Role hierarchy (higher index = higher power)
export const ROLE_HIERARCHY: UserRole[] = ['Player', 'Tutor', 'SeniorTutor', 'GM', 'CM'];

export const ROLES: Record<string, UserRole> = {
    // CMs (Community Managers - Supreme Admin)
    'lucianoinfanti369@gmail.com': 'CM',

    // GMs (Game Masters - Admin)
    'gm@example.com': 'GM',

    // Senior Tutors
    'senior@example.com': 'SeniorTutor',

    // Tutors
    'tutor@example.com': 'Tutor',

    // Players (Default for all new users)
};

export const DEFAULT_ROLE: UserRole = 'Player';

export function getUserRole(email: string | null | undefined): UserRole {
    if (!email) return DEFAULT_ROLE;
    return ROLES[email] || DEFAULT_ROLE;
}

export const PERMISSIONS = {
    // Admin Dashboard Access
    canViewAdminDashboard: ['CM', 'GM'],

    // User Management
    canManageAllUsers: ['CM'],
    canManageNonCMUsers: ['GM'],
    canPromotePlayerToTutor: ['CM', 'GM', 'SeniorTutor'],

    // Content Management
    canManageGlobalBanner: ['CM', 'GM'],
    canManageReports: ['CM', 'GM'],
    canApproveSuggestions: ['CM', 'GM'],
    canCreateQuestions: ['CM', 'GM', 'SeniorTutor'],
    canEditQuestions: ['CM', 'GM', 'SeniorTutor'],
    canDeleteQuestions: ['CM', 'GM'],

    // User Interactions (not for Players)
    canVote: ['CM', 'GM', 'SeniorTutor', 'Tutor'],
    canReport: ['CM', 'GM', 'SeniorTutor', 'Tutor'],
    canSuggest: ['CM', 'GM', 'SeniorTutor', 'Tutor'],
} as const;

export function hasPermission(role: UserRole, permission: keyof typeof PERMISSIONS): boolean {
    const permArray = PERMISSIONS[permission] as readonly string[];
    const result = permArray.includes(role);
    // #region agent log
    if (typeof window !== 'undefined') {
        fetch('http://127.0.0.1:7243/ingest/ba8503e3-de95-4237-bfb2-b8307e3469b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'roles.ts:hasPermission',message:'hasPermission check',data:{role,roleType:typeof role,permission,permArray,result,roleInArray:permArray.indexOf(role)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B,D'})}).catch(()=>{});
    }
    // #endregion
    return result;
}

/**
 * Get the power level of a role (higher = more powerful)
 */
export function getRolePower(role: UserRole): number {
    return ROLE_HIERARCHY.indexOf(role);
}

/**
 * Check if an actor can manage (edit/delete) a target user based on role hierarchy
 * - CM can manage everyone
 * - GM can manage everyone EXCEPT CMs
 * - Others cannot manage users
 */
export function canManageUser(actorRole: UserRole, targetRole: UserRole): boolean {
    if (actorRole === 'CM') {
        return true; // CM can manage anyone
    }
    if (actorRole === 'GM') {
        return targetRole !== 'CM'; // GM can manage anyone except CM
    }
    return false; // Other roles cannot manage users
}

/**
 * Check if an actor can promote a user from Player to Tutor
 */
export function canPromoteToTutor(actorRole: UserRole, targetCurrentRole: UserRole): boolean {
    if (!hasPermission(actorRole, 'canPromotePlayerToTutor')) {
        return false;
    }
    return targetCurrentRole === 'Player';
}
