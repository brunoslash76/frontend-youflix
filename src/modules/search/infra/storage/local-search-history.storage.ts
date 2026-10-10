import type { SearchHistoryEntry } from "../../domain/entities/search-history-entry.entity"
import { normalizeSearchTerm } from "../../domain/utils/normalize-search-term"

const DB_NAME = 'youflix'
const DB_VERSION = 1
const STORE_NAME = 'search-history'
const MAX_STORED_TERMS = 50
const MAX_SUGGESTIONS = 15

let dbPromise: Promise<IDBDatabase> | null = null;

const getDb = () => dbPromise ??= new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, DB_VERSION)
  request.onupgradeneeded = () => {
    const store = request.result.createObjectStore(STORE_NAME, { keyPath: 'term' })
    store.createIndex('searchedAt', 'searchedAt')
  }
  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(request.error)
})

const toPromise = <T>(request: IDBRequest<T>) => new Promise<T>((resolve, reject) => {
  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(request.error)
})

const transactionDone = (transaction: IDBTransaction) => new Promise<void>((resolve, reject) => {
  transaction.oncomplete = () => resolve()
  transaction.onerror = () => reject(transaction.error)
  transaction.onabort = () => reject(transaction.error)
})

const add = async (term: string) => {
  const normalized = normalizeSearchTerm(term)
  if (!normalized) return;

  const db = await getDb()
  const transaction = db.transaction(STORE_NAME, 'readwrite')
  const store = transaction.objectStore(STORE_NAME)
  store.put({ term: normalized, searchedAt: Date.now() } satisfies SearchHistoryEntry)

  let excess = (await toPromise(store.count())) - MAX_STORED_TERMS;

  if (excess > 0) {
    const cursorRequest = store.index('searchedAt').openCursor()
    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result

      if (!cursor || excess <= 0) return
      cursor.delete()
      excess--
      cursor.continue()
    }
  }

  await transactionDone(transaction)
}

const getAll = async (): Promise<SearchHistoryEntry[]> => {
  const db = await getDb()
  return toPromise(db.transaction(STORE_NAME).objectStore(STORE_NAME).getAll())
}

const findRecent = async (prefix = '') => {
  const normalizedPrefix = normalizeSearchTerm(prefix)
  const entries = await getAll()
  return entries
    .sort((a, b) => a.searchedAt - b.searchedAt)
    .map(({ term }) => term)
    .filter((term) => term.startsWith(normalizedPrefix))
    .slice(0, MAX_SUGGESTIONS)
}

const clear = async () => {
  const db = await getDb()
  const transaction = db.transaction(STORE_NAME, 'readwrite')
  transaction.objectStore(STORE_NAME).clear()
  await transactionDone(transaction)
}

export const localSearchHistory = { add, getAll, findRecent, clear }

