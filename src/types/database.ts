export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    role: 'GM' | 'Senior Tutor' | 'Tutor'
                    character_name: string | null
                    server: string | null
                    avatar_url: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    role?: 'GM' | 'Senior Tutor' | 'Tutor'
                    character_name?: string | null
                    server?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    role?: 'GM' | 'Senior Tutor' | 'Tutor'
                    character_name?: string | null
                    server?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
            }
            questions: {
                Row: {
                    id: string
                    question_text: string
                    answer_text: string
                    category: string
                    created_by: string | null
                    is_approved: boolean
                    score: number
                    created_at: string
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    question_text: string
                    answer_text: string
                    category: string
                    created_by?: string | null
                    is_approved?: boolean
                    score?: number
                    created_at?: string
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    question_text?: string
                    answer_text?: string
                    category?: string
                    created_by?: string | null
                    is_approved?: boolean
                    score?: number
                    created_at?: string
                    updated_at?: string | null
                }
            }
            votes: {
                Row: {
                    id: string
                    user_id: string
                    question_id: string
                    vote_type: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    question_id: string
                    vote_type: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    question_id?: string
                    vote_type?: number
                    created_at?: string
                }
            }
            pinned_questions: {
                Row: {
                    user_id: string
                    question_id: string
                    created_at: string
                }
                Insert: {
                    user_id: string
                    question_id: string
                    created_at?: string
                }
                Update: {
                    user_id?: string
                    question_id?: string
                    created_at?: string
                }
            }
            reports: {
                Row: {
                    id: string
                    question_id: string | null
                    user_id: string | null
                    reason: string
                    status: 'pending' | 'resolved' | 'dismissed'
                    created_at: string
                }
                Insert: {
                    id?: string
                    question_id?: string | null
                    user_id?: string | null
                    reason: string
                    status?: 'pending' | 'resolved' | 'dismissed'
                    created_at?: string
                }
                Update: {
                    id?: string
                    question_id?: string | null
                    user_id?: string | null
                    reason?: string
                    status?: 'pending' | 'resolved' | 'dismissed'
                    created_at?: string
                }
            }
            suggestions: {
                Row: {
                    id: string
                    user_id: string | null
                    content: string
                    type: 'new_question' | 'edit_proposal' | 'general_feedback'
                    status: 'pending' | 'approved' | 'rejected'
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    content: string
                    type: 'new_question' | 'edit_proposal' | 'general_feedback'
                    status?: 'pending' | 'approved' | 'rejected'
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    content?: string
                    type?: 'new_question' | 'edit_proposal' | 'general_feedback'
                    status?: 'pending' | 'approved' | 'rejected'
                    created_at?: string
                }
            }
            global_settings: {
                Row: {
                    id: string
                    banner_message: string | null
                    is_banner_active: boolean
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    banner_message?: string | null
                    is_banner_active?: boolean
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    banner_message?: string | null
                    is_banner_active?: boolean
                    updated_at?: string | null
                }
            }
        }
    }
}
