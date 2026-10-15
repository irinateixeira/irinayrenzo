import fs from 'node:fs/promises';
import { chromium } from 'playwright';
const browser = await chromium.launch({ channel:'chrome', headless:true });
const page = await browser.newPage();
await page.goto('file:///C:/Users/Iri%20y%20Renzo/Desktop/IRI%20WEBS/WEBS%20VENTA/index.html');
const extracted = await page.evaluate(() => {
  const visible = [], technical = [], counters = {};
  const names = { inicio:'Inicio', trabajos:'Nuestros trabajos', precios:'Precios', nosotros:'Sobre nosotros', contacto:'Charlemos' };
  function section(el) {
    if (el.closest('header')) return 'Header';
    if (el.closest('footer')) return 'Footer';
    if (el.closest('dialog')) return 'Modal de proyectos';
    if (el.closest('.whatsapp-float')) return 'WhatsApp flotante';
    return names[el.closest('section')?.id] || 'General';
  }
  function path(el) {
    if (el.id) return '#'+el.id;
    const parent = el.parentElement;
    if (!parent) return el.localName;
    const siblings = [...parent.children].filter(x => x.localName === el.localName);
    return path(parent)+' > '+el.localName+':nth-of-type('+(siblings.indexOf(el)+1)+')';
  }
  function add(target, el, current, location, mapping) {
    const group = section(el);
    const prefix = (target === visible ? 'WEB' : 'ACC')+'-'+group.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'_').toUpperCase();
    counters[prefix] = (counters[prefix] || 0)+1;
    target.push({ id:prefix+'-'+String(counters[prefix]).padStart(3,'0'), section:group, location, current, mapping });
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode, el = node.parentElement;
    if (!el || el.closest('script, style, svg') || !node.textContent.trim()) continue;
    const current = node.textContent.replace(/\s+/g,' ').trim();
    if (/^[.&,/]+$/.test(current)) continue;
    const hidden = el.closest('.sr-only,[aria-hidden="true"]');
    const scope = el.closest('.service');
    const project = el.closest('.project');
    const element = el.closest('h1,h2,h3,h4,p,li,a,button,summary,figcaption,small') || el;
    const label = (scope ? scope.querySelector('h3').textContent+' / ' : project ? project.querySelector('h3').textContent+' / ' : '') +
      (el.classList.contains('eyebrow') ? 'Eyebrow' : element.localName === 'li' ? 'Punto de la lista' : /^h[1-4]$/.test(element.localName) ? 'Título '+element.localName : element.localName === 'a' || element.localName === 'button' ? 'Botón o enlace' : element.localName === 'p' ? 'Descripción' : el.className || element.localName);
    add(hidden ? technical : visible, el, current, label, { kind:'text', selector:path(el), childIndex:[...el.childNodes].indexOf(node) });
  }
  for (const el of document.querySelectorAll('[alt],[aria-label],[title]')) {
    for (const attr of ['alt','aria-label','title']) {
      const value = el.getAttribute(attr);
      if (value) add(technical, el, value, attr === 'alt' ? 'Descripción de imagen' : attr === 'aria-label' ? 'Etiqueta accesible' : 'Ayuda del elemento', { kind:'attribute', selector:path(el), attribute:attr });
    }
  }
  for (const [selector,attr,label] of [['head title',null,'Título del navegador'],['meta[name="description"]','content','Descripción para buscadores']]) {
    const el = document.querySelector(selector);
    technical.push({ id:attr ? 'SEO-DESCRIPTION' : 'SEO-TITLE', section:'SEO', location:label, current:attr ? el.getAttribute(attr) : el.textContent, mapping:{ kind:attr ? 'attribute' : 'textContent', selector, attribute:attr } });
  }
  return { visible, technical };
});
const links = await page.locator('[data-wa]').evaluateAll(els => els.map(el => el.href));
if (links.length !== 4 || links.some(link => !link.startsWith('https://wa.me/59893601542?'))) throw Error('WhatsApp incorrecto');
await browser.close();
const messages = [
  ['CONTACT-PHONE','WhatsApp','Número de destino','+59893601542','WHATSAPP_NUMBER'],
  ['CONTACT-MESSAGE','WhatsApp','Mensaje prefabricado','Hola, Irina y Renzo. Quiero conversar sobre una web.','message'],
  ['MENU-OPEN','Header','Etiqueta al abrir menú','Abrir menú','menu-open'],
  ['MENU-CLOSE','Header','Etiqueta al cerrar menú','Cerrar menú','menu-close'],
  ['MODAL-CEREMONIA','Modal de proyectos','Nombre del proyecto','Ceremonia','project-ceremonia'],
  ['MODAL-FLYTRANSFER','Modal de proyectos','Nombre del proyecto','Flytransfer','project-flytransfer'],
  ['MODAL-LOADING','Modal de proyectos','Aviso durante la carga','Cargando {proyecto}…','loading'],
  ['MODAL-ERROR','Modal de proyectos','Error de carga','No se pudo cargar el PDF. Cerrá el proyecto y volvé a abrirlo.','error'],
  ['PDF-REGION','Modal de proyectos','Etiqueta accesible del documento','PDF de {proyecto}','pdf-region'],
  ['PDF-PRESENTATION','Modal de proyectos','Descripción de la presentación','Presentación de {proyecto}','pdf-presentation'],
  ['PDF-TOP','Modal de proyectos','Etiqueta del botón de regreso','Volver al inicio del PDF','pdf-top-label'],
  ['PDF-TOP-TITLE','Modal de proyectos','Ayuda del botón de regreso','Volver al inicio','pdf-top-title']
].map(([id,section,location,current,key])=>({id,section,location,current,mapping:{kind:'javascript',file:'js/main.js',key}}));
const result = {...extracted, messages, source:'index.html y js/main.js', version:'copy-2026-10-14'};
await fs.writeFile(new URL('./copy-manifest.json', import.meta.url), JSON.stringify(result,null,2));
console.log(JSON.stringify({copy:extracted.visible.length, accessibility:extracted.technical.length,messages:messages.length,whatsappButtons:links.length}));
