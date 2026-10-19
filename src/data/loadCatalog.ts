import catalogUrl from './catalog.json?url';
import { normalizeCatalog } from '../domain/catalog';
import type { Catalog } from '../domain/types';
export class CatalogLoadError extends Error {
 constructor(public code: 'timeout'|'unavailable', message: string) { super(message);this.name='CatalogLoadError'; }
}
export async function loadCatalog(): Promise<Catalog> {
 const controller=new AbortController();let timer: ReturnType<typeof setTimeout> | undefined;
 const timeout=new Promise<never>((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new CatalogLoadError('timeout','The catalog took too long to load. Please retry.'));},5000);});
 try {
  return await Promise.race([timeout,(async()=>{
   const response=await fetch(catalogUrl,{signal:controller.signal});
   if (!response.ok) throw Error('Catalog request failed');
   return normalizeCatalog(await response.json());
  })()]);
 } catch(e) {
  if (e instanceof CatalogLoadError) throw e;
  throw new CatalogLoadError('unavailable','The fragrance catalog is unavailable. Please retry or change a preference.');
 } finally {clearTimeout(timer);}
}
