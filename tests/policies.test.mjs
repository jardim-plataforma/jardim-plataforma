import test from 'node:test';import assert from 'node:assert/strict';
import {readNotes,validate} from '../scripts/content.mjs';
const notes=readNotes();
test('conteúdo inicial válido',()=>assert.deepEqual(validate(notes),[]));
for(const [name,mutate,pattern] of [
 ['campo ausente',n=>delete n.meta.title,/título|obrigatório/],
 ['relação quebrada',n=>n.meta.relations[0].target='nao-existe',/inexistente/],
 ['link quebrado',n=>n.body+='\n[[nao-existe]]',/wikilink inexistente/],
 ['data impossível',n=>n.meta.updated='2026-02-30',/datas inválidas/],
 ['modelo incompleto',n=>n.body=n.body.replace('## Exemplo','## Outro'),/seção/],
 ['relação sem texto',n=>n.meta.relations.push({target:'laboratorios/index',kind:'depende-de'}),/sem wikilink/],
 ['script ativo',n=>n.body+='\n<script>alert(1)</script>',/ativo/],
 ['tag inválida',n=>n.meta.tags=['Tem Espaços'],/tags/],
 ['credencial',n=>n.body+='\nAKIA'+'A'.repeat(16),/credencial/]
])test(name,()=>{const copy=structuredClone(notes);const n=copy.find(n=>n.meta.type==='conceito');mutate(n);assert.match(validate(copy).join('\n'),pattern);});

test('laboratório dispensa relações e mantém tags de assuntos',()=>{
 const lab=structuredClone(notes.find(n=>n.meta.type==='laboratorio'));delete lab.meta.relations;
 assert.deepEqual(validate(notes.map(n=>n.slug===lab.slug?lab:n)),[]);
 lab.meta.tags=[];assert.match(validate([lab]).join('\n'),/tags inválidas/);
});
test('relações fornecidas em laboratório ainda precisam ser válidas',()=>{
 const lab=structuredClone(notes.find(n=>n.meta.type==='laboratorio'));lab.meta.relations=[{target:'inexistente',kind:'documenta'}];
 assert.match(validate(notes.map(n=>n.slug===lab.slug?lab:n)).join('\n'),/relação inexistente/);
});


test('conceito isolado explicitamente dispensa conexões',()=>{
 const copy=structuredClone(notes);const n=copy.find(n=>n.meta.type==='conceito');
 n.meta.isolated=true;n.meta.relations=[];
 assert.deepEqual(validate(copy),[]);
});
test('conceito sem opção explícita ainda exige conexão',()=>{
 for(const flag of [undefined,false]){
  const copy=structuredClone(notes);const n=copy.find(n=>n.meta.type==='conceito');
  if(flag===undefined)delete n.meta.isolated;else n.meta.isolated=flag;
  n.meta.relations=[];assert.match(validate(copy).join('\n'),/inclua ao menos uma relação/);
 }
});
test('isolamento não dispensa metadados modelo ou conexões válidas',()=>{
 const copy=structuredClone(notes);const n=copy.find(n=>n.meta.type==='conceito');
 n.meta.isolated=true;n.meta.relations=[];
 delete n.meta.title;n.body=n.body.replace('## Exemplo','## Outro');
 n.meta.relations.push({target:'nao-existe',kind:'utiliza'});
 const errors=validate(copy).join('\n');
 assert.match(errors,/obrigatório/);assert.match(errors,/seção/);assert.match(errors,/relação inexistente/);
});
test('isolamento exige booleano e não se aplica a guias',()=>{
 const copy=structuredClone(notes);const n=copy.find(n=>n.meta.type==='conceito');
 n.meta.isolated='true';assert.match(validate(copy).join('\n'),/isolated deve ser booleano/);
 const guide=structuredClone(notes);guide.find(n=>n.meta.type==='guia').meta.isolated=true;
 assert.match(validate(guide).join('\n'),/isolated deve ser booleano/);
});
