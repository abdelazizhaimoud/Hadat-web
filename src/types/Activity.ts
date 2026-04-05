import type { User } from "./User"
export type Category = "" | "sport" | "outdoor" | "travel"
export type Status = "" | "active" | "cancelled" | "completed"
export interface Activity {
  id: number,
  title: string,
  category: Category,
  location: string,
  date_time: string,
  max_participants: number,
  status: Status,
  host_id: number,
  joined: boolean,
  hosted: boolean,
  joined_count: number,
  participants?: User[],
  host?: User,
  created_at: Date,
  updated_at: Date,
}