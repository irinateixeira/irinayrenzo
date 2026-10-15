const { chromium }=require('C:/Users/Iri y Renzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base='file:///C:/Users/Iri%20y%20Renzo/Desktop/IRI%20WEBS/WEBS%20VENTA/';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1200,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const slug of ['ceremonia','flytransfer']){
  await page.goto(base+'projects/'+slug+'.html');await page.evaluate(()=>document.querySelectorAll('img').forEach(i=>i.loading='eager'));await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>[...document.images].every(i=>i.complete));await page.waitForTimeout(500);
  console.log(slug,await page.evaluate(()=>({width:innerWidth,height:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth,fonts:document.fonts.check('16px "Instrument Serif"'),frames:[...document.querySelectorAll('.scale-frame')].map(e=>({width:e.clientWidth,height:e.clientHeight}))})));
  await page.screenshot({path:'output/playwright/'+slug+'-v2-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(250);await page.screenshot({path:'output/playwright/'+slug+'-v2-mobile.png',fullPage:true});
  console.log('mobile',slug,await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,height:document.documentElement.scrollHeight})));
  await page.setViewportSize({width:1200,height:900});
 }
 await page.goto(base+'index.html');for(const slug of ['ceremonia','flytransfer']){await page.locator('[data-project="'+slug+'"]').click();await page.frameLocator('.project-frame').locator('h1').waitFor();await page.screenshot({path:'output/playwright/'+slug+'-v2-modal.png'});await page.frameLocator('.project-frame').locator('h1').click();await page.keyboard.press('Escape');await page.locator('#project-modal').waitFor({state:'hidden'});}
 console.log('ERRORS',errors);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
