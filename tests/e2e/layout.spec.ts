import { test,expect } from '@playwright/test';
import { accessible,activeLegend,answerQuestion } from './helpers';
test('responsive composition, focus and reactive reduced motion',async({page})=>{
 for(const viewport of [{width:390,height:844},{width:320,height:568},{width:844,height:390},{width:1440,height:900}]){
  await page.setViewportSize(viewport);await page.goto('/');await expect(page.getByRole('button',{name:'Start discovering'})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Start discovering'}).click();await expect(activeLegend(page)).toBeFocused();
  await page.emulateMedia({reducedMotion:'reduce'});await answerQuestion(page,'Fresh',0);await expect(activeLegend(page)).toHaveText('What’s the occasion?');await expect(activeLegend(page)).toBeFocused();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await accessible(page);await page.emulateMedia({reducedMotion:'no-preference'});
 }
});
