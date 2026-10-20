import { useState } from 'react';
import type { Fragrance } from '../domain/types';
export function ProductImage({product,priority=false}:{product:Fragrance;priority?:boolean}) {
 const [failed,setFailed]=useState(false);
 const photographic=product.imageSrc.endsWith('.webp');
 return <div className="product-image">{failed?<div className="image-fallback" role="img" aria-label={`${product.name}: image unavailable`}>Image unavailable<br/><span>{product.name}</span></div>:<img src={product.imageSrc} srcSet={photographic?`${product.imageSrc.replace('.webp','-640.webp')} 640w, ${product.imageSrc} 1024w`:undefined} sizes="(max-width: 700px) 100vw, 50vw" alt={product.imageAlt} width="1024" height="1536" loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'} decoding="async" onLoad={e=>{e.currentTarget.decode().catch(()=>setFailed(true));}} onError={()=>setFailed(true)}/>}</div>;
}
