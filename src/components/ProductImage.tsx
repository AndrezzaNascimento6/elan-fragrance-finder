import { useState } from 'react';
import type { Fragrance } from '../domain/types';
export function ProductImage({product,priority=false}:{product:Fragrance;priority?:boolean}) {
 const [failed,setFailed]=useState(false);
 return <div className="product-image">{failed?<div className="image-fallback" role="img" aria-label={`${product.name}: image unavailable`}>Image unavailable<br/><span>{product.name}</span></div>:<img src={product.imageSrc} alt={product.imageAlt} width="900" height="1125" loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'} decoding="async" onLoad={e=>{e.currentTarget.decode().catch(()=>setFailed(true));}} onError={()=>setFailed(true)}/>}</div>;
}
