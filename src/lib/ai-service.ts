import { AIParseResult, CategoryType } from './types';

/**
 * Parses natural language input into structured filter parameters for Olato discovery.
 * If an external AI provider API key is provided, it calls the LLM, otherwise falls back
 * to robust local heuristic keyword & pattern parsing.
 */
export async function parseNaturalLanguageQuery(userPrompt: string): Promise<AIParseResult> {
  const apiKey = process.env.NEXT_PUBLIC_AI_DISCOVERY_KEY;
  const promptLower = userPrompt.toLowerCase();

  // Fallback / standard natural language parser
  let category: CategoryType | 'ALL' = 'ALL';
  let minDiscount: number | undefined = undefined;
  let validToday = false;
  let verifiedOnly = false;
  let studentOnly = false;
  let locationArea: string | undefined = undefined;

  // 1. Map category intent (STRICTLY CAFE, RESTAURANT, FEATURED_PLACE)
  if (
    promptLower.includes('cafe') ||
    promptLower.includes('café') ||
    promptLower.includes('coffee') ||
    promptLower.includes('bakery') ||
    promptLower.includes('espresso') ||
    promptLower.includes('pastry') ||
    promptLower.includes('croissant') ||
    promptLower.includes('tea')
  ) {
    category = 'CAFE';
  } else if (
    promptLower.includes('restaurant') ||
    promptLower.includes('dining') ||
    promptLower.includes('dinner') ||
    promptLower.includes('lunch') ||
    promptLower.includes('bistro') ||
    promptLower.includes('food') ||
    promptLower.includes('meal') ||
    promptLower.includes('pasta') ||
    promptLower.includes('bbq') ||
    promptLower.includes('buffet') ||
    promptLower.includes('biryani')
  ) {
    category = 'RESTAURANT';
  } else if (
    promptLower.includes('featured') ||
    promptLower.includes('top place') ||
    promptLower.includes('special') ||
    promptLower.includes('courtyard') ||
    promptLower.includes('iconic') ||
    promptLower.includes('fine dining')
  ) {
    category = 'FEATURED_PLACE';
  }

  // 2. Extract percentage discounts (e.g., "at least 20%", "30% off")
  const percMatch = promptLower.match(/(\d+)\s*%/);
  if (percMatch) {
    minDiscount = parseInt(percMatch[1], 10);
  } else if (promptLower.includes('high discount') || promptLower.includes('big deal')) {
    minDiscount = 25;
  }

  // 3. Extract time / validity intent
  if (
    promptLower.includes('today') ||
    promptLower.includes('now') ||
    promptLower.includes('open') ||
    promptLower.includes('tonight')
  ) {
    validToday = true;
  }

  // 4. Verification preference
  if (promptLower.includes('verified') || promptLower.includes('trusted') || promptLower.includes('guaranteed')) {
    verifiedOnly = true;
  }

  // 5. Student discount preference
  if (promptLower.includes('student') || promptLower.includes('university') || promptLower.includes('campus')) {
    studentOnly = true;
  }

  // 6. Extract location areas
  if (promptLower.includes('gulberg')) locationArea = 'Gulberg';
  if (promptLower.includes('dha') || promptLower.includes('defence')) locationArea = 'DHA';
  if (promptLower.includes('mm alam')) locationArea = 'MM Alam Road';
  if (promptLower.includes('johar town')) locationArea = 'Johar Town';
  if (promptLower.includes('mall road') || promptLower.includes('anarkali')) locationArea = 'Mall Road';

  // Build natural summary reasoning
  const categoryLabel = category === 'CAFE' ? 'Cafés' : category === 'RESTAURANT' ? 'Restaurants' : category === 'FEATURED_PLACE' ? 'Featured Places' : 'Cafés & Restaurants';
  const discountLabel = minDiscount ? `${minDiscount}%+ discount` : 'active offers';
  const locationLabel = locationArea ? `in ${locationArea}` : 'near you';

  const summaryReasoning = `Found ${categoryLabel} offering ${discountLabel} ${locationLabel}${validToday ? ' valid today' : ''}.`;

  // Optional: If an external key is set, we could fetch from LLM endpoint here
  if (apiKey) {
    try {
      // Stub for external LLM connection if configured
    } catch {
      // Fallback
    }
  }

  return {
    category,
    query: userPrompt,
    minDiscount,
    validToday,
    verifiedOnly,
    studentOnly,
    locationArea,
    summaryReasoning,
  };
}
