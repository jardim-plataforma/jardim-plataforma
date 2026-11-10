import {parseHTML} from 'linkedom';
import fs from 'node:fs';import assert from 'node:assert/strict';import {readNotes} from './content.mjs';
for(const n of readNotes()){
 const html=fs.readFileSync(`public/${n.slug}.html`,'utf8');
 const {document}=parseHTML(html);
 assert.equal(document.querySelector('.article-title')?.textContent,n.meta.title,n.slug+': título incorreto');
 assert.ok(document.querySelector('title').textContent.startsWith(n.meta.title),n.slug+': título da aba incorreto');
 assert.ok(!document.querySelector('article').textContent.includes('"relations"'),n.slug+': metadados vazaram no texto');
 assert.ok(!document.querySelector('article').textContent.includes('"description"'),n.slug+': descrição em JSON no texto');
 assert.ok(html.includes('Editar esta página'),n.slug+': edição ausente');
 assert.ok(html.includes('rel="canonical"'),n.slug+': canonical ausente');
 assert.ok(html.includes('application/ld+json'),n.slug+': dados estruturados ausentes');
 assert.ok(!html.includes('maria-dantas_rnp.github.io'),n.slug+': URL incorreta');
}
for(const file of ['studio.html','studio.js','ciclo.html','ciclo.js','garden.css','garden-data.json','sitemap.xml','robots.txt'])assert.ok(fs.statSync('public/'+file).size>0,file);
const data=JSON.parse(fs.readFileSync('public/garden-data.json'));
assert.equal(data.notes.length,readNotes().length);
console.log('Páginas, links de edição, dados do editor e SEO verificados.');

assert.ok(fs.readFileSync('public/mapa.html','utf8').includes('id="concept-network"'),'mapa amplo ausente');
assert.ok(!data.notes.some(n=>n.type==='decisao'||n.type==='demanda'),'seções removidas ainda publicadas');
// Validate local links and assets after Quartz rewrites Markdown URLs.
const path=await import('node:path');
for(const n of readNotes()){
 const file=`public/${n.slug}.html`;
 const {document}=parseHTML(fs.readFileSync(file,'utf8'));
 for(const el of document.querySelectorAll('a[href],link[href],script[src],img[src]')){
  const href=el.getAttribute('href')||el.getAttribute('src');
  if(!href||/^(https?:|mailto:|data:|#)/.test(href))continue;
  const target=path.resolve(path.dirname(file),decodeURIComponent(href.split(/[?#]/)[0]));
  assert.ok(fs.existsSync(target)||fs.existsSync(target+'.html')||fs.existsSync(path.join(target,'index.html')),`${n.slug}: recurso ou link ausente ${href}`);
 }
}
console.log('Links e recursos locais conferidos.');

const catalog = parseHTML(fs.readFileSync('public/conceitos/index.html','utf8')).document.querySelector('#concept-catalog');
const concepts = data.notes.filter(n=>n.type==='conceito');
assert.equal(catalog.querySelectorAll('li').length, concepts.length);
for(const n of concepts) assert.ok([...catalog.querySelectorAll('a')].some(a=>a.textContent===n.title));
for(const slug of ['github','gitlab','gitops','gitflow','githubflow','trunk-based']){
 const note=data.notes.find(n=>n.slug==='conceitos/'+slug);
 assert.equal(note.icon,'icons/'+slug+'.svg');
 assert.ok(fs.existsSync('public/'+note.icon));
 const page=parseHTML(fs.readFileSync('public/conceitos/'+slug+'.html','utf8')).document;
 assert.ok(page.querySelector('.concept-brand img'));
}
console.log('Catálogo automático e ícones verificados.');

const labs=data.notes.filter(n=>n.type==='laboratorio');
const labCatalog=parseHTML(fs.readFileSync('public/laboratorios/index.html','utf8')).document;
assert.equal(labCatalog.querySelectorAll('.lab-card').length,labs.length);
assert.ok(labs.length>=10,'demandas de estudo ausentes');
for(const lab of labs){
 const page=parseHTML(fs.readFileSync('public/'+lab.slug+'.html','utf8')).document;
 assert.ok(page.querySelector('.lab-edit a').getAttribute('href').includes('editar='+encodeURIComponent(lab.slug)));
 assert.ok(lab.meta&&lab.body.includes('## Contexto'),'conteúdo editável ausente');
}
assert.ok(!labCatalog.querySelector('.garden-nav').textContent.includes('Simulador'));
console.log('Catálogo de laboratórios e edição de relatórios verificados.');

assert.equal(labCatalog.querySelector('.lab-edit'), null, 'a página principal não deve exibir edição');
for(const lab of labs){assert.ok(!lab.body.includes('## Meu registro'));assert.equal(lab.meta.relations,undefined);}
