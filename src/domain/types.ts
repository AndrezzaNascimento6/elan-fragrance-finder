import taxonomy from '../../data/taxonomy.json';
export { taxonomy };
export type Feeling = keyof typeof taxonomy.feeling;
export type Occasion = keyof typeof taxonomy.occasion;
export type Category = keyof typeof taxonomy.category;
export type Intensity = keyof typeof taxonomy.intensity;
export type Budget = keyof typeof taxonomy.budget;
export type PreferenceSet = { feeling: Feeling; occasion: Occasion; category: Category; intensity: Intensity; budget: Budget };
export type Dimension = keyof PreferenceSet;
export const dimensions: Dimension[] = ['feeling', 'occasion', 'category', 'intensity', 'budget'];
export const label = (dimension: Dimension, value: string): string => (taxonomy[dimension] as Record<string,string>)[value] ?? value;
export interface Fragrance {
  id: string; name: string; priceCents: number; currency: 'USD'; imageSrc: string; imageAlt: string;
  keyNotes: { name: string; categories: Category[] }[];
  intensity: Intensity; feelingTags: Feeling[] | null; occasionTags: Occasion[] | null; productPath: string;
}
export interface Issue { row: number; identity: string | null; field: string; reason: string }
export interface Diagnostics { sourceRows: number; excludedRows: number; identicalDuplicateRows: number; unknownAttributeProducts: number; issues: Issue[] }
export interface Catalog { schemaVersion: 1; products: Fragrance[]; diagnostics: Diagnostics }
export interface Evidence { dimension: Exclude<Dimension,'budget'>; selected: string; status: 'matched'|'mismatched'|'unknown'; actual: string[]; sources: string[] }
export interface Recommendation { product: Fragrance; score: number; rank: number; evidence: Evidence[]; tied: boolean }
export type RecommendationResult = { status: 'success'|'empty'; recommendations: Recommendation[]; diagnostics: Diagnostics } | { status: 'invalid-preferences'; message: string };
export const emptyDiagnostics = (): Diagnostics => ({ sourceRows: 0, excludedRows: 0, identicalDuplicateRows: 0, unknownAttributeProducts: 0, issues: [] });
