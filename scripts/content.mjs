import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
export const schema = JSON.parse(fs.readFileSync('policies/content-schema.json','utf8'));
export function files(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=> e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]); }
export function readNotes(root='content') { return files(root).filter(f=>f.endsWith('.md')).map(file=>{
 const raw=fs.readFileSync(file,'utf8'); const m=raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
 if(!m) throw Error(`${file}: frontmatter ausente`);
 return {file,slug:path.relative(root,file).replaceAll('\\','/').slice(0,-3),meta:YAML.parse(m[1]),body:m[2]};
}); }
const dateOK = s=> typeof s==='string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0,10)===s;
export function validate(notes) {
 const errors=[];const slugs=new Set(notes.map(n=>n.slug));const titles=new Set();
 for(const n of notes) {
  const {meta:m,body,slug}=n; const fail=s=>errors.push(`${slug}: ${s}`);
  if(!m || typeof m!=='object' || Array.isArray(m)){fail('metadados inválidos');continue;}
  for(const field of schema.required) if(!(field in m)&&!(m.type==='laboratorio'&&field==='relations')) fail(`campo obrigatório: ${field}`);
  if(!/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/.test(slug)) fail('caminho deve usar minúsculas sem acentos e hífens');
  if(typeof m.title!=='string'||m.title.length<3||m.title.length>100)fail('título: 3–100 caracteres');
  if(titles.has(m.title))fail('título duplicado'); titles.add(m.title);
  if(typeof m.description!=='string'||m.description.length<30||m.description.length>240)fail('descrição: 30–240 caracteres');
  if(!schema.types[m.type])fail('tipo desconhecido');
  if(!schema.stages.includes(m.stage))fail('etapa desconhecida');
  if(!schema.statuses.includes(m.status))fail('status desconhecido');
  if(!dateOK(m.created)||!dateOK(m.updated)||m.updated<m.created)fail('datas inválidas');
  if(!Array.isArray(m.tags)||!m.tags.length||m.tags.some(t=>typeof t!=='string'||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(t)))fail('tags inválidas');
  const prose=body.replace(/```[\s\S]*?```/g,'').replace(/`[^`]*`/g,'');
  for(const h of schema.types[m.type]??[]) {
   const escaped=h.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
   const section=prose.match(new RegExp(`^## ${escaped}\\s*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`,'m'));
   if(!section||section[1].trim().length<12)fail(`seção ausente ou vazia: ${h}`);
  }
  const links=[...prose.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g)].map(x=>x[1]);
  for(const link of links)if(!slugs.has(link))fail(`wikilink inexistente: ${link}`);
  if(m.isolated!==undefined&&(m.type!=='conceito'||typeof m.isolated!=='boolean'))fail('isolated deve ser booleano e usado apenas em conceitos');
  if(m.type!=='laboratorio'&&!(m.type==='conceito'&&m.isolated===true)&&(!Array.isArray(m.relations)||!m.relations.length))fail('inclua ao menos uma relação');
  if(m.relations!==undefined&&!Array.isArray(m.relations))fail('relações devem ser uma lista');
  for(const rel of Array.isArray(m.relations)?m.relations:[]){
   if(!rel || !slugs.has(rel.target))fail(`relação inexistente: ${rel?.target}`);
   if(rel?.target===slug)fail('relação consigo mesma');
   if(!schema.relationTypes.includes(rel?.kind))fail('tipo de relação inválido');
   if(!links.includes(rel?.target))fail(`relação sem wikilink no corpo: ${rel?.target}`);
  }
  const refs=prose.split('## Referências')[1]??'';
  if(!/https?:\/\/[^\s)]+/.test(refs))fail('inclua referência HTTP(S)');
  if(/<script\b|<iframe\b|javascript\s*:|\bon\w+\s*=/i.test(prose))fail('conteúdo ativo não permitido');
  if(slug!=='index'&&/<\/?[a-z][^>]*>/i.test(prose))fail('HTML bruto não permitido em notas');
  if(/AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{30,}|-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----/.test(body))fail('possível credencial');
 }
 return errors;
}
