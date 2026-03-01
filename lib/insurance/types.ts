/**
 * Insurance module types
 * All insurance data is hardcoded educational content for the Finasaan platform.
 */

// ---- Provider ----

export type InsuranceType = "conventional" | "takaful" | "both";
export type ProviderSegment = "non-life" | "life" | "both";

export interface InsuranceProvider {
  slug: string;
  name: string;
  shortName: string;
  website: string;
  type: InsuranceType;
  segment: ProviderSegment;
  description: string;
  established?: string;
  rating?: string;
  logoPlaceholder: string; // 2-letter abbreviation for avatar
  productCount: number;
  products: InsuranceProduct[];
}

// ---- Product / Policy ----

export type PolicyCategory =
  | "health"
  | "life"
  | "motor"
  | "travel"
  | "property"
  | "marine"
  | "engineering"
  | "liability"
  | "cyber"
  | "agriculture"
  | "accident"
  | "education"
  | "savings"
  | "retirement"
  | "other";

export interface InsuranceProduct {
  slug: string;
  name: string;
  providerSlug: string;
  category: PolicyCategory;
  description: string;
  isTakaful: boolean;
  isIndividual: boolean; // true = individual, false = corporate
  coverageHighlights: string[];
  exclusions?: string[];
  keyFeatures?: string[];
  sourceUrl?: string;
}

// ---- Category metadata ----

export interface CategoryInfo {
  key: PolicyCategory;
  label: string;
  icon: string;
  description: string;
  color: string;
}

// ---- Takaful vs Conventional comparison ----

export interface ComparisonPoint {
  aspect: string;
  conventional: string;
  takaful: string;
}
