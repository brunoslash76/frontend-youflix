import { api } from "@/shared/store/api";
import type { SearchHistoryEntry } from "../../domain/entities/search-history-entry.entity";

export const searchHistoryApi = api
  .enhanceEndpoints({ addTagTypes: ['SearchHistory', 'Feed'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getSearchSuggestions: build.query<string[], string>({
        query: (q) => ({ url: '/search-history', params: q ? { q } : undefined }),
        transformResponse: (response: { data: string[] }) => response.data,
        providesTags: ['SearchHistory'],
      }),
      recordSearch: build.mutation<{ success: boolean }, { term: string }>({
        query: (body) => ({ url: 'search-history', method: 'POST', body }),
        invalidatesTags: ['SearchHistory', 'Feed'],
      }),
      importSearchHistory: build.mutation<{ success: boolean }, SearchHistoryEntry[]>({
        query: (entries) => ({ url: 'search-history/import', method: 'POST', body: { entries } }),
        invalidatesTags: ['SearchHistory', 'Feed'],
      }),
    })
  })

export const {
  useGetSearchSuggestionsQuery,
  useRecordSearchMutation,
  useImportSearchHistoryMutation,
} = searchHistoryApi