import type { RootState } from "@/shared/store";

export const currentUserSelector = (state: RootState) => state.auth.user;