/**
 * Personalization Utilities — Finasaan
 * Logic for tailoring content based on user interests and knowledge level.
 */

// Maps user interest slugs from onboarding → PSX sector names
// Sector names match the 'sector' field in the companies table
export const INTEREST_TO_SECTOR: Record<string, string[]> = {
  technology: ["Technology & Communication"],
  banking: ["Commercial Banks", "Investment Banks / Investment Companies"],
  energy: ["Oil & Gas Exploration Companies", "Power Generation & Distribution"],
  real_estate: ["Real Estate Investment Trust"],
  consumer: ["Food & Personal Care Products", "Tobacco"],
  pharma: ["Pharmaceuticals"],
  cement: ["Cement"],
  fertilizer: ["Fertilizer"],
  textiles: ["Textile Composite", "Textile Spinning"],
};

export function scoreStockForUser(
  stock: { sector?: string },
  interests: string[]
): number {
  if (!stock.sector) return 0;
  const userSectors = interests.flatMap((i) => INTEREST_TO_SECTOR[i] ?? []);
  return userSectors.includes(stock.sector) ? 1 : 0;
}

export function sortStocksByInterests<T extends { sector?: string }>(
  stocks: T[],
  interests: string[]
): T[] {
  if (!interests.length) return stocks;
  return [...stocks].sort(
    (a, b) => scoreStockForUser(b, interests) - scoreStockForUser(a, interests)
  );
}

export const KNOWLEDGE_LEVEL_RECOMMENDATION: Record<string, { title: string; id: string }> = {
  beginner: { title: "Stock Market Basics", id: "stock-market-basics" },
  intermediate: { title: "Mutual Funds Explained", id: "mutual-funds-explained" },
  advanced: { title: "Portfolio Strategy", id: "portfolio-strategy" },
};
