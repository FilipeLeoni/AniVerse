import { User } from "next-auth";

export interface Comments {
  id: string;
  text: string;
  mentioned_user_ids?: string[];
  parentId?: string;
  replies?: [];
  created_at: string;
  updated_at: string;
  user: User;
}
