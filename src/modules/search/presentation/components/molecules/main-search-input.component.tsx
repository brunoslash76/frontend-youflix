import { useDebouncedValue } from "@/shared/hooks/use-debounced-value.hook"
import { useState } from "react"
import { useSearchSuggestions } from "../../hooks/use-search-suggestions.hook"

interface MainSearchInputProps {
  onSearch: (term: string) => void
}

export const MainSearchInput = ({ onSearch }: MainSearchInputProps) => {
  const [value, setValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const query = useDebouncedValue(value, 200)
  const { suggestions, record } = useSearchSuggestions(query)

  const submit = (term: string) => {
    const trimmed = term.trim()

    if (!trimmed) return

    setValue(trimmed)
    setIsOpen(false)
    void record(trimmed)
    onSearch?.(trimmed)
  }

  return (
    <form
      role="search"
      className="relative"
      onSubmit={(event) => {
        event.preventDefault()
        submit(value)
      }}
    >
      <input
        type="search"
        placeholder="Search"
        aria-label="Search"
        autoComplete="off"
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-10 mt-1 rounded bg-primary-ghost py-1 shadow-lg">
          {suggestions.map((term) => (
            <li key={term}>
              <button
                type="button"
                className="w-full px-3 py-1 text-left hover:bg-white/10"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => submit(term)}
              >
                {term}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  )
}