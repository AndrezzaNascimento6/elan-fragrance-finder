import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';
export async function accessible(page: Page) { expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]); }
