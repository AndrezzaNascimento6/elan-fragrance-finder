import { test,expect } from '@playwright/test';
import { accessible,activeLegend,activeStage,answerQuestion,choice,isDirect } from './helpers';
const answers=['Fresh','Everyday','Citrus','Light','Under $50'];
async function finish(page:import('@playwright/test').Page){
 await page.getByRole('button',{name:'Start discovering'}).click();
 for(const [i,value] of answers.entries())await answerQuestion(page,value,i);
}
test('Home is a keyboard-operable link from questions, results, pending and error',async({page})=>{
 test.setTimeout(90000);
 await page.goto('/');await page.getByRole('button',{name:'Start discovering'}).click();await page.getByRole('link',{name:'Élan — Home'}).focus();await page.keyboard.press('Enter');
 await expect(page.getByRole('heading',{name:'Find the fragrance that feels like you'})).toBeFocused();
 await finish(page);await expect(page.getByRole('heading',{name:'Your fragrance edit'})).toBeVisible();await page.getByRole('link',{name:'Élan — Home'}).click();
 await expect(page.getByRole('heading',{name:'Find the fragrance that feels like you'})).toBeFocused();
 let release!:()=>void;const gate=new Promise<void>(resolve=>{release=resolve;});await page.route(/\/assets\/catalog-.*\.json$/,async route=>{await gate;await route.continue();});
 await finish(page);await expect(page.getByRole('heading',{name:'Finding your edit'})).toBeVisible();await page.getByRole('link',{name:'Élan — Home'}).click();
 const loaded=page.waitForResponse(/\/assets\/catalog-.*\.json$/);release();await loaded;await page.evaluate(()=>new Promise(requestAnimationFrame));
 await expect(page.getByRole('heading',{name:'Find the fragrance that feels like you'})).toBeVisible();await expect(page.getByRole('article')).toHaveCount(0);
 await page.unroute(/\/assets\/catalog-.*\.json$/);await page.route(/\/assets\/catalog-.*\.json$/,route=>route.fulfill({status:503,body:'unavailable'}));
 await finish(page);await expect(page.getByRole('heading',{name:'A moment to reconnect'})).toBeVisible();await page.getByRole('link',{name:'Élan — Home'}).click();await expect(page.getByRole('heading',{name:'Find the fragrance that feels like you'})).toBeFocused();await accessible(page);
});
test('mobile choices do not advance on focus and outgoing controls become inert immediately',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Start discovering'}).click();
 if(await isDirect(page)){
  const fresh=choice(page,'Fresh');await fresh.focus();await page.keyboard.press('ArrowRight');await expect(page.getByText('Question 1 of 5')).toBeVisible();
  await expect(fresh).toHaveAttribute('aria-describedby',/.+-action/);
  await fresh.press('Enter');await expect(activeLegend(page)).toHaveText('What’s the occasion?');await expect(activeLegend(page)).toBeFocused();await expect(page.getByRole('button',{name:'Continue',exact:true})).toHaveCount(0);
 }else{await answerQuestion(page,'Fresh',0);await expect(activeLegend(page)).toBeFocused();}
 const exits=page.locator('[data-present="false"]');
 for(const exit of await exits.all()){await expect(exit).toHaveAttribute('inert','');await expect(exit).toHaveAttribute('aria-hidden','true');}
 await page.emulateMedia({reducedMotion:'reduce'});await answerQuestion(page,'Work',1);
 await expect.poll(()=>activeStage(page).evaluate(el=>getComputedStyle(el).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
 await expect.poll(()=>page.locator('.hero-drift').evaluate(el=>getComputedStyle(el).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
 await accessible(page);
});
