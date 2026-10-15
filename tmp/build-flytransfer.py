from pathlib import Path
import json,re
icons=json.loads(Path('assets/icons/lucide.json').read_text(encoding='utf-8'))
def icon(name):return icons[name]
def frame(content,width=1440,classes='',preview=False):
 return f'<div class="scale-frame {classes}" data-width="{width}"'+(' inert aria-hidden="true"' if preview else '')+f'><div class="design-canvas fly-site">{content}</div></div>'
logo='<span class="fly-logo"><svg class="fly-brandmark" viewBox="0 0 12 18" fill="currentColor" aria-hidden="true"><path d="M1 1 11 6v3L2 5Zm1 6 9 4v3l-8-4Zm2 6 7 3v2l-6-2Z"/></svg>Flytransfer</span>'
def button(text,target='transfer',glyph='Search',light=False):return f'<a class="fly-button{" light" if light else ""}" href="#{target}">{icon(glyph)}<span>{text}</span></a>'
def passengers():
 return f'<div class="passenger-field"><span class="field-label">Amount of passengers</span><div class="passenger-stepper"><button type="button" data-passenger-step="-1" aria-label="Reducir pasajeros">{icon("Minus")}</button><input type="number" name="passengers" min="1" max="8" value="1" aria-label="Cantidad de pasajeros" required><button type="button" data-passenger-step="1" aria-label="Agregar pasajero">{icon("Plus")}</button></div></div>'
def booking(suffix='main',mini=False):
 return f'''<form class="booking"><fieldset><legend>{'Select the service you need' if mini else 'Service'}</legend><div class="trip-options"><label><input type="radio" name="trip-{suffix}" value="one-way" checked><span>One way</span></label><label><input type="radio" name="trip-{suffix}" value="round-trip"><span>Round trip</span></label></div></fieldset><label class="from-field">From<input name="from" value="Cancun International Airport" required></label><label class="to-field">To<input name="to" placeholder="Hotel, airport..." required></label><label class="date-label">Date &amp; hour<span class="date-field">{icon('CalendarDays')}<input type="datetime-local" name="date" aria-label="Fecha y hora del traslado" required></span></label>{passengers()}<button class="fly-button" type="submit">{icon('Search')}<span>Find prices</span></button></form>'''
def benefits():return '<ul class="vehicle-benefits"><li>'+icon('Check')+'Free cancellation up to 24 hs in advance</li><li>'+icon('Check')+'Immediate confirmation</li></ul>'
def footer():return '<footer class="fly-footer"><div>'+logo+'<h3>The best <em>transportation</em> service</h3></div><ul>'+''.join(f'<li>{icon(g)}'+(f'<a href="tel:+525512345678">{t}</a>' if g=='Phone' else t)+'</li>' for g,t in [('ShieldCheck','100% safe'),('Handshake','Professional drivers'),('Clock','Available 24/7'),('Phone','+52 55 1234 5678')])+'</ul></footer>'
def links(desktop=False):return f'<div class="fly-links{" fly-desktop-links" if desktop else ""}"><a class="fly-link" href="#fleet"><small>Learn more about</small><strong>Our <em>car fleet</em></strong></a><a class="fly-link services-link" href="#services"><small>Learn more about</small><strong>Our <em>services</em></strong></a></div>'
def hero(suffix='main'):return '<section class="fly-hero">'+booking(suffix)+'<div class="fly-hero-content">'+logo+'<h2>Your way to relax<em>made simple</em></h2><p>Clear prices, reliable service &amp; real experiences</p>'+button('Learn how it works','services','Play',True)+'</div></section>'
def mobile(home=True):
 content='<article class="fly-mobile"><div class="fly-mobile-body"><div class="fly-mobile-top">'+logo+'<button class="language-button" type="button" aria-label="Idioma inglés" data-demo="Esta presentación muestra el diseño original en inglés.">'+icon('Globe')+'En</button></div>'
 if home:
  content+='<h2 class="fly-mobile-title">Your way to relax<em>made simple</em></h2><p class="fly-mobile-subtitle">Clear prices, reliable service<br>&amp; real experiences</p><div class="fly-mobile-actions">'+button('Find your transfer')+button('Learn how it works','services','Play',True)+'</div>'+links()
 else:
  content+='<h2 class="fly-services-title">Our <em>services</em></h2>'
  for title,text in [('One way','Choose your vehicle and we’ll do the rest! We’ll take you from the airport directly to your hotel while you relax.'),('Round trip','One booking and we’ll pick you up, drop you off at your hotel and collect you again for a smooth ride back.')]:
   content+=f'<section class="trip-card"><h3>{title}</h3><p>{text}</p>'+benefits()+button('Find your transfer')+'</section>'
 return content+'</div>'+footer()+'</article>'
board='<div class="identity-hero flytransfer-hero-board">'+frame(hero('preview'),preview=True)+'</div>'
preview='<div class="booking-preview-phone"><div class="booking-preview-shade">'+button('Learn how it works','services','Play',True)+'</div><div class="booking-mobile"><div class="booking-mobile-heading"><h3>Find your transfer</h3><button type="button" aria-label="Cerrar formulario">'+icon('X')+'</button></div>'+booking('mini',True)+'<p class="booking-mobile-note">'+icon('ShieldCheck')+'Secure payment with Apple Pay, Google Pay &amp; cards</p></div></div>'
board+='<div class="identity-panel flytransfer-form-board">'+frame(preview,width=340,preview=True)+'</div><div class="identity-panel flytransfer-mobile-board">'+frame(mobile(),width=390,preview=True)+'</div>'
body='<h1 class="sr-only">Flytransfer — diseño de la experiencia de reservas</h1><section class="fly-overview" aria-label="Vistas del diseño de Flytransfer"><div class="identity-board">'+board+'</div></section>'
body+='<section class="transfer-showcase" id="transfer" aria-label="Flytransfer en escritorio">'+frame(hero()+links(True)+footer(),classes='fly-desktop-frame fly-site-desktop')+'</section>'
vehicles=''
for i,title,price,text,extra in [(7,'Economic Sedan','450','Comfortable car for 1 to 4 passengers with standard luggage.',''),(6,'SUV Premium','850','Luxury vehicle for up to 6 passengers with maximum comfort and style.','+1'),(10,'Familiar Van','700','Spacious van ideal for groups of 5–8 passengers with additional luggage.','+3')]:
 content=f'<article class="vehicle"><div class="vehicle-image"><img class="vehicle-photo{" van" if i==10 else ""}" src="../assets/projects/flytransfer/image-{i}.jpg" alt="{title}" loading="lazy"></div><h3>{title}<span>${price}</span></h3><p class="vehicle-description">{text}</p><div class="vehicle-amenities">'+''.join('<span>'+t+icon(g)+'</span>' for g,t in [('Wifi','Free Wifi'),('Wind','Air-conditioning'),('BottleWine','Water')])+(f'<span class="amenity-extra">{extra}</span>' if extra else '')+'</div>'+benefits()+f'<button class="fly-button" type="button" data-demo="Vehículo seleccionado: {title}. Esta es una demostración; no se realizan reservas ni cobros.">Choose vehicle</button></article>'
 vehicles+=frame(content,width=400,classes='vehicle-frame')
body+='<section class="vehicle-showcase" id="fleet" aria-label="Flota de vehículos"><div class="vehicle-composition">'+vehicles+'</div></section>'
body+='<section class="mobile-showcase" id="services" aria-label="Flytransfer en móvil"><div class="mobile-pair">'+frame(mobile(),width=390,classes='fly-mobile-frame')+frame(mobile(False),width=390,classes='fly-mobile-frame')+'</div></section>'
html='''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Flytransfer: diseño de una experiencia de reservas de traslados privados en Cancún."><title>Flytransfer — Irina &amp; Renzo</title><link rel="stylesheet" href="../css/projects.css"><link rel="stylesheet" href="../css/flytransfer.css"><script src="../js/project-interactions.js" defer></script></head><body class="flytransfer"><main class="case-page">'''+body+'</main><div class="case-status" id="case-status" role="status" aria-live="polite"></div></body></html>'
Path('projects/flytransfer.html').write_text(html,encoding='utf-8')
p=Path('index.html');s=p.read_text(encoding='utf-8');s=re.sub(r'<span class="arrow">.*?</span>','',s,flags=re.S);p.write_text(s,encoding='utf-8')
print('Cuatro composiciones reconstruidas y flechas decorativas retiradas.')
