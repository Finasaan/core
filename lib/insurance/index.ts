export type {
  InsuranceProvider,
  InsuranceProduct,
  InsuranceType,
  ProviderSegment,
  PolicyCategory,
  CategoryInfo,
  ComparisonPoint,
} from "./types";

export {
  PROVIDERS,
  CATEGORIES,
  TAKAFUL_COMPARISON,
  INSURANCE_STATS,
  getAllProducts,
  getProductsByCategory,
  getProviderBySlug,
  getProductBySlug,
  getTakafulProviders,
  getConventionalProviders,
  getCategoryInfo,
} from "./data";
