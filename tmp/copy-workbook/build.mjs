import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';
const manifest = JSON.parse(await fs.readFile(new URL('./copy-manifest.json', import.meta.url),'utf8'));
const outputDir = new URL('../../outputs/copy-2026-10-14/', import.meta.url);
await fs.mkdir(outputDir,{recursive:true});
const workbook = Workbook.create();
const groups = [
  ['Copy web',manifest.visible,'Textos de la página. Incluye el contenido desplegable de los precios.'],
  ['SEO y accesibilidad',manifest.technical,'Título del navegador, buscadores, imágenes y etiquetas de los controles.'],
  ['Mensajes y contacto',manifest.messages,'Mantené {proyecto} donde aparezca: se reemplaza por el nombre del proyecto.']
];
for (const [name,records,context] of groups) {
  const sheet = workbook.worksheets.add(name);
  sheet.showGridLines = false;
  sheet.tabColor = name === 'Copy web' ? '#063C41' : '#39C6A5';
  const last = records.length+6;
  const body = sheet.getRange(`A1:F${last}`);
  body.format.font = {name:'Arial',size:11,color:'#193438'};
  body.format.verticalAlignment = 'top';
  body.setNumberFormat('@');
  const widths = {A:28,B:22,C:30,D:58,E:58,F:28};
  for (const [col,width] of Object.entries(widths)) sheet.getRange(`${col}1:${col}${last}`).format.columnWidth=width;
  sheet.getRange('A2').values = [['Irina & Renzo — edición de copy']];
  sheet.getRange('A2').format.font = {name:'Arial',size:16,bold:true,color:'#063C41'};
  sheet.getRange('A2:F2').format.rowHeight = 26;
  sheet.getRange('A3').values = [['Editá la columna amarilla E. Vacía = conservar. [ELIMINAR] = quitar. No cambies los ID. Guardá el Excel y volvé a subirlo.']];
  sheet.getRange('A3:F3').format.rowHeight = 22;
  sheet.getRange('A4').values = [[context]];
  sheet.getRange('A4').format.font = {name:'Arial',size:10,color:'#506766'};
  sheet.getRange('A5').values = [['Fuente: index.html y js/main.js, 14/10/2026. Los PDF de los proyectos conservan sus textos originales.']];
  sheet.getRange('A5').format.font = {name:'Arial',size:10,color:'#506766'};
  const values = records.map(r=>[r.id,r.section,r.location,r.current,'','']);
  sheet.getRange(`A6:F${last}`).values = [['ID (no editar)','Sección','Elemento','Texto actual','Texto editado','Observaciones'],...values];
  const table = sheet.tables.add(`A6:F${last}`,true,name === 'Copy web' ? 'CopyWeb' : name === 'SEO y accesibilidad' ? 'SeoAccesibilidad' : 'MensajesContacto');
  table.showFilterButton = true;
  const headers = sheet.getRange('A6:F6');
  headers.format.fill = '#063C41';
  headers.format.font = {name:'Arial',size:11,bold:true,color:'#FFFFFF'};
  headers.format.horizontalAlignment = 'center';
  headers.format.verticalAlignment = 'center';
  headers.format.rowHeight = 28;
  for (let i=0;i<records.length;i++) {
    const row = i+7;
    const range = sheet.getRange(`A${row}:F${row}`);
    range.format.wrapText = true;
    range.format.fill = i%2 ? '#F2F6F5' : '#FFFFFF';
    range.format.rowHeight = Math.max(36,Math.ceil(records[i].current.length/65)*16+12,Math.ceil(records[i].location.length/31)*16+12);
    sheet.getRange(`A${row}`).format.font = {name:'Arial',size:10,color:'#506766'};
    sheet.getRange(`E${row}`).format.fill = '#FFF2CC';
    sheet.getRange(`F${row}`).format.fill = '#FFFAEC';
    if (i===0 || records[i].section!==records[i-1].section) range.format.borders = {top:{style:'thin',color:'#99B9B3'}};
  }
  sheet.freezePanes.freezeRows(6);
  sheet.freezePanes.freezeColumns(2);
  if (sheet.getRange(`D7:D${last}`).values.some((row,i)=>row[0]!==records[i].current)) throw Error('Copy incompleto en '+name);
}
workbook.recalculate();
for (const [name] of groups) {
  const preview = await workbook.render({sheetName:name,range:'A1:F12',scale:1,format:'png'});
  await fs.writeFile(new URL(name.replaceAll(' ','-')+'.png',outputDir),new Uint8Array(await preview.arrayBuffer()));
}
console.log((await workbook.inspect({kind:'region',sheetId:'Mensajes y contacto',range:'A6:E8',maxChars:1800,tableMaxRows:3,tableMaxCols:5})).ndjson);
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(fileURLToPath(new URL('copy-irina-renzo.xlsx',outputDir)));
await fs.copyFile(new URL('./copy-manifest.json',import.meta.url),new URL('copy-manifest.json',outputDir));
console.log('Exportados '+groups.reduce((n,g)=>n+g[1].length,0)+' textos.');
