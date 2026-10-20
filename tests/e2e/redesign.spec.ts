import { test,expect } from '@playwright/test';
import { accessible,activeLegend,activeStage,answerQuestion,isDirect,selected } from './helpers';
const folder='specs/001-fragrance-discovery/validation/motion-refinement';
test('photographic options, SVG controls and reactive motion preserve the journey',async({page})=>{
 await page.goto('/');await expect(page.locator('.hero-art img')).toHaveAttribute('src',/hero\.webp$/);await expect(page.getByRole('button',{name:'Start discovering'}).locator('svg')).toHaveCount(1);
 await page.getByRole('button',{name:'Start discovering'}).click();
 if(await isDirect(page)){
  await answerQuestion(page,'Fresh',0);await page.getByRole('button',{name:'Back',exact:true}).click();await selected(page,'Fresh');
  await expect(activeStage(page).locator('.option.selected svg path')).toHaveAttribute('d','m5 12 4 4L19 6');
 }else{await activeStage(page).getByRole('radio',{name:'Fresh',exact:true}).check();await expect(activeStage(page).locator('.option.selected')).toContainText('Selected');}
 await page.emulateMedia({reducedMotion:'reduce'});await answerQuestion(page,'Fresh',0);await expect(activeLegend(page)).toHaveText('What’s the occasion?');await expect(activeLegend(page)).toBeFocused();
 await expect.poll(()=>activeStage(page).evaluate(el=>getComputedStyle(el).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
 await answerQuestion(page,'Work',1);await page.getByRole('button',{name:'Back',exact:true}).click();await selected(page,'Work');await expect(activeStage(page).locator('.option.selected .mood-image')).toHaveCSS('transform','none');await accessible(page);
 await page.screenshot({path:`${folder}/question-${test.info().project.name}.png`,fullPage:true});
});
test('capture the rendered refinement for approval',async({page})=>{
 const mobile=test.info().project.name==='mobile',name=mobile?'mobile':'desktop';await page.setViewportSize(mobile?{width:390,height:844}:{width:1440,height:1086});
 await page.goto('/');await page.evaluate(()=>document.fonts.ready);await page.locator('.hero-art img').evaluate((img:HTMLImageElement)=>img.decode());await expect(page.locator('.hero-script')).toHaveCSS('opacity','1');
 await expect.poll(()=>page.locator('.hero-art').evaluate(el=>getComputedStyle(el).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
 await page.screenshot({path:`${folder}/${name}-intro.png`,scale:'css'});await page.screenshot({path:`${folder}/${name}-intro-full.png`,scale:'css',fullPage:true});
 await page.getByRole('button',{name:'Start discovering'}).click();await expect(activeLegend(page)).toBeFocused();
 await expect.poll(()=>activeStage(page).evaluate(el=>getComputedStyle(el).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
 await page.screenshot({path:`${folder}/${name}-question.png`,scale:'css',fullPage:true});
 for(const [i,answer] of ['Fresh','Everyday','Citrus','Light','Under $50'].entries())await answerQuestion(page,answer,i);
 await expect(page.getByRole('heading',{name:'Aube',exact:true})).toBeVisible();await page.locator('.result-art').first().scrollIntoViewIfNeeded();await page.locator('.product-image img').first().evaluate((img:HTMLImageElement)=>img.decode());
 await expect.poll(()=>page.locator('.result-photo').first().evaluate(el=>getComputedStyle(el).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
 await page.getByRole('article').first().evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 await expect.poll(()=>page.locator('.result-photo').first().evaluate(el=>getComputedStyle(el).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
 await expect.poll(()=>page.locator('.match-marks').first().locator('i').evaluateAll(elements=>elements.every(el=>['none','matrix(1, 0, 0, 1, 0, 0)'].includes(getComputedStyle(el).transform)))).toBe(true);
 await page.screenshot({path:`${folder}/${name}-recommendation.png`,scale:'css'});
 await expect(page.locator('.detail-link').first().locator('svg')).toHaveCount(1);await expect(page.locator('.alternatives a').first().locator('svg')).toHaveCount(1);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('processing motion exists only during real work and stops for reduced motion',async({page})=>{
 let release!:()=>void;const waiting=new Promise<void>(resolve=>{release=resolve;});await page.route(/\/assets\/catalog-.*\.json$/,async route=>{await waiting;await route.continue();});
 try{
  await page.goto('/');await page.getByRole('button',{name:'Start discovering'}).click();for(const [i,answer] of ['Fresh','Everyday','Citrus','Light','Under $50'].entries())await answerQuestion(page,answer,i);
  await expect(page.getByRole('heading',{name:'Finding your edit'})).toBeVisible();await expect(page.locator('.scent-orbit')).toBeVisible();await expect(page.getByRole('article')).toHaveCount(0);
  await page.screenshot({path:`${folder}/processing-${test.info().project.name}.png`,scale:'css',fullPage:true});await page.emulateMedia({reducedMotion:'reduce'});
  await expect.poll(()=>page.evaluate(()=>document.getAnimations().filter(a=>a.effect?.getTiming().iterations===Infinity&&a.playState==='running').length)).toBe(0);
 }finally{release();}
 await expect(page.getByRole('heading',{name:'Your fragrance edit'})).toBeVisible();await expect(page.locator('.scent-orbit')).toHaveCount(0);
});
