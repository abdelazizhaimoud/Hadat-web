import type { User } from "./User"
export interface Activity {
  id: number,
  title: string,
  category: string,
  location: string,
  date_time: string,
  max_participants: number,
  host_id: number,
  joined: boolean,
  participants?: User[],
  host?: User,
  created_at: Date,
  updated_at: Date,
}