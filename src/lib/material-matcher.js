import { sql } from '@vercel/postgres';
import { searchMaterials, searchByReference } from '@/db/index.js';

// Calculate similarity score between two strings
function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;

  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  // Exact match
  if (s1 === s2) return 1.0;

  // Contains match
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;

  // Word overlap
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  const commonWords = words1.filter(w => words2.includes(w));
  const overlap = commonWords.length / Math.max(words1.length, words2.length);

  return overlap;
}

// Extract key electrical terms for better matching
function extractKeyTerms(description) {
  const terms = [];

  // Extract voltage
  const voltageMatch = description.match(/(\d+)\s*V/i);
  if (voltageMatch) terms.push(voltageMatch[1] + 'V');

  // Extract current
  const currentMatch = description.match(/(\d+)\s*A/i);
  if (currentMatch) terms.push(currentMatch[1] + 'A');

  // Extract poles
  const poleMatch = description.match(/(\d+)\s*P|(\d+)\s*pole/i);
  if (poleMatch) terms.push((poleMatch[1] || poleMatch[2]) + 'P');

  // Common abbreviations mapping
  const abbreviations = {
    'circuit breaker': ['MCB', 'MCCB', 'ACB', 'CB'],
    'distribution panel': ['MDB', 'SMDB', 'DB', 'PANEL'],
    'terminal block': ['TB', 'TERMINAL'],
    'cable': ['NYY', 'NYA', 'XLPE', 'CABLE']
  };

  // Check for common terms and add their abbreviations
  const lowerDesc = description.toLowerCase();
  for (const [term, abbrevs] of Object.entries(abbreviations)) {
    if (lowerDesc.includes(term)) {
      terms.push(...abbrevs);
    }
  }

  return terms;
}

// Match a single extracted material against the database
export async function matchMaterial(extractedItem) {
  const matches = [];

  // 1. Try exact reference match if we have possible references
  if (extractedItem.possibleReferences?.length > 0) {
    for (const ref of extractedItem.possibleReferences) {
      try {
        const result = await searchByReference(ref);
        if (result && result.length > 0) {
          matches.push({
            ...result[0],
            confidence: 0.95,
            matchType: 'exact_reference'
          });
        }
      } catch (error) {
        console.error('Reference search error:', error);
      }
    }
  }

  // 2. Try smart search with key terms
  if (extractedItem.description) {
    try {
      // Extract key electrical terms
      const keyTerms = extractKeyTerms(extractedItem.description);

      // Search with key terms first
      for (const term of keyTerms.slice(0, 3)) { // Limit to avoid too many searches
        const termResults = await searchMaterials(term);

        for (const result of termResults.slice(0, 5)) {
          // Check if other key terms also match
          let matchScore = 0.4; // Base score for one term match
          for (const otherTerm of keyTerms) {
            if (result.description.toUpperCase().includes(otherTerm.toUpperCase())) {
              matchScore += 0.2;
            }
          }

          // Check specifications match
          if (extractedItem.specifications) {
            const specs = extractedItem.specifications.toLowerCase();
            const resultDesc = result.description.toLowerCase();
            if (specs.includes('380v') && resultDesc.includes('380v')) matchScore += 0.1;
            if (specs.includes('220v') && resultDesc.includes('220v')) matchScore += 0.1;
            if (specs.includes('4p') && resultDesc.includes('4p')) matchScore += 0.1;
          }

          if (matchScore > 0.3) {
            matches.push({
              ...result,
              confidence: Math.min(matchScore, 0.9),
              matchType: 'smart_match'
            });
          }
        }
      }

      // Fallback to original description search if no smart matches
      if (matches.length === 0) {
        const descResults = await searchMaterials(extractedItem.description);

        // Calculate similarity scores
        for (const result of descResults.slice(0, 10)) {
          const similarity = calculateSimilarity(
            result.description,
            extractedItem.description
          );

          // Boost score if brand matches
          let confidence = similarity;
          if (extractedItem.brand && result.description.toLowerCase().includes(extractedItem.brand.toLowerCase())) {
            confidence = Math.min(confidence + 0.2, 0.9);
          }

          if (confidence > 0.3) {
            matches.push({
              ...result,
              confidence,
              matchType: 'description_match'
            });
          }
        }
      }
    } catch (error) {
      console.error('Description search error:', error);
    }
  }

  // 3. Try searching with combined terms
  if (matches.length === 0 && extractedItem.brand && extractedItem.specifications) {
    try {
      const combinedSearch = `${extractedItem.brand} ${extractedItem.specifications}`;
      const results = await searchMaterials(combinedSearch);

      for (const result of results.slice(0, 5)) {
        matches.push({
          ...result,
          confidence: 0.5,
          matchType: 'combined_search'
        });
      }
    } catch (error) {
      console.error('Combined search error:', error);
    }
  }

  // Sort by confidence and return top 3 matches
  matches.sort((a, b) => b.confidence - a.confidence);
  return matches.slice(0, 3);
}

// Process all extracted materials
export async function matchAllMaterials(extractedMaterials) {
  const results = [];

  for (const item of extractedMaterials) {
    const matches = await matchMaterial(item);

    results.push({
      extracted: item,
      matches: matches,
      bestMatch: matches[0] || null
    });
  }

  return results;
}