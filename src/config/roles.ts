export type UserRole = 'GM' | 'Senior Tutor' | 'Tutor';

export const ROLES: Record<string, UserRole> = {
    // GMs
    'gm@example.com': 'GM',
    'lucianoinfanti369@gmail.com': 'GM',

    // Senior Tutors
    'senior@example.com': 'Senior Tutor',

    // Tutors (Default is Tutor, but can be explicit)
    'tutor@example.com': 'Tutor',
};

export const DEFAULT_ROLE: UserRole = 'Tutor';

export function getUserRole(email: string | null | undefined): UserRole {
    if (!email) return DEFAULT_ROLE;
    return ROLES[email] || DEFAULT_ROLE;
}

export const PERMISSIONS = {
    canManageGlobalBanner: ['GM'],
    canManageUsers: ['GM'],
    canManageReports: ['GM'],
    canApproveSuggestions: ['GM'],
    canCreateQuestions: ['GM', 'Senior Tutor'],
    canEditQuestions: ['GM', 'Senior Tutor'],
    canDeleteQuestions: ['GM'],
    canViewAdminDashboard: ['GM'],
} as const;

export function hasPermission(role: UserRole, permission: keyof typeof PERMISSIONS): boolean {
    return (PERMISSIONS[permission] as readonly string[]).includes(role);
}
