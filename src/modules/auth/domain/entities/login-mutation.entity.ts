import type { AuthUser } from "./auth-user.entity"

export interface LoginMutation {
  success: string
  data: AuthUser
}