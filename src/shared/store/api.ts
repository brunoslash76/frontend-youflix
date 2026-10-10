import { createAction } from '@reduxjs/toolkit';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const sessionExpired = createAction('auth/sessionExpired')
const NO_REAUTH_URLS = ['/auth/login', '/auth/refresh']

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
})

let refreshing: Promise<boolean> | null = null

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)
  const url = typeof args === 'string' ? args : args.url

  if (result.error?.status === 401 && !NO_REAUTH_URLS.includes(url)) {
    refreshing ??= Promise.resolve(rawBaseQuery({ url: '/auth/refresh', method: 'POST' }, api, extraOptions))
      .then((r) => !r.error)
      .finally(() => { refreshing = null })

    if(await refreshing) {
      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      api.dispatch(sessionExpired())
    }
  }
  return result
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
})
