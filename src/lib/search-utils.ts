/**
 * Intelligent Multi-Variant Search & Bank Disambiguation Utility for Olato
 * 
 * Features:
 * - Bank Disambiguation: Strictly separates HBL vs Bank AL Habib vs Habib Metro vs Meezan vs Alfalah, etc.
 * - Intent Stopwords Extraction: "HBL Discounts" -> recognizes core entity "HBL" + intent "discounts"
 * - Case-insensitivity (lowercase, uppercase, mixed)
 * - Accent/Diacritic normalization ('Café' -> 'Cafe', 'crème' -> 'creme')
 * - Punctuation & Apostrophe normalization ('Paola’s' -> 'paolas', 'P.F. Chang’s' -> 'pf changs')
 * - Conjunction conversion ('&' -> 'and', '-' -> ' ')
 * - Token-order independent matching ('aylanto cafe' matches 'Café Aylanto')
 * - Typo tolerance via Levenshtein distance
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
    .replace(/[\u2018\u2019\u201A\u201B\u0060\u00B4]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/&/g, ' and ')
    .replace(/[-_/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Clean alphanumeric slug version:
 * Strips all non-alphanumeric characters (including apostrophes)
 */
export function cleanAlphanumeric(str: string): string {
  if (!str) return '';
  return normalizeText(str)
    .replace(/['".]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Search intent modifier words that describe what the user wants rather than the entity itself
export const INTENT_STOPWORDS = new Set([
  'discounts',
  'discount',
  'deals',
  'deal',
  'offers',
  'offer',
  'cards',
  'card',
  'promos',
  'promo',
  'promotions',
  'promotion',
  'vouchers',
  'voucher',
]);

/**
 * Extracts the core search entity by removing generic intent stopwords.
 * e.g. "HBL Discounts" -> "hbl"
 * e.g. "Meezan Bank Cards" -> "meezan bank"
 * e.g. "Gulberg Deals" -> "gulberg"
 * If the query consists ONLY of stopwords (e.g. "discounts"), returns the query.
 */
export function extractCoreQuery(query: string): string {
  const norm = cleanAlphanumeric(query);
  const words = norm.split(' ').filter(Boolean);
  const filtered = words.filter((w) => !INTENT_STOPWORDS.has(w));
  return filtered.length > 0 ? filtered.join(' ') : norm;
}

// ============================================================================
// PAKISTANI BANK & DIGITAL WALLET REGISTRY
// Strictly defines and isolates banks to avoid cross-bank false matches
// (e.g. HBL vs Bank AL Habib vs Habib Metro)
// ============================================================================

export interface BankDefinition {
  id: string;
  name: string;
  // Patterns in query or text that identify this bank
  matchPatterns: string[];
  // Patterns that must NOT be present (negative guards)
  excludePatterns: string[];
}

export const PAKISTANI_BANKS: BankDefinition[] = [
  {
    id: 'hbl',
    name: 'HBL (Habib Bank Limited)',
    matchPatterns: ['hbl', 'habib bank limited', 'habib bank', 'hbl konnect', 'konnect'],
    // HBL must NEVER match Bank Al Habib or Habib Metro
    excludePatterns: ['al habib', 'bank al habib', 'bahl', 'habib metro', 'habib metropolitan', 'metro bank'],
  },
  {
    id: 'bank_al_habib',
    name: 'Bank AL Habib',
    matchPatterns: ['bank al habib', 'al habib', 'bahl', 'alhabib'],
    excludePatterns: ['habib bank limited', 'habib bank', 'hbl', 'hbl konnect'],
  },
  {
    id: 'habib_metro',
    name: 'Habib Metropolitan Bank',
    matchPatterns: ['habib metro', 'habib metropolitan', 'hmb', 'habibmetro'],
    excludePatterns: ['habib bank limited', 'habib bank', 'bank al habib', 'al habib', 'bahl'],
  },
  {
    id: 'meezan',
    name: 'Meezan Bank',
    matchPatterns: ['meezan', 'meezan bank', 'meezan islamic'],
    excludePatterns: [],
  },
  {
    id: 'bank_alfalah',
    name: 'Bank Alfalah',
    matchPatterns: ['bank alfalah', 'alfalah', 'alfa', 'alfa app', 'alfa qr'],
    excludePatterns: [],
  },
  {
    id: 'allied_bank',
    name: 'Allied Bank Limited (ABL)',
    matchPatterns: ['allied bank', 'allied', 'abl'],
    excludePatterns: [],
  },
  {
    id: 'ubl',
    name: 'United Bank Limited (UBL)',
    matchPatterns: ['united bank', 'ubl', 'united bank limited'],
    excludePatterns: [],
  },
  {
    id: 'mcb',
    name: 'MCB Bank',
    matchPatterns: ['mcb', 'mcb bank', 'muslim commercial bank', 'mcb islamic'],
    excludePatterns: [],
  },
  {
    id: 'standard_chartered',
    name: 'Standard Chartered',
    matchPatterns: ['standard chartered', 'scb', 'standard chartered pakistan', 'scb priority'],
    excludePatterns: [],
  },
  {
    id: 'faysal_bank',
    name: 'Faysal Bank',
    matchPatterns: ['faysal', 'faysal bank', 'faysal islamic'],
    excludePatterns: [],
  },
  {
    id: 'askari_bank',
    name: 'Askari Bank',
    matchPatterns: ['askari', 'askari bank'],
    excludePatterns: [],
  },
  {
    id: 'bank_of_punjab',
    name: 'The Bank of Punjab (BOP)',
    matchPatterns: ['bank of punjab', 'bop', 'punjab bank'],
    excludePatterns: [],
  },
  {
    id: 'bank_of_khyber',
    name: 'The Bank of Khyber (BOK)',
    matchPatterns: ['bank of khyber', 'bok', 'khyber bank'],
    excludePatterns: [],
  },
  {
    id: 'dubai_islamic',
    name: 'Dubai Islamic Bank (DIB)',
    matchPatterns: ['dubai islamic', 'dubai islamic bank', 'dib'],
    excludePatterns: [],
  },
  {
    id: 'bankislami',
    name: 'BankIslami Pakistan',
    matchPatterns: ['bankislami', 'bank islami'],
    excludePatterns: [],
  },
  {
    id: 'silkbank',
    name: 'Silkbank',
    matchPatterns: ['silkbank', 'silk bank'],
    excludePatterns: [],
  },
  {
    id: 'national_bank',
    name: 'National Bank of Pakistan (NBP)',
    matchPatterns: ['national bank', 'national bank of pakistan', 'nbp'],
    excludePatterns: [],
  },
  {
    id: 'soneri_bank',
    name: 'Soneri Bank',
    matchPatterns: ['soneri', 'soneri bank'],
    excludePatterns: [],
  },
  {
    id: 'js_bank',
    name: 'JS Bank',
    matchPatterns: ['js bank', 'js'],
    excludePatterns: [],
  },
  {
    id: 'easypaisa',
    name: 'Easypaisa',
    matchPatterns: ['easypaisa', 'easy paisa', 'telenor easypaisa'],
    excludePatterns: [],
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    matchPatterns: ['jazzcash', 'jazz cash', 'mobilink jazzcash'],
    excludePatterns: [],
  },
  {
    id: 'sadapay',
    name: 'SadaPay',
    matchPatterns: ['sadapay', 'sada pay'],
    excludePatterns: [],
  },
  {
    id: 'nayapay',
    name: 'NayaPay',
    matchPatterns: ['nayapay', 'naya pay'],
    excludePatterns: [],
  },
  {
    id: 'upaisa',
    name: 'UPaisa',
    matchPatterns: ['upaisa', 'u paisa', 'u microfinance'],
    excludePatterns: [],
  },
  {
    id: 'zindigi',
    name: 'Zindigi',
    matchPatterns: ['zindigi', 'zindagi'],
    excludePatterns: [],
  },
];

/**
 * Detects if a user query is searching for a specific bank or digital wallet.
 */
export function detectBankInQuery(query: string): BankDefinition | null {
  if (!query) return null;
  const cleanQ = cleanAlphanumeric(query);
  const qTokens = cleanQ.split(' ').filter(Boolean);

  // Check specific multi-word patterns first (e.g. "bank al habib", "habib metro")
  for (const bank of PAKISTANI_BANKS) {
    for (const pat of bank.matchPatterns) {
      if (pat.includes(' ')) {
        if (cleanQ === pat || cleanQ.includes(pat)) {
          // Verify no exclude patterns match
          const excluded = bank.excludePatterns.some((exc) => cleanQ.includes(exc));
          if (!excluded) return bank;
        }
      }
    }
  }

  // Check single-word patterns with whole token matching (e.g. "hbl", "meezan")
  for (const bank of PAKISTANI_BANKS) {
    for (const pat of bank.matchPatterns) {
      if (!pat.includes(' ')) {
        const hasToken = qTokens.includes(pat);
        if (hasToken) {
          // Verify no exclude patterns match
          const excluded = bank.excludePatterns.some((exc) => cleanQ.includes(exc));
          if (!excluded) return bank;
        }
      }
    }
  }

  return null;
}

/**
 * Checks if target card text matches a specific bank definition, strictly respecting exclusions.
 */
export function matchesBank(bankDef: BankDefinition, targetText: string): boolean {
  if (!targetText) return false;
  const cleanT = cleanAlphanumeric(targetText);
  const tTokens = cleanT.split(' ').filter(Boolean);

  // Check exclusions first
  for (const exc of bankDef.excludePatterns) {
    if (cleanT.includes(exc)) return false;
  }

  // Check match patterns
  for (const pat of bankDef.matchPatterns) {
    if (pat.includes(' ')) {
      if (cleanT.includes(pat)) return true;
    } else {
      if (tTokens.includes(pat) || cleanT.startsWith(pat + ' ') || cleanT.endsWith(' ' + pat)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks if a target card text belongs to a conflicting/competitor bank.
 */
export function isCompetitorBank(targetText: string, expectedBankId: string): boolean {
  if (!targetText) return false;
  const cleanT = cleanAlphanumeric(targetText);

  for (const bank of PAKISTANI_BANKS) {
    if (bank.id === expectedBankId) continue;
    if (matchesBank(bank, cleanT)) {
      return true;
    }
  }
  return false;
}

// ============================================================================
// GENERAL QUERY EXPANSION & SYNONYMS
// ============================================================================

export function expandQueryTerms(term: string): string[] {
  const norm = cleanAlphanumeric(term);
  const expansions = new Set<string>([norm]);
  const normTokens = norm.split(' ').filter(Boolean);

  const synonymsMap: Record<string, string[]> = {
    'bbq': ['bar b q', 'barbq', 'barbecue'],
    'bar b q': ['bbq', 'barbecue'],
    'barbecue': ['bbq', 'bar b q'],
    'chai': ['chaye', 'tea'],
    'chaye': ['chai', 'tea'],
    'tea': ['chai', 'chaye'],
    'coffee': ['cafe', 'coffees'],
    'cafe': ['coffee', 'cafes'],
    'cafes': ['cafe', 'coffee'],
    'steak': ['steaks', 'steakhouse'],
    'steaks': ['steak', 'steakhouse'],
    'steakhouse': ['steak', 'steaks'],
    'karahi': ['karhai', 'karhi'],
    'nihari': ['nahari'],
    'nahari': ['nihari'],
    'biryani': ['biryani', 'biriyani'],
    'pasta': ['italian', 'pastas'],
    'pizza': ['pizzas', 'italian'],
    'burger': ['burgers'],
    'burgers': ['burger'],
  };

  for (const [key, syns] of Object.entries(synonymsMap)) {
    // Only match whole-word or exact match to prevent "steak" matching "tea"
    if (norm === key || normTokens.includes(key)) {
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
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
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

  for (const targetToken of targetTokens) {
    if (targetToken === queryToken) return true;
    if (targetToken.startsWith(queryToken)) return true;
  }

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

// Common connectors that should not independently trigger multi-word matches
export const COMMON_CONNECTORS = new Set(['and', '&', 'the', 'of', 'in', 'at', 'for', 'with', 'on', 'a', 'an', 'to', 'or']);

/**
 * Multi-Strategy Match Evaluator:
 * Returns score 0..100 (0 = no match, > 0 = matched, higher = stronger match).
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
  if (normT.includes(normQ) || cleanT.includes(cleanQ)) return 85;

  // 4. Reverse inclusion (e.g. target is "Aylanto", query is "Cafe Aylanto Lahore")
  if (normQ.includes(normT) || cleanQ.includes(cleanT)) return 80;

  // 5. Query token-by-token evaluation
  const qTokens = cleanQ.split(' ').filter(Boolean);
  const tTokens = cleanT.split(' ').filter(Boolean);

  const meaningfulQTokens = qTokens.filter((t) => !COMMON_CONNECTORS.has(t));

  if (meaningfulQTokens.length > 0) {
    const allTokensMatch = meaningfulQTokens.every((qTok) => tokenFuzzyMatches(qTok, tTokens));
    if (allTokensMatch) {
      return 75;
    }

    const expandedTerms = expandQueryTerms(cleanQ);
    for (const exp of expandedTerms) {
      if (cleanT.includes(exp)) return 70;
      const expTokens = exp.split(' ').filter(Boolean).filter((t) => !COMMON_CONNECTORS.has(t));
      if (expTokens.length > 0 && expTokens.every((qTok) => tokenFuzzyMatches(qTok, tTokens))) {
        return 65;
      }
    }

    if (meaningfulQTokens.length >= 2) {
      const matchCount = meaningfulQTokens.filter((qTok) => tokenFuzzyMatches(qTok, tTokens)).length;
      if (matchCount / meaningfulQTokens.length >= 0.7) {
        return 50;
      }
    }
  }

  // 6. Typo tolerance for single-word queries
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
 * Boolean helper: Returns true if query matches any of the candidate strings.
 */
export function matchesQuery(query: string, candidates: (string | undefined | null)[]): boolean {
  if (!query || !query.trim()) return true;

  return candidates.some((candidate) => {
    if (!candidate) return false;
    return scoreMatch(query, candidate) > 0;
  });
}
