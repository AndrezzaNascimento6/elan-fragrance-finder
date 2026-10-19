import { emptyDiagnostics, type Fragrance } from '../../src/domain/types';
export const product = (overrides: Record<string,unknown> = {}): Fragrance => ({ id:'a',name:'Morning Glass',priceCents:4900,currency:'USD',imageSrc:'/images/fragrances/a.svg',imageAlt:'Fictional Morning Glass bottle',keyNotes:[{name:'Bergamot',categories:['citrus']}],intensity:'light',feelingTags:['fresh'],occasionTags:['everyday'],productPath:'#/products/a',...overrides } as Fragrance);
export const document = (products: unknown[]) => ({ schemaVersion:1,products,diagnostics:{...emptyDiagnostics(),sourceRows:products.length} });
export const preferences = { feeling:'fresh',occasion:'everyday',category:'citrus',intensity:'light',budget:'under-50' } as const;
