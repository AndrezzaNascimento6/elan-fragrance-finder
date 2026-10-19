import { it, expect, vi, afterEach } from 'vitest';
import { loadCatalog } from '../../src/data/loadCatalog';
import { document, product } from './fixtures';
afterEach(()=>{vi.unstubAllGlobals();vi.useRealTimers();});
it('loads the versioned local document',async()=>{
 const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>document([product()])});vi.stubGlobal('fetch',fetcher);
 expect((await loadCatalog()).products).toHaveLength(1); expect(fetcher.mock.calls[0][0]).toMatch(/catalog/);
});
it('rejects fetch and malformed JSON then permits retry',async()=>{
 const fetcher=vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ok:true,json:async()=>{throw Error('json');}}).mockResolvedValue({ok:true,json:async()=>document([])});vi.stubGlobal('fetch',fetcher);
 await expect(loadCatalog()).rejects.toMatchObject({name:'CatalogLoadError'});await expect(loadCatalog()).rejects.toThrow();expect((await loadCatalog()).products).toEqual([]);
});
it('bounds even a non-cooperating stalled fetch or body at 5 seconds',async()=>{
 vi.useFakeTimers();vi.stubGlobal('fetch',vi.fn(()=>new Promise(()=>{})));
 const result=loadCatalog().catch(e=>e); await vi.advanceTimersByTimeAsync(5000);expect(await result).toMatchObject({name:'CatalogLoadError',code:'timeout'});
 vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,json:()=>new Promise(()=>{})})));
 const body=loadCatalog().catch(e=>e);await vi.advanceTimersByTimeAsync(5000);expect(await body).toMatchObject({code:'timeout'});
});
