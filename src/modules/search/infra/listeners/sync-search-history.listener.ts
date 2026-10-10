import { authApi } from "@/modules/auth/infra/api/auth.api"
import { startAppListening } from "@/shared/store/listener"
import { isAnyOf } from "@reduxjs/toolkit"
import { searchHistoryApi } from "../api/search-history.api"
import { localSearchHistory } from "../storage/local-search-history.storage"

export const registerSearchHistorySync = () => {
  startAppListening({
    matcher: isAnyOf(authApi.endpoints.login.matchFulfilled, authApi.endpoints.getMe.matchFulfilled),
    effect: async (_action, listenerApi) => {
      const entries = await localSearchHistory.getAll().catch(() => [])
      if(!entries.length) return;

      try {
        await listenerApi.dispatch(searchHistoryApi.endpoints.importSearchHistory.initiate(entries))
        await localSearchHistory.clear()
      } catch (error) {
        console.error(error)
      }
    }
  })
}
