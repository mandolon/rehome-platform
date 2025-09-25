export type RequestStatus = 'open' | 'in_progress' | 'closed'

export interface SimpleUser {
  id: number
  name: string
  role: string
  team_type?: string | null
}

export interface RequestComment {
  id: number
  request_id: number
  user: SimpleUser
  body: string
  created_at: string
}

export interface Request {
  id: number
  title: string
  status: RequestStatus
  creator: SimpleUser
  assignee?: SimpleUser | null
  updated_at: string
  created_at: string
  comments?: RequestComment[]
}
