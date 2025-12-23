# TutorCMS Roles & Permissions

This document outlines the user roles and their associated permissions within TutorCMS.

---

## Roles Overview

| Role            | Description                                              |
|-----------------|----------------------------------------------------------|
| **CM**          | Community Manager - Supreme Admin with full access       |
| **GM**          | Game Master - Admin with user management (except CMs)    |
| **SeniorTutor** | Senior Tutor - Staff with content & promotion abilities  |
| **Tutor**       | Tutor - Trusted user with voting & interaction rights    |
| **Player**      | Player - Default role, read-only access                  |

---

## Role Hierarchy

```
CM (Community Manager)
 └── GM (Game Master)
      └── SeniorTutor
           └── Tutor
                └── Player (Default)
```

---

## Permissions Matrix

| Permission                 | CM | GM | SeniorTutor | Tutor | Player |
|----------------------------|:--:|:--:|:-----------:|:-----:|:------:|
| View Admin Dashboard       | ✅ | ✅ |     ❌      |  ❌   |   ❌   |
| Manage Global Banner       | ✅ | ✅ |     ❌      |  ❌   |   ❌   |
| Manage All Users           | ✅ | ❌ |     ❌      |  ❌   |   ❌   |
| Manage Non-CM Users        | ✅ | ✅ |     ❌      |  ❌   |   ❌   |
| Promote Player to Tutor    | ✅ | ✅ |     ✅      |  ❌   |   ❌   |
| Manage Reports             | ✅ | ✅ |     ❌      |  ❌   |   ❌   |
| Approve/Reject Suggestions | ✅ | ✅ |     ❌      |  ❌   |   ❌   |
| Create Questions           | ✅ | ✅ |     ✅      |  ❌   |   ❌   |
| Edit Questions             | ✅ | ✅ |     ✅      |  ❌   |   ❌   |
| Delete Questions           | ✅ | ✅ |     ❌      |  ❌   |   ❌   |
| Vote on Questions          | ✅ | ✅ |     ✅      |  ✅   |   ❌   |
| Report Questions           | ✅ | ✅ |     ✅      |  ✅   |   ❌   |
| Submit Suggestions         | ✅ | ✅ |     ✅      |  ✅   |   ❌   |
| View FAQs                  | ✅ | ✅ |     ✅      |  ✅   |   ✅   |
| Copy Answers               | ✅ | ✅ |     ✅      |  ✅   |   ✅   |

---

## Detailed Role Breakdown

### CM (Community Manager) - Supreme Admin

The CM role has **full administrative access** to the entire system with no restrictions:

- **Admin Dashboard** (`/admin`) - Complete access to all admin features
- **User Management** - Can manage ALL users, including other CMs
- **Reports Management** - Resolve or dismiss user-submitted reports
- **Questions Management** - Create, edit, and delete FAQ questions
- **Categories Management** - Create and manage question categories
- **Suggestions Review** - Approve or reject user-submitted suggestions
- **Global Banner** - Set and manage site-wide announcement banners
- **Promotion** - Can promote Players to Tutors via `/promote`

### GM (Game Master) - Admin

GMs have broad administrative access with one key restriction:

- ✅ Full access to Admin Dashboard (`/admin`)
- ✅ Can manage users (edit roles, delete accounts)
- ✅ Can manage reports, suggestions, questions, categories
- ✅ Can promote Players to Tutors
- ⚠️ **Cannot** edit, delete, or change the role of **CM** users
- ⚠️ **Cannot** assign the CM role to anyone

### SeniorTutor - Staff

Senior Tutors have elevated content management permissions:

- ✅ Can **create** new FAQ questions
- ✅ Can **edit** existing FAQ questions
- ✅ Can **promote Players to Tutors** via `/promote` page
- ✅ Can vote on questions
- ✅ Can submit reports and suggestions
- ❌ Cannot access Admin Dashboard
- ❌ Cannot delete questions
- ❌ Cannot manage users beyond Player → Tutor promotion

### Tutor - Trusted User

Tutors are trusted community members with interaction rights:

- ✅ Can **vote** on questions (helpful/not helpful)
- ✅ Can **report** questions for review
- ✅ Can **submit suggestions** for new questions or edits
- ✅ Full access to view and copy FAQs
- ❌ Cannot create, edit, or delete questions
- ❌ Cannot access administrative features
- ❌ Cannot promote other users

### Player - Default Role (Read-Only)

All new users are assigned the Player role by default:

- ✅ Can view FAQs
- ✅ Can copy answers to clipboard
- ❌ **Cannot** vote on questions
- ❌ **Cannot** report questions
- ❌ **Cannot** submit suggestions
- ❌ Cannot access any administrative features

---

## Protection Rules

### CM Immunity

CMs are protected from lower-ranking administrators:

- **GMs cannot:**
  - Edit a CM's profile or role
  - Delete a CM account
  - Assign the CM role to other users
  
- **Only CMs can:**
  - Manage other CM accounts
  - Assign the CM role

### Promotion Restrictions

The Senior Tutor promotion capability is intentionally limited:

- Can **only** promote `Player` → `Tutor`
- Cannot demote Tutors back to Players
- Cannot promote to SeniorTutor, GM, or CM
- Cannot modify any other user attributes

---

## Technical Implementation

Role assignments are managed in `src/config/roles.ts`:

```typescript
export type UserRole = 'CM' | 'GM' | 'SeniorTutor' | 'Tutor' | 'Player';

export const ROLE_HIERARCHY: UserRole[] = ['Player', 'Tutor', 'SeniorTutor', 'GM', 'CM'];

export const DEFAULT_ROLE: UserRole = 'Player';

export const PERMISSIONS = {
    canViewAdminDashboard: ['CM', 'GM'],
    canManageAllUsers: ['CM'],
    canManageNonCMUsers: ['GM'],
    canPromotePlayerToTutor: ['CM', 'GM', 'SeniorTutor'],
    canVote: ['CM', 'GM', 'SeniorTutor', 'Tutor'],
    canReport: ['CM', 'GM', 'SeniorTutor', 'Tutor'],
    canSuggest: ['CM', 'GM', 'SeniorTutor', 'Tutor'],
    // ... additional permissions
};
```

---

## Role Assignment

### Via Admin Dashboard (GM/CM only)

1. Navigate to **Admin Dashboard** → **Users** tab
2. Find the user and click the **Edit** button
3. Select the desired role from the dropdown
4. Click **Save**

> **Note:** GMs cannot assign the CM role or modify CM users.

### Via Promote Page (SeniorTutor+)

1. Navigate to **Promote Players** (`/promote`)
2. Find the Player you want to promote
3. Click **Promote to Tutor**

> **Note:** This only works for users with the Player role.

### Default Assignment

All new users registering through Google OAuth are automatically assigned the **Player** role.

---

## Database Migration

When updating from the old 3-role system to the new 5-role system:

```sql
-- Add new enum values (if using enum type)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'CM';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'SeniorTutor';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'Player';

-- Migrate existing roles
UPDATE users SET role = 'SeniorTutor' WHERE role = 'Senior Tutor';

-- Existing 'Tutor' users remain as 'Tutor'
-- Existing 'GM' users remain as 'GM'
```

> **Note:** If using a text column, simply update the values directly.
