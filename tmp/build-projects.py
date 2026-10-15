from pathlib import Path
import json
from html import escape
icons=json.loads(Path('assets/icons/lucide.json').read_text(encoding='utf-8'))
def icon(name): return icons[name]
def frame(content,width=1440,classes='',canvas='',preview=False):
 return f'<div class="scale-frame {classes}" data-width="{width}"'+(' inert aria-hidden="true"' if preview else '')+f'><div class="design-canvas {canvas}">{content}</div></div>'
def photo(project,name,alt,classes=''):
 return f'<img class="{classes}" src="../assets/projects/{project}/{name}.jpg" alt="{alt}" loading="lazy">'
def doc(slug,title,body):
 html=f'''<!doctype html>
<html lang="es"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — Irina &amp; Renzo</title>
<link rel="stylesheet" href="../css/projects.css"><link rel="stylesheet" href="../css/{slug}.css">
<script src="../js/project-interactions.js" defer></script>
</head><body class="{slug}" id="top"><main class="case-page">
{body}
<footer class="case-end"><a class="back-top" href="#top" aria-label="Volver al inicio">{icon('ArrowUp')}</a></footer>
</main><div class="case-status" id="case-status" role="status" aria-live="polite"></div></body></html>'''
 Path('projects',slug+'.html').write_text(html,encoding='utf-8')
def opening(title,tag,desc,board,anchor):
 return f'<header class="case-opening"><div class="case-intro"><span class="case-tag">{tag}</span><h1>{title}</h1><p>{desc}</p></div><div class="identity-board">{board}</div><a class="case-scroll" href="#{anchor}">{icon("ChevronDown")}<span>Scroll</span></a></header>'
# CEREMONIA
salon_demo='Esta es una muestra del diseño de Ceremonia. No se realizan reservas desde el portafolio.'
def salon_button(text='Agendar una cita',rose=False):
 return f'<button class="salon-button{" rose" if rose else ""}" type="button" data-demo="{salon_demo}">{text}</button>'
def salon_nav():
 return '<header class="salon-nav"><a class="salon-logo" href="#salon">ceremonia</a><nav aria-label="Secciones de Ceremonia">'+''.join(f'<a href="#{target}">{text}</a>' for text,target in [('Uñas','unas'),('Faciales','experiencia'),('Depilación','experiencia'),('Masajes','experiencia'),('Ceremonia','experiencia'),('Blog','faq')])+f'<button class="salon-outline" type="button" data-demo="{salon_demo}">Agendar cita</button></nav></header>'
def salon_hero():
 return '<div class="salon-hero"><h2>Salón de uñas: para cuando quieres verte bien y que, además, te vean</h2><p>Vive la experiencia ceremonia: elige tu diseño, relájate y luce unas uñas tan perfectas que no dejarás de mirarlas.</p><p class="salon-note">¡Reserva en línea y llévate las uñas (y la actitud) renovadas!</p>'+salon_button()+'</div>'
stats='<div class="salon-stats">'
for glyph,title,text in [('MapPin','N° 1 en Fresha','El salón de uñas mejor valorado en Mérida.'),('Star','4.9 de valoración en Google<br>Confianza','Cuidado y uñas impecables. Así nos califican.'),('MessageCircle','+100 opiniones','Hablan de atención, estilo y cuidado en cada detalle.')]:
 stats+=f'<article class="salon-stat">{icon(glyph)}<h3>{title}</h3><p>{text}</p></article>'
stats+='</div>'
identity='<div class="identity-hero ceremonia-hero-board">'+frame(salon_nav()+salon_hero(),canvas='salon',preview=True)+'</div>'
symbols=''.join(icon(n) for n in ['Coffee','MapPin','Heart','Star','Heart','MessageCircle','Droplet','Music'])
identity+='<div class="identity-panel ceremonia-symbols">'+frame('<div class="symbol-sheet">'+symbols+'</div>',width=360,preview=True)+'</div>'
identity+='<div class="identity-panel ceremonia-buttons">'+frame('<div class="button-sample"><b></b><strong>Botón primario</strong><strong>Botón secundario</strong><b>Activo</b><span>AGENDAR</span><span class="secondary">AGENDAR</span><b>Hover</b><span class="hover">AGENDAR</span><span class="secondary hover">AGENDAR</span></div>',width=430,preview=True)+'</div>'
body=opening('Ceremonia','Web Express','Salón de belleza con dos sucursales en Mérida, México. Necesitaban una web que transmitiese sus valores y generara más reservas.',identity,'salon')
body+='<section class="salon-showcase" id="salon" aria-label="Diseño de la página de inicio">'+frame(salon_nav()+salon_hero()+stats,canvas='salon')+'</section>'
cards='<div class="nail-composition">'
for img,title,text,items in [('classic','Clásicas, pero nunca básicas','Diseño discreto, elegante y siempre en tendencia.',['Manicura tradicional','Francesas','Baby boomer','Nude','Pedicure tradicional','SPA de manos y pies']),('color','Color, diseño y duración','Diseños para cambiar de estilo, probar colores o efectos.',['Gel (manos o pies)','Esmalte','Acrílico','Softgel','Rubber base','Polygel']),('care','Cuidado, retoque y reparación','Para retirar material o dar fuerza a tus uñas.',['Retiros de gel, acrílico, soft gel, rubber','Tratamientos fortalecedores'])]:
 cards+='<article class="nail-card">'+photo('ceremonia',img,title)+f'<div class="nail-copy"><h3>{title}</h3><p>{text}</p><ul>'+''.join(f'<li>{icon("Plus")}<span>{item}</span></li>' for item in items)+'</ul></div></article>'
cards+='</div>'
body+='<section class="nail-showcase" id="unas" aria-label="Servicios de manicura">'+frame(cards)+'</section>'
experience='<section class="experience"><span class="salon-pill">Experiencia</span><h2>Tu momento ceremonia</h2><p>Aquí, cada detalle está pensado para que te sientas bienvenida, tranquila y especial.</p><div class="experience-grid">'
for glyph,title,text in [('Coffee','Té de cortesía','Aquí, cada detalle está pensado para que te sientas bienvenida, tranquila y especial.'),('Heart','Comodidad real','Sillones amplios, luz suave y espacio para respirar.'),('Music','Ambiente relajado','Música, aromas y calma para disfrutar sin distracciones.'),('ShieldCheck','Higiene y cuidado','Materiales esterilizados frente a ti. Porque lo esencial, se nota.'),('HandHeart','Trato cálido','Profesionales amables, que te cuidan sin apuros.')]:
 experience+=f'<article><h3>{icon(glyph)}{title}</h3><p>{text}</p></article>'
experience+='<article class="experience-cta"><p>Quiero mi momento ceremonia</p>'+salon_button(rose=True)+'</article></div></section><section class="salon-other"><span class="salon-pill">Otros servicios</span><h2>Descubre más servicios de cuidado</h2><p>Para quienes buscan relajarse sin renunciar a su estilo</p></section>'
body+='<section class="experience-showcase" id="experiencia" aria-label="Experiencia Ceremonia">'+frame(experience,classes='experience-frame',canvas='salon')+'</section>'
faq='<section class="salon-faq"><div class="salon-faq-grid"><div><span class="salon-pill">FAQ</span><h2>Preguntas frecuentes</h2><p class="salon-faq-intro">Queremos que te sientas en confianza desde el inicio. Aquí te respondemos lo más consultado.</p>'
for n,(q,a) in enumerate([('¿Cómo puedo agendar una cita?','Puedes reservar desde nuestro sitio web a través de Fresha, eligiendo la sucursal, el servicio y el horario que prefieras. También puedes contactarnos por WhatsApp si necesitas ayuda.'),('¿Qué medidas de higiene utilizan?','Materiales esterilizados frente a ti. Porque lo esencial, se nota.'),('¿Qué tipo de productos utilizan?','Consultá con el salón para conocer los productos disponibles.'),('¿Puedo elegir el diseño de uñas o pedir algo personalizado?','Consultá las opciones y diseños con el equipo del salón.'),('¿Cuáles son las formas de pago?','Consultá los medios de pago con la sucursal elegida.'),('¿Qué hace diferente a ceremonia de otros salones?','Un ambiente relajado y atención a cada detalle de tu experiencia.')]):
 faq+=f'<details {"open" if n==0 else ""}><summary>{q}{icon("ChevronDown")}</summary><p>{a}</p></details>'
faq+='</div>'+photo('ceremonia','faq','Manicura y atención al detalle en Ceremonia')+'</div></section>'
body+='<section class="ceremonia-reflections" id="faq">'+frame(faq,width=900,classes='faq-frame',canvas='salon')+'<div class="case-reflection"><h2>Algunas reflexiones</h2><p>Diseñar Ceremonia fue un proceso veloz pero disfrutable y cómodo.</p><p>Trabajé en base al contenido escrito por Valu Tenaglia, lo que facilitó enormemente la propuesta de secciones de la web.</p><p>El resultado es simple y elegante y consigue lo que busco: posicionar y destacar a Ceremonia entre la competencia.</p></div></section>'
doc('ceremonia','Ceremonia',body)
# FLYTRANSFER
logo='<span class="fly-logo">'+icon('Send')+'flytransfer</span>'
def fly_button(text,target='transfer',glyph='Search',light=False):
 return f'<a class="fly-button{" light" if light else ""}" href="#{target}">{icon(glyph)}{text}</a>'
def booking(suffix='desktop'):
 return f'''<form class="booking"><fieldset><legend>Service</legend><div class="trip-options"><label><input type="radio" name="trip-{suffix}" value="one-way" checked><span>One way</span></label><label><input type="radio" name="trip-{suffix}" value="round-trip"><span>Round trip</span></label></div></fieldset><label>From<select name="from"><option>Cancun International Airport</option><option>Hotel</option></select></label><label>To<input name="to" placeholder="Hotel, airport…" required></label><label>Date &amp; hour<input type="datetime-local" name="date" required></label><label>Amount of passengers<input type="number" name="passengers" min="1" max="8" value="1" required></label><button class="fly-button" type="submit">{icon('Search')}Find prices</button></form>'''
def benefits():
 return '<ul class="vehicle-benefits"><li>'+icon('Check')+'Free cancellation up to 24 hs in advance</li><li>'+icon('Check')+'Immediate confirmation</li></ul>'
def fly_footer():
 return '<footer class="fly-footer"><div>'+logo+'<h3>The best transportation service</h3></div><ul>'+''.join(f'<li>{icon(glyph)}{text}</li>' for glyph,text in [('ShieldCheck','100% safe'),('UserRoundCheck','Professional drivers'),('Headphones','Available 24/7'),('Phone','+52 55 1234 5678')])+'</ul></footer>'
def fly_links(desktop=False):
 return f'<div class="fly-links{" fly-desktop-links" if desktop else ""}"><a class="fly-link" href="#fleet"><small>Learn more about</small><strong>Our car fleet</strong></a><a class="fly-link services-link" href="#services"><small>Learn more about</small><strong>Our services</strong></a></div>'
def fly_hero():
 return '<section class="fly-hero">'+booking()+'<div class="fly-hero-content">'+logo+'<h2>Your way to relax<em>made simple</em></h2><p>Clear prices, reliable service &amp; real experiences</p>'+fly_button('Learn how it works','services','Play',True)+'</div></section>'
def fly_top():
 return '<div class="fly-mobile-top">'+logo+'<button class="language-button" type="button" aria-label="Idioma: inglés" data-demo="Esta presentación muestra el diseño original en inglés.">'+icon('Globe')+'En</button></div>'
def fly_mobile(home=True):
 content='<article class="fly-mobile"><div class="fly-mobile-body">'+fly_top()
 if home:
  content+='<h2 class="fly-mobile-title">Your way to relax<em>made simple</em></h2><p class="fly-mobile-subtitle">Clear prices, reliable service<br>&amp; real experiences</p><div class="fly-mobile-actions">'+fly_button('Find your transfer')+fly_button('Learn how it works','services','Play',True)+'</div>'+fly_links()
 else:
  content+='<h2 class="fly-services-title">'+icon('ArrowLeft')+'Our services</h2>'
  for title,text in [('One way','Choose your vehicle and we’ll do the rest! We’ll take you from the airport directly to your hotel while you relax.'),('Round trip','One booking and we’ll pick you up, drop you off at your hotel and collect you again for a smooth ride back.')]:
   content+='<section class="trip-card"><h3>'+title+icon('ArrowRight')+'</h3><p>'+text+'</p>'+benefits()+fly_button('Find your transfer')+'</section>'
 return content+'</div>'+fly_footer()+'</article>'
board='<div class="identity-hero flytransfer-hero-board">'+frame(fly_hero(),classes='',canvas='fly-site',preview=True)+'</div>'
board+='<div class="identity-panel flytransfer-form-board">'+frame('<div class="booking-mobile"><h3>Find your transfer</h3>'+booking('mini')+'<p class="booking-mobile-note">Secure payment with Apple Pay, Google Pay &amp; cards</p></div>',width=340,canvas='fly-site',preview=True)+'</div>'
board+='<div class="identity-panel flytransfer-mobile-board">'+frame(fly_mobile(),width=390,canvas='fly-site',preview=True)+'</div>'
body=opening('Flytransfer','Webapp','Es una startup de traslados privados en Cancún, México. Tenían una webapp funcional pero genérica, creada a partir de un template, difícil de usar en celular y que no transmitía lo que realmente son: un servicio premium.',board,'transfer')
body+='<section class="transfer-showcase" id="transfer" aria-label="Diseño de escritorio de Flytransfer" lang="en">'+frame(fly_hero()+fly_links(True)+fly_footer(),classes='fly-desktop-frame',canvas='fly-site')+'</section>'
vehicles=''
for i,title,price,text,extra in [(7,'Economic Sedan','450','Comfortable car for 1 to 4 passengers with standard luggage.',''),(6,'SUV Premium','850','Luxury vehicle for up to 6 passengers with maximum comfort and style.','+1'),(10,'Familiar Van','700','Spacious van ideal for groups of 5–8 passengers with additional luggage.','+3')]:
 content='<article class="vehicle">'+photo('flytransfer',f'image-{i}',title,'vehicle-photo'+(' van' if i==10 else ''))+f'<h3>{title}<span>${price}</span></h3><p class="vehicle-description">{text}</p><div class="vehicle-amenities">'+''.join('<span>'+icon(glyph)+text+'</span>' for glyph,text in [('Wifi','Free WiFi'),('Snowflake','Air-conditioning'),('Droplet','Water')])+extra+'</div>'+benefits()+f'<button class="fly-button" type="button" data-demo="Vehículo seleccionado: {title}. Esta es una demostración; no se realizan reservas ni cobros.">Choose vehicle</button></article>'
 vehicles+=frame(content,width=400,classes='vehicle-frame',canvas='fly-site')
body+='<section class="vehicle-showcase" id="fleet" aria-label="Flota de vehículos"><div class="vehicle-composition" lang="en">'+vehicles+'</div></section>'
body+='<section class="mobile-showcase" id="services" aria-label="Diseño móvil y servicios"><div class="mobile-pair" lang="en">'+frame(fly_mobile(),width=390,classes='fly-mobile-frame',canvas='fly-site')+frame(fly_mobile(False),width=390,classes='fly-mobile-frame',canvas='fly-site')+'</div></section>'
body+='<section class="fly-reflections case-reflection"><h2>Algunas reflexiones</h2><p>Flytransfer fue uno de mis proyectos favoritos porque, a pesar de ser una webapp, tuve toda la libertad creativa para probar una estética diferente y que, al final, terminó por lograr lo que necesitaba: verse y sentirse premium.</p></section>'
doc('flytransfer','Flytransfer',body)
print('Reconstrucción HTML de ambas presentaciones completada.')
