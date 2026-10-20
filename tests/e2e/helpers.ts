import AxeBuilder from '@axe-core/playwright';
import { expect,type Page } from '@playwright/test';
export async function accessible(page:Page){expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);}
export const activeStage=(page:Page)=>page.locator('.view-stage[data-present="true"] .question-stage[data-present="true"]');
export const activeLegend=(page:Page)=>activeStage(page).locator('legend');
export async function isDirect(page:Page){return await page.locator('.view-stage[data-present="true"] .discovery').getAttribute('data-direct')==='true';}
export function choice(page:Page,value:string){
 const escaped=value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 return activeStage(page).getByRole('button',{name:new RegExp(`Choose ${escaped} and`)});
}
export async function answerQuestion(page:Page,value:string,index:number){
 if(await isDirect(page))await choice(page,value).click();
 else{await activeStage(page).getByRole('radio',{name:value,exact:true}).check();await page.getByRole('button',{name:index===4?'Find my fragrances':'Continue',exact:true}).click();}
}
export async function selected(page:Page,value:string){
 if(await isDirect(page))await expect(choice(page,value)).toHaveAccessibleName(new RegExp('^Selected\\.'));
 else await expect(activeStage(page).getByRole('radio',{name:value,exact:true})).toBeChecked();
}
