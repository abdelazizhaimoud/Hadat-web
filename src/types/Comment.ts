import type { User } from "./User";

export interface Comment {
    user_id: number,
    activity_id: number,
    content: string,
    likes: number,
    dislikes: number,
    shares: number,
    created_at: Date,
    updated_at: Date,
    user: User
}