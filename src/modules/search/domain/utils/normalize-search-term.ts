const MAX_TERM_LENGTH = 100;

export const normalizeSearchTerm = (term: string) => 
  term.trim().replace(/\s+/g, ' ').toLowerCase().slice(0, MAX_TERM_LENGTH);