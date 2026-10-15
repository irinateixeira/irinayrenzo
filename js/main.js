'use strict';

const WHATSAPP_NUMBER = '59893601542';
const message = 'Hola, Irina y Renzo. Quiero conversar sobre una web.';
document.querySelectorAll('[data-wa]').forEach(link => {
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
});

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
function setMenu(open) {
  navigation.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}
menuButton.addEventListener('click', () => setMenu(!navigation.classList.contains('open')));
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

const header = document.querySelector('.header');
const hero = document.querySelector('.hero');
function syncHeader() {
  header.classList.toggle('is-scrolled', scrollY > 8);
}
function syncGrid() {
  document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
}
syncHeader();
syncGrid();
window.addEventListener('scroll', syncHeader, { passive:true });
window.addEventListener('resize', syncGrid, { passive:true });
const gridMotion = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
let gridFrame = 0;
let pointerX = 0;
let pointerY = 0;
hero.addEventListener('pointermove', event => {
  if (!gridMotion.matches) return;
  const rect = hero.getBoundingClientRect();
  pointerX = event.clientX - rect.left;
  pointerY = event.clientY - rect.top;
  if (gridFrame) return;
  gridFrame = requestAnimationFrame(() => {
    hero.style.setProperty('--pointer-x', `${pointerX}px`);
    hero.style.setProperty('--pointer-y', `${pointerY}px`);
    hero.classList.add('grid-active');
    gridFrame = 0;
  });
}, { passive:true });
hero.addEventListener('pointerleave', () => {
  cancelAnimationFrame(gridFrame);
  gridFrame = 0;
  hero.classList.remove('grid-active');
});
gridMotion.addEventListener('change', () => hero.classList.remove('grid-active'));

const progress = document.querySelector('#progress');
let ticking = false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
}, { passive:true });
window.addEventListener('resize', updateProgress);
updateProgress();
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold:.09 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));

const projectModal = document.querySelector('#project-modal');
const modalTitle = document.querySelector('#project-modal-title');
const modalContent = document.querySelector('#project-modal-content');
const projects = { ceremonia:'Ceremonia', flytransfer:'Flytransfer' };
let projectTrigger = null;
let viewerGeneration = 0;
let disposePdfZoom;
const zoomToolbar = projectModal.querySelector(".pdf-zoom");
const scriptLoads = new Map();
function loadLocalScript(src) {
  if (!scriptLoads.has(src)) scriptLoads.set(src, new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => { script.remove(); scriptLoads.delete(src); reject(new Error('No se pudo cargar el visor')); };
    document.head.append(script);
  }));
  return scriptLoads.get(src);
}

async function openProject(button) {
  const slug = button.dataset.project;
  if (!projects[slug]) return;
  const generation = ++viewerGeneration;
  disposePdfZoom?.();
  zoomToolbar.querySelectorAll("button").forEach(button => { button.disabled = true; });
  zoomToolbar.querySelector("[data-zoom=reset]").textContent = "100%";
  projectTrigger = button;
  setMenu(false);
  projectModal.dataset.theme = slug;
  modalTitle.textContent = projects[slug];
  const loading = document.createElement('div');
  loading.className = 'project-loading';
  loading.setAttribute('role', 'status');
  loading.textContent = `Cargando ${projects[slug]}…`;
  modalContent.setAttribute('aria-busy', 'true');
  modalContent.replaceChildren(loading);
  projectModal.showModal();
  document.body.classList.add('modal-open');
  let pdf;
  try {
    await Promise.all([
      loadLocalScript('assets/vendor/pdfjs/pdf.js'),
      loadLocalScript('assets/vendor/pdfjs/pdf.worker.js'),
      loadLocalScript(`assets/pdfs/${slug}-v68-data.js`)
    ]);
    if (generation !== viewerGeneration) return;
    const data = Uint8Array.from(atob(window.projectPdfData[slug]), char => char.charCodeAt(0));
    pdf = await pdfjsLib.getDocument({ data, isEvalSupported:false }).promise;
    const page = await pdf.getPage(1);
    if (generation !== viewerGeneration) return;
    const viewport = page.getViewport({ scale:1 });
    const scroller = document.createElement('div');
    scroller.className = 'pdf-scroll';
    scroller.tabIndex = 0;
    scroller.setAttribute('role', 'region');
    scroller.setAttribute('aria-label', `PDF de ${projects[slug]}`);
    const sheet = document.createElement('div');
    sheet.className = 'pdf-sheet';
    const canvas = document.createElement('canvas');
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `Presentación de ${projects[slug]}`);
    // Render once at the original PDF resolution; CSS preserves its ratio on resize.
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    await page.render({ canvasContext:canvas.getContext('2d'), viewport }).promise;
    if (generation !== viewerGeneration) return;
    const topButton = document.createElement('button');
    topButton.type = 'button';
    topButton.className = 'pdf-back-top';
    topButton.setAttribute('aria-label', 'Volver al inicio del proyecto');
    topButton.title = 'Volver al inicio';
    const centerY = slug === 'ceremonia' ? 6514 : 6706;
    topButton.style.left = `${1137 / viewport.width * 100}%`;
    topButton.style.top = `${centerY / viewport.height * 100}%`;
    topButton.style.width = `${115 / viewport.width * 100}%`;
    topButton.style.aspectRatio = '1';
    topButton.addEventListener('click', () => {
      scroller.scrollTo({ top:0, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      scroller.focus({ preventScroll:true });
    });
    sheet.append(canvas, topButton);
    scroller.append(sheet);
    modalContent.replaceChildren(scroller);
    disposePdfZoom = setupPdfZoom(scroller, sheet, zoomToolbar);
    modalContent.removeAttribute('aria-busy');
  } catch (error) {
    if (generation !== viewerGeneration) return;
    loading.classList.add('error');
    loading.textContent = 'No se pudo cargar el proyecto. Cerralo y volvé a abrirlo.';
    modalContent.removeAttribute('aria-busy');
    console.error(error);
  } finally {
    if (pdf) await pdf.destroy();
  }
}

document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => openProject(button));
});
projectModal.querySelector('.modal-close').addEventListener('click', () => projectModal.close());
let pointerStartedOutside = false;
function outside(event) {
  const box = projectModal.getBoundingClientRect();
  return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
}
projectModal.addEventListener('pointerdown', event => { pointerStartedOutside = outside(event); });
projectModal.addEventListener('click', event => {
  if (event.target === projectModal && pointerStartedOutside && outside(event)) projectModal.close();
  pointerStartedOutside = false;
});
projectModal.addEventListener('close', () => {
  viewerGeneration++;
  disposePdfZoom?.();
  disposePdfZoom = null;
  document.body.classList.remove('modal-open');
  modalContent.replaceChildren();
  modalContent.removeAttribute('aria-busy');
  projectTrigger?.focus({ preventScroll:true });
});
