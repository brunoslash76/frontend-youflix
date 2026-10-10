import { useAppSelector } from "@/shared/store"
import { useEffect, useState } from "react"
import { useGetSearchSuggestionsQuery, useRecordSearchMutation } from "../../infra/api/search-history.api"
import { localSearchHistory } from "../../infra/storage/local-search-history.storage"

export const useSearchSuggestions = (query: string) => {
  const isAuthenticated = useAppSelector(state => state.auth.status === 'authenticated')
  const { data: remoteSuggestions = [] } = useGetSearchSuggestionsQuery(query, { skip: !isAuthenticated })
  const [recordRemote] = useRecordSearchMutation()
  const [localSuggestions, setLocalSuggestions] = useState<string[]>([])
  const [localVersion, setLocalVersion] = useState(0)

  useEffect(() => {
    if (isAuthenticated) return;

    let cancelled = false

    localSearchHistory.findRecent(query)
      .then((terms) => {
        if (!cancelled) setLocalSuggestions(terms)
      })
      .catch(() => {
        if (!cancelled) setLocalSuggestions([])
      })

    return () => { cancelled = true }


  }, [query, isAuthenticated, localVersion])

  const record = async (term: string) => {
    if (isAuthenticated) {
      await recordRemote({ term })
      return;
    }

    await localSearchHistory.add(term)
    setLocalVersion(prev => prev + 1)
  }

  return { suggestions: remoteSuggestions.length ? remoteSuggestions : localSuggestions, record }
}