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
