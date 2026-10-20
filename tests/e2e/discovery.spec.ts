import { test,expect } from '@playwright/test';
import { accessible,activeStage,answerQuestion,isDirect,selected,choice } from './helpers';
test('complete five questions with required validation and Back preservation',async({page})=>{
 await page.goto('/');await accessible(page);
 await page.getByRole('button',{name:'Start discovering'}).click();
 if(await isDirect(page)){
  await expect(page.getByRole('button',{name:'Continue',exact:true})).toHaveCount(0);
  await expect(activeStage(page).getByRole('button')).toHaveCount(4);
  await expect(activeStage(page)).toContainText('Choose an option to continue');
 }else{await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByRole('alert')).toContainText('Choose');}
 for(const [i,answer] of ['Fresh','Everyday','Citrus','Light','Under $50'].entries()){
  await expect(page.getByText(`Question ${i+1} of 5`)).toBeVisible();await accessible(page);
  await answerQuestion(page,answer,i);
  if(i===1){
   await page.getByRole('button',{name:'Back',exact:true}).click();await selected(page,'Everyday');
   await page.getByRole('button',{name:'Back',exact:true}).click();await selected(page,'Fresh');
   await answerQuestion(page,'Fresh',0);await selected(page,'Everyday');await answerQuestion(page,'Everyday',1);
  }
 }
 await expect(page.getByRole('heading',{name:'Your fragrance edit'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Aube',exact:true})).toBeVisible();
 await expect(page.getByText('Matches 4 of 4 preferences — exact match')).toBeVisible();
 await expect(page.getByRole('article')).toHaveCount(3);
 for(const article of await page.getByRole('article').all()){
  await expect(article.locator('.evidence li')).toHaveCount(4);await expect(article.locator('.product-meta')).toContainText('USD');await expect(article.locator('.budget-note')).toContainText('Under $50');await expect(article.getByRole('link',{name:/Explore/})).toHaveAttribute('href',/^#\/products\/[a-z-]+$/);
 }
 await accessible(page);
 await page.screenshot({path:`specs/001-fragrance-discovery/validation/motion-refinement/results-${test.info().project.name}.png`,fullPage:true});
});
test('keyboard and reduced-motion discovery remains operable',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.getByRole('button',{name:'Start discovering'}).focus();await page.keyboard.press('Enter');
 for(const [i,answer] of ['Fresh','Everyday','Citrus','Light','Under $50'].entries()){
  if(await isDirect(page)){await choice(page,answer).focus();await page.keyboard.press(i%2?'Enter':'Space');}
  else{await activeStage(page).getByRole('radio',{name:answer,exact:true}).focus();await page.keyboard.press('Space');await page.getByRole('button',{name:i===4?'Find my fragrances':'Continue',exact:true}).focus();await page.keyboard.press('Enter');}
 }
 await expect(page.getByRole('heading',{name:'Your fragrance edit'})).toBeFocused();await accessible(page);
});
