/**
 * Intelligent Multi-Variant Search Utility for Olato
 * Supports:
 * - Case-insensitivity (lowercase, uppercase, mixed)
 * - Accent/Diacritic normalization ('Café' -> 'Cafe', 'crème' -> 'creme')
 * - Punctuation & Apostrophe normalization ('Paola’s' -> 'paolas', 'P.F. Chang’s' -> 'pf changs')
 * - Symbol conversion ('&' -> 'and', '-' -> ' ')
 * - Common Pakistani food & brand aliases ('bbq' <-> 'bar-b-q', 'chai' <-> 'chaye')
 * - Order-independent multi-word token matching ('aylanto cafe' matches 'Café Aylanto')
 * - Prefix matching ('aylan' matches 'Aylanto')
 * - Typo tolerance via Levenshtein distance (1 typo for 4+ chars, 2 for 7+ chars)
 */

/**
 * Strips diacritics and accents (e.g. é -> e, ä -> a, etc.)
 */
export function removeDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normalizes text for comparison:
 * Lowercases, strips diacritics, unifies curly quotes, normalizes '&' and symbols
 */
export function normalizeText(str: string): string {
  if (!str) return '';
  return removeDiacritics(str)
    .toLowerCase()
    // Convert curly apostrophes & quotes to standard single quote
    .replace(/[\u2018\u2019\u201A\u201B\u0060\u00B4]/g, "'")
    // Convert curly double quotes to standard
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    // Convert & to 'and'
    .replace(/&/g, ' and ')
    // Convert hyphens and slashes to space
    .replace(/[-_/]/g, ' ')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Clean alphanumeric slug version:
 * Strips all non-alphanumeric characters (including apostrophes)
 * e.g. "Paola’s Cosa Nostra" -> "paolas cosa nostra"
 * e.g. "P.F. Chang's" -> "pf changs"
 * e.g. "Salt'n Pepper" -> "salt n pepper"
 */
export function cleanAlphanumeric(str: string): string {
  if (!str) return '';
  return normalizeText(str)
    .replace(/['".]/g, '') // remove apostrophes, quotes, dots directly
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates synonyms and query expansion for common abbreviations and brand styles
 */
export function expandQueryTerms(term: string): string[] {
  const norm = cleanAlphanumeric(term);
  const expansions = new Set<string>([norm]);

  const synonymsMap: Record<string, string[]> = {
    'bbq': ['bar b q', 'barbq', 'barbecue'],
    'bar b q': ['bbq', 'barbecue'],
    'barbecue': ['bbq', 'bar b q'],
    'chai': ['chaye', 'tea'],
    'chaye': ['chai', 'tea'],
    'tea': ['chai', 'chaye'],
    'coffee': ['cafe', 'coffees'],
    'cafe': ['coffee'],
    'steak': ['steaks', 'steakhouse'],
    'steaks': ['steak', 'steakhouse'],
    'steakhouse': ['steak', 'steaks'],
    'karahi': ['karhai', 'karhi'],
    'nihari': ['nahari'],
    'nahari': ['nihari'],
    'biryani': ['biryani', 'biriyani'],
    'hbl': ['habib bank'],
    'mcb': ['muslim commercial bank'],
    'ubl': ['united bank'],
    'abl': ['allied bank'],
    'bop': ['bank of punjab'],
    'bok': ['bank of khyber'],
    'dib': ['dubai islamic bank'],
    'scb': ['standard chartered'],
    'easypaisa': ['easy paisa'],
    'jazzcash': ['jazz cash'],
    'sadapay': ['sada pay'],
    'nayapay': ['naya pay'],
    'upaisa': ['u paisa'],
  };

  for (const [key, syns] of Object.entries(synonymsMap)) {
    if (norm === key || norm.includes(key)) {
      syns.forEach((s) => expansions.add(s));
    }
  }

  return Array.from(expansions);
}

/**
 * Calculates Levenshtein edit distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Checks if a single query token fuzzily matches any token in the target text
 */
function tokenFuzzyMatches(queryToken: string, targetTokens: string[]): boolean {
  if (!queryToken) return true;

  // 1. Exact token match or prefix match
  for (const targetToken of targetTokens) {
    if (targetToken === queryToken) return true;
    if (targetToken.startsWith(queryToken)) return true;
  }

  // 2. Typo tolerance (only for tokens with 4 or more letters)
  if (queryToken.length >= 4) {
    const maxAllowedDistance = queryToken.length >= 7 ? 2 : 1;
    for (const targetToken of targetTokens) {
      if (Math.abs(targetToken.length - queryToken.length) <= maxAllowedDistance) {
        if (levenshteinDistance(queryToken, targetToken) <= maxAllowedDistance) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Comprehensive Match Evaluator:
 * Tests if `query` matches `target` using multiple normalized strategies.
 * Returns match score (0 = no match, > 0 = matched, higher = stronger match).
 */
export function scoreMatch(query: string, target: string): number {
  if (!query || !query.trim()) return 100;
  if (!target) return 0;

  const rawQ = query.trim();
  const rawT = target.trim();

  const normQ = normalizeText(rawQ);
  const normT = normalizeText(rawT);

  const cleanQ = cleanAlphanumeric(rawQ);
  const cleanT = cleanAlphanumeric(rawT);

  // 1. Perfect exact match
  if (normT === normQ || cleanT === cleanQ) return 100;

  // 2. Starts with query
  if (normT.startsWith(normQ) || cleanT.startsWith(cleanQ)) return 90;

  // 3. Substring inclusion
  if (normT.includes(normQ) || cleanT.includes(cleanQ)) return 80;

  // 4. Reverse inclusion (e.g. target is "Aylanto", query is "Cafe Aylanto Lahore")
  if (normQ.includes(normT) || cleanQ.includes(cleanT)) return 75;

  // 5. Query token-by-token evaluation
  const qTokens = cleanQ.split(' ').filter(Boolean);
  const tTokens = cleanT.split(' ').filter(Boolean);

  if (qTokens.length > 0) {
    // Check if every token in query matches some token in target
    const allTokensMatch = qTokens.every((qTok) => tokenFuzzyMatches(qTok, tTokens));
    if (allTokensMatch) {
      return 70;
    }

    // Check with expanded query terms (synonyms, e.g. bbq -> bar b q)
    const expandedTerms = expandQueryTerms(cleanQ);
    for (const exp of expandedTerms) {
      if (cleanT.includes(exp)) return 65;
      const expTokens = exp.split(' ').filter(Boolean);
      if (expTokens.every((qTok) => tokenFuzzyMatches(qTok, tTokens))) {
        return 60;
      }
    }

    // If query has multiple tokens, partial match if at least 60% of tokens match
    if (qTokens.length >= 2) {
      const matchCount = qTokens.filter((qTok) => tokenFuzzyMatches(qTok, tTokens)).length;
      if (matchCount / qTokens.length >= 0.6) {
        return 50;
      }
    }
  }

  // 6. Global string fuzzy match for single-word queries with small typos
  if (cleanQ.length >= 4 && cleanQ.indexOf(' ') === -1) {
    for (const tTok of tTokens) {
      const maxDistance = cleanQ.length >= 7 ? 2 : 1;
      if (Math.abs(tTok.length - cleanQ.length) <= maxDistance) {
        if (levenshteinDistance(cleanQ, tTok) <= maxDistance) {
          return 40;
        }
      }
    }
  }

  return 0;
}

/**
 * Boolean helper: Returns true if query matches any of the provided candidate strings.
 */
export function matchesQuery(query: string, candidates: (string | undefined | null)[]): boolean {
  if (!query || !query.trim()) return true;

  return candidates.some((candidate) => {
    if (!candidate) return false;
    return scoreMatch(query, candidate) > 0;
  });
}
