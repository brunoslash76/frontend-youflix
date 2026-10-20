import type { AuthStatus } from "@/modules/auth/domain/types/status.type";

export type GetHomeFeedArgs = {
  status: AuthStatus;
  page?: number;
  limit?: number;
}