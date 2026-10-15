const {chromium}=require('C:/Users/Iri y Renzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base='file:///C:/Users/Iri%20y%20Renzo/Desktop/IRI%20WEBS/WEBS%20VENTA/';
function assert(value,message){if(!value)throw Error(message)}
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:900},offline:true});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'index.html');await page.evaluate(()=>document.fonts.ready);
 assert(await page.locator('svg:not(.lucide)').count()===0,'Non-Lucide icons on main page');
 assert(await page.locator('.final-cta').count()===1,'Contact missing');
 assert(await page.locator('section.faq').count()===0,'FAQ unexpectedly restored');
 assert((await page.locator('.whatsapp-float').getAttribute('href')).includes('59896438698'),'WhatsApp destination');
 for(const slug of ['ceremonia','flytransfer']){
  await page.locator(`[data-project="${slug}"]`).click();
  await page.locator('.project-loading').waitFor({state:'detached'});
  const frame=page.frames().find(f=>f.url().includes('/projects/'+slug+'.html'));
  await frame.evaluate(()=>document.querySelectorAll('img').forEach(i=>i.loading='eager'));
  await frame.waitForFunction(()=>[...document.images].every(i=>i.complete));
  assert(await frame.evaluate(()=>[...document.images].every(i=>i.naturalWidth>0)),'Missing image '+slug);
  assert(await frame.evaluate(()=>document.fonts.check('16px "Playfair Display"')&&document.fonts.check('16px "DM Sans"')),'Local fonts '+slug);
  assert(await frame.locator('svg:not(.lucide)').count()===0,'Non-Lucide project icons');
  await page.evaluate(()=>window.postMessage({type:'close-project'},'*'));
  assert(await page.locator('#project-modal').evaluate(e=>e.open),'Untrusted close message');
  for(let i=0;i<8;i++){await page.keyboard.press('Tab');assert(await page.locator('#project-modal').evaluate(e=>e.contains(document.activeElement)),'Focus escaped dialog');}
  if(slug==='ceremonia'){
   const detail=frame.locator('.faq-frame details').nth(1);await detail.locator('summary').click();assert(await detail.evaluate(e=>e.open),'FAQ toggle');
  }else{
   await frame.locator('.vehicle .fly-button').first().click();assert((await frame.locator('#case-status').innerText()).includes('Economic Sedan'),'Vehicle demo');
   const form=frame.locator('.fly-desktop-frame .booking');await form.locator('[name=to]').fill('Hotel Cancun');await form.locator('[name=date]').fill('2026-12-01T10:00');await form.locator('button').click();assert((await frame.locator('#case-status').innerText()).includes('vehículos'),'Booking demo');
  }
  await frame.locator('h1').click();await page.keyboard.press('Escape');await page.locator('#project-modal').waitFor({state:'hidden'});
  assert(await page.locator(`[data-project="${slug}"]`).evaluate(e=>e===document.activeElement),'Restored focus');
 }
 await page.locator('[data-project="ceremonia"]').click();await page.locator('.project-loading').waitFor({state:'detached'});await page.mouse.click(4,4);assert(!await page.locator('#project-modal').evaluate(e=>e.open),'Backdrop close');
 await page.setViewportSize({width:320,height:740});await page.evaluate(()=>scrollTo(0,0));await page.locator('.menu-toggle').click();assert(await page.locator('.menu-toggle').getAttribute('aria-expanded')==='true','Mobile menu');assert(await page.locator('.close-icon').isVisible(),'Menu X icon');await page.locator('.nav a[href="#trabajos"]').click();
 await page.locator('[data-project="flytransfer"]').click();await page.locator('.project-loading').waitFor({state:'detached'});assert(await page.locator('#project-modal').evaluate(e=>e.getBoundingClientRect().width===innerWidth),'Full-screen mobile modal');await page.locator('.modal-close').click();
 for(const slug of ['ceremonia','flytransfer']){
  await page.goto(base+'projects/'+slug+'.html');await page.evaluate(()=>document.querySelectorAll('img').forEach(i=>i.loading='eager'));await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
  for(const width of [320,768,1200]){
   await page.setViewportSize({width,height:900});await page.waitForTimeout(100);assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Overflow '+slug+' '+width);
   if(width!==768)await page.screenshot({path:`output/playwright/${slug}-final-${width}.png`,fullPage:true});
  }
 }
 assert(errors.length===0,errors.join('\n'));await browser.close();console.log('PASS: offline assets/fonts, Lucide icons, both modals, loading states, native focus trap, Escape, backdrop, mobile menu, FAQ, demo form, vehicle selection, 320/768/1200px layouts.');
})().catch(e=>{console.error(e);process.exit(1)});
