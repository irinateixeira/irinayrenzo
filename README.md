# Irina & Renzo

Abrí `index.html` en el navegador. No requiere instalación ni compilación.

- `index.html`: página principal.
- `css/styles.css`, `css/about.css`, `css/lucide.css` y `css/modals.css`: estilos de la página, equipo, íconos y modales.
- `js/main.js`: navegación, WhatsApp, selector del inicio y modales.
- `assets/pdfs/ceremonia-v68.pdf`: vista de Ceremonia extraída de la versión 68.
- `assets/pdfs/flytransfer-v68.pdf`: vista de Flytransfer extraída de la versión 68.
- `css/project-fonts.css` y `assets/fonts/`: tipografías locales y licencias.

Cada proyecto se abre directamente como PDF en su modal, tanto desde «Ver proyecto» como desde la imagen. Se eliminaron los HTML de proyectos y el botón para abrirlos aparte. La visualización usa PDF.js local para mostrar los mismos documentos y controlar el desplazamiento. Los archivos *-data.js contienen los mismos PDF para poder abrir index.html sin servidor.

WhatsApp: +598 93 601 542, con mensaje prefabricado. El botón flotante muestra el logo de WhatsApp. El header es sticky y translúcido, y el footer tiene un espaciado compacto.

Las vistas actuales provienen de las imágenes `case-exact` incrustadas en `irina_portfolio_v68_sin_service_symbols.html`. Se convirtieron a PDF sin cambiar ningún píxel; la procedencia se registra en `assets/pdfs/v68-source.json`.

El botón original al final de cada PDF vuelve al inicio con scroll suave dentro del modal. Se respeta la preferencia del sistema de reducir movimiento. PDF.js y su licencia se encuentran en assets/vendor/pdfjs/.

Precios: paneles alineados y desplegables en css/services.css. Mantienen las descripciones actuales y los alcances de la versión 68. El menú y los eyebrows comparten los mismos nombres. Toda la interfaz usa Funnel Sans local; los PDF conservan el diseño original.

La escala tipográfica se define en css/typography.css: tamaños enteros y pares, mínimo 12 px, con cambios fijos por breakpoint.
Los PDF permiten zoom de 100% a 600% mediante los controles del modal, el gesto de dos dedos y las teclas +, - y 0 con el documento enfocado. El zoom vuelve a 100% al abrir cada proyecto.
