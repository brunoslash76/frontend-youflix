import { sessionExpired } from "@/shared/store/api";
import { createSlice } from "@reduxjs/toolkit";
import type { AuthUser } from "../../domain/entities/auth-user.entity";
import { authApi } from "../api/auth.api";

interface AuthState {
  user: AuthUser | null
  status: 'checking' | 'authenticated' | 'guest'
}

const initialState: AuthState = {
  user: null,
  status: 'checking',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sessionExpired, () => ({ user: null, status: 'guest' }))
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, { payload }) => {
        state.user = payload
        state.status = 'authenticated'
      })
      .addMatcher(authApi.endpoints.getMe.matchRejected, (state, action) => {
        if (action.meta.condition) return
        state.user = null
        state.status = 'guest'
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.user = payload.data
        state.status = 'authenticated'
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null
        state.status = 'guest'
      })
  }
})

export default authSlice.reducer