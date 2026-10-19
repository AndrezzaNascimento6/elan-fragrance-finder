import { test,expect } from '@playwright/test';
import { accessible } from './helpers';
test('responsive composition, focus and reactive reduced motion',async({page})=>{
 const views=[{width:390,height:844},{width:320,height:568},{width:844,height:390},{width:1440,height:900}];
 for(const viewport of views){
  await page.setViewportSize(viewport);await page.goto('/');
  await expect(page.getByRole('button',{name:'Start discovering'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(test.info().project.name==='desktop'&&(viewport.width===390||viewport.width===1440))await page.screenshot({path:`specs/001-fragrance-discovery/validation/intro-${viewport.width}.png`,fullPage:true});
  await page.getByRole('button',{name:'Start discovering'}).click();await expect(page.getByText('How do you want to feel?')).toBeFocused();
  await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('radio',{name:'Fresh',exact:true}).check();await page.getByRole('button',{name:'Continue'}).click();
  await expect(page.getByText('What’s the occasion?')).toBeFocused();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await accessible(page);await page.emulateMedia({reducedMotion:'no-preference'});
 }
});
