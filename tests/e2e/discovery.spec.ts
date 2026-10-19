import { test,expect } from '@playwright/test';
import { accessible } from './helpers';
test('complete five questions with required validation and Back preservation',async({page})=>{
 await page.goto('/');await accessible(page);
 await page.getByRole('button',{name:'Start discovering'}).click();
 await page.getByRole('button',{name:'Continue'}).click();await expect(page.getByRole('alert')).toContainText('Choose');
 for(const [i,answer] of ['Fresh','Everyday','Citrus','Light','Under $50'].entries()) {
  await expect(page.getByText(`Question ${i+1} of 5`)).toBeVisible();
  await page.getByRole('radio',{name:answer,exact:true}).check();
  if(i===1){await page.getByRole('button',{name:'Back'}).click();await expect(page.getByRole('radio',{name:'Fresh',exact:true})).toBeChecked();await page.getByRole('button',{name:'Continue'}).click();await expect(page.getByRole('radio',{name:'Everyday',exact:true})).toBeChecked();}
  await accessible(page);await page.getByRole('button',{name:i===4?'Find my fragrances':'Continue'}).click();
 }
 await expect(page.getByRole('heading',{name:'Your fragrance edit'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Aube',exact:true})).toBeVisible();
 await expect(page.getByText('Matches 4 of 4 preferences — exact match')).toBeVisible();
 await expect(page.getByRole('article')).toHaveCount(3);
 for(const article of await page.getByRole('article').all()) {
  await expect(article.locator('.evidence li')).toHaveCount(4);
  await expect(article.locator('.product-meta')).toContainText('USD');
  await expect(article.locator('.budget-note')).toContainText('Under $50');
  await expect(article.getByRole('link',{name:/Explore/})).toHaveAttribute('href',/^#\/products\/[a-z-]+$/);
 }
 await accessible(page);
 await page.screenshot({path:`specs/001-fragrance-discovery/validation/results-${test.info().project.name}.png`,fullPage:true});
});
test('keyboard and reduced-motion discovery remains operable',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.getByRole('button',{name:'Start discovering'}).focus();await page.keyboard.press('Enter');
 for(const [i,answer] of ['Fresh','Everyday','Citrus','Light','Under $50'].entries()){
  await page.getByRole('radio',{name:answer,exact:true}).focus();await page.keyboard.press('Space');await page.getByRole('button',{name:i===4?'Find my fragrances':'Continue'}).focus();await page.keyboard.press('Enter');
 }
 await expect(page.getByRole('heading',{name:'Your fragrance edit'})).toBeFocused();await accessible(page);
});
