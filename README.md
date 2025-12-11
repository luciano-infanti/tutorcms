# 📘 TutorCMS - Staff Helper Tool

A comprehensive knowledge base and management tool designed for RubinOT staff (Tutors, Senior Tutors, and GMs). This application helps staff answer player questions efficiently, manage the FAQ database, and handle user feedback.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Run the development server:**
    ```bash
    npm run dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Admin Guide (For GMs)

The **Admin Dashboard** is the command center for managing the application. Access it by clicking the **Shield Icon** in the sidebar or navigating to `/admin`.

> **Note:** Only users with the `GM` role can access this area.

### 1. Managing Users & Roles 👥
You can manage staff access, promote/demote users, or remove them entirely.

-   **Navigate to:** Admin Dashboard -> **Users** tab.
-   **Change Role:** Click the **Edit (Pencil)** icon next to a user. Select the new role (`Tutor`, `Senior Tutor`, or `GM`) from the dropdown and click **Save**.
-   **Delete User:** Click the **Trash** icon next to a user. **Warning:** This action is irreversible.

### 2. Managing Questions ❓
Keep the knowledge base up-to-date.

-   **Navigate to:** Admin Dashboard -> **Questions** tab.
-   **Add New:** Click the **+ Add Question** button. Fill in the Question, Answer, and Category.
-   **Edit:** Click the **Edit (Pencil)** icon on any existing question.
-   **Delete:** Click the **Trash** icon to remove a question permanently.

### 3. Handling Reports & Suggestions 📢
Review feedback from your staff.

-   **Reports:** Check the **Reports** tab for flagged questions. You can **Resolve** (fix the issue) or **Dismiss** (ignore) the report.
-   **Suggestions:** Check the **Suggestions** tab. Users can suggest edits to existing answers or propose new questions. You can **Approve** (automatically updates the content) or **Reject** them.

---

## ⚙️ Maintenance Guide (For Developers)

### Updating the Wiki Linker 🔗
The **Wiki Linker** automatically detects keywords in answers and links them to the Tibia Wiki or RubinOT Wiki.

**To add or modify keywords:**
1.  Open `src/config/wiki-keywords.ts`.
2.  **Tibia Wiki:** Add entries to the `KEYWORDS` object.
    ```typescript
    export const KEYWORDS = {
        'Keyword to Match': 'Wiki_Page_Slug',
        // Example: 'Magic Longsword': 'Magic_Longsword',
    };
    ```
3.  **RubinOT Wiki:** Add entries to the `RUBINOT_KEYWORDS` object.
    ```typescript
    export const RUBINOT_KEYWORDS = {
        'Custom Event': 'event-slug',
    };
    ```
4.  The system automatically matches the longest keywords first to prevent partial matches (e.g., matching "Sword" inside "Magic Longsword").

### Database & Roles
-   **Roles** are stored in the `users` table in Supabase.
-   **Permissions** are defined in `src/config/roles.ts`.

---

## 📚 User Guide (For Tutors)

### How to Use the Dashboard
1.  **Search First:** Start typing in the main search bar. The system searches both questions and answers instantly.
2.  **Copy Answers:** Click the **Copy Icon** (or the answer text itself) to copy the answer to your clipboard.
3.  **Wiki Links:** Click on highlighted blue text to open the relevant Wiki page for more info.

### Contributing
-   **Suggest Edits:** Found a mistake? Click the **Lightbulb Icon** on a question card to suggest a fix.
-   **Report Issues:** Click the **Flag Icon** if a question is obsolete or inappropriate.
-   **Vote:** Use the **Thumbs Up** button to boost helpful questions.

---

## 🔐 Access Control

The application is protected by a global gate password.
-   **Global Password:** Set in the environment variables (or hardcoded in `src/app/page.tsx` for this version).
-   **User Accounts:** Users must sign in (via NextAuth) to access the dashboard.
