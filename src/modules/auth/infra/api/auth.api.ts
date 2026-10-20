import { api } from "@/shared/store/api";
import type { ActivateRegistrationQueryArg } from "../../domain/entities/activate-registration-query-arg.entity";
import type { AuthUser } from "../../domain/entities/auth-user.entity";
import type { LoginMutation } from "../../domain/entities/login-mutation.entity";
import type { LoginQueryArg } from "../../domain/entities/login-query-arg.entity";
import type { RegisterMutation } from "../../domain/entities/register-mutation.entity";
import type { RegisterQueryArg } from "../../domain/entities/register-query-arg.entity";

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Get me
     */
    getMe: build.query<AuthUser, void>({
      query: () => '/user/me',
    }),
    /**
     * Login
     */
    login: build.mutation<LoginMutation, LoginQueryArg>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    /**
     * Logout
     */
    logout: build.mutation<{ success: boolean }, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    /**
     * Register
     */
    register: build.mutation<RegisterMutation, RegisterQueryArg>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    /**
     * Activate registration  
     */
    activateRegistration: build.mutation<{ success: boolean }, ActivateRegistrationQueryArg>({
      query: (body) => ({
        url: '/auth/activate',
        method: 'POST',
        body,
      }),
    }),
    /**
     * Resend activation email
     */
    resendActivationEmail: build.mutation<{ success: boolean }, { email: string }>({
      query: (body) => ({
        url: '/auth/resend-activation',
        method: 'POST',
        body,
      }),
    }),
    // ** Validate Username ** 
    validateUsername: build.mutation<{ success: boolean }, { username: string }>({
      query: (body) => ({
        url: '/user/validate-username',
        method: 'POST',
        body,
      }),
    }),
  })
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useRegisterMutation,
  useActivateRegistrationMutation,
  useResendActivationEmailMutation,
  useValidateUsernameMutation,
} = authApi
