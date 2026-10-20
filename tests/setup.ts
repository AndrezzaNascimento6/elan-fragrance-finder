import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
afterEach(cleanup);
Object.defineProperty(window, 'matchMedia', { writable: true, value: vi.fn(() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} })) });
// jsdom has no layout/viewport observer. Real intersection behavior is exercised in Playwright.
class TestIntersectionObserver {
 readonly root=null;
 readonly rootMargin='0px';
 readonly thresholds=[0];
 observe() {}
 unobserve() {}
 disconnect() {}
 takeRecords(): IntersectionObserverEntry[] {return [];}
}
Object.defineProperty(window,'IntersectionObserver',{writable:true,value:TestIntersectionObserver});

Object.defineProperty(window,'scrollTo',{writable:true,value:vi.fn()});
// Motion synthesizes pointer feedback for Enter/Space; jsdom lacks PointerEvent.
class TestPointerEvent extends MouseEvent {
 readonly pointerId:number;
 readonly pointerType:string;
 readonly isPrimary:boolean;
 constructor(type:string,init:PointerEventInit={}){
  super(type,init);this.pointerId=init.pointerId??1;this.pointerType=init.pointerType??'mouse';this.isPrimary=init.isPrimary??true;
 }
}
Object.defineProperty(window,'PointerEvent',{writable:true,value:TestPointerEvent});
