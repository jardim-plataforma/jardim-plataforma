const $=id=>document.getElementById(id);
const names={conceito:'Conceito / ferramenta',laboratorio:'Laboratório / prática',guia:'Guia existente'};
const folders={conceito:'conceitos',laboratorio:'laboratorios',guia:'guias'};
let slugEdited=false,editing=null,draftKey='garden-draft-v1';
let data,generated='',filename='',draft={fields:{},sections:{},relations:[]};
function option(value,label=value){const o=document.createElement('option');o.value=value;o.textContent=label;return o;}
function capture(){for(const id of ['type','title','slug','description','stage','status','tags'])draft.fields[id]=$(id).value;document.querySelectorAll('[data-section]').forEach(el=>draft.sections[el.dataset.section]=el.value);draft.relations=$('type').value==='laboratorio'?[]:[...document.querySelectorAll('.relation')].map(row=>({target:row.querySelector('.target').value,kind:row.querySelector('.kind').value}));}
function save(){capture();try{localStorage.setItem(draftKey,JSON.stringify(draft));}catch{}}
function invalidate(){generated='';$('github').disabled=true;$('download').disabled=true;$('copy').disabled=true;$('result').textContent='Alterações pendentes. Gere o Markdown novamente para revisar.';}
function renderSections(){
$('relation-controls').hidden=$('type').value==='laboratorio';
$('add-report').hidden=$('type').value!=='laboratorio';
const box=$('sections');
box.replaceChildren();
const report='Resolução e resultados';
const headings=[
  ...data.schema.types[$('type').value],
  ...Object.keys(draft.sections).filter(h=>
    h!==report&&
    (editing||h===report)&&
    !data.schema.types[$('type').value].includes(h)
  )
].filter(x=>x!=='Conexões');

if($('type').value==='laboratorio'&&draft.sections[report]!==undefined&&draft.reportVisible){
  headings.push(report);
}

for(const heading of headings){
  const label=document.createElement('label');
  const id='section-'+box.children.length;
  label.htmlFor=id;
  label.textContent=heading;
  const input=document.createElement('textarea');
  input.id=id;
  input.dataset.section=heading;
  input.required=heading!=='Resolução e resultados';
  input.minLength=heading==='Resolução e resultados'?0:12;
  input.value=draft.sections[heading]||'';
  input.placeholder=heading==='Referências'?'https://endereco-da-documentacao-oficial':'Explique o que você entendeu, o que fez ou como verificou.';
  box.append(label,input);
}
const choices=$('media-section');
if(choices){
  choices.replaceChildren();
  for(const h of [...new Set([
    ...data.schema.types[$('type').value],
    ...Object.keys(draft.sections).filter(h=>
      h!=='Resolução e resultados'&&editing
    ),
    ...(draft.reportVisible?[report]:[])
  ])].filter(h=>h!=='Conexões'&&h!=='Referências')){
    choices.append(option(h));
  }
}
}
function addRelation(rel={}){const row=document.createElement('div');row.className='relation';const kind=document.createElement('select');kind.className='kind';kind.setAttribute('aria-label','Tipo de relação');for(const k of data.schema.relationTypes)kind.append(option(k));kind.value=rel.kind||'depende-de';const target=document.createElement('select');target.className='target';target.setAttribute('aria-label','Nota relacionada');for(const n of data.notes)target.append(option(n.slug,n.title));target.value=rel.target||data.notes[0].slug;const remove=document.createElement('button');remove.type='button';remove.className='secondary';remove.textContent='×';remove.setAttribute('aria-label','Remover relação');remove.onclick=()=>{row.remove();save();invalidate();};row.append(kind,target,remove);$('relations').append(row);}
function build(){capture();const f=draft.fields;const headings=[...data.schema.types[f.type],...Object.keys(draft.sections).filter(h=>(editing||h==='Resolução e resultados')&&!data.schema.types[f.type].includes(h))];const slug=editing?.slug||folders[f.type]+'/'+f.slug;if(data.notes.some(n=>n.slug===slug&&n.slug!==editing?.slug))throw Error('Já existe uma nota neste caminho. Use Editar esta página ou outro nome.');
if(f.type!=='laboratorio'&&!draft.relations.length)throw Error('Adicione ao menos uma relação.');
const tags=f.tags.split(',').map(x=>x.trim()).filter(Boolean);if(!tags.length||tags.some(x=>!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x)))throw Error('Use tags sem espaços ou acentos, separadas por vírgula.');
const pagesWithoutRequiredReferences = new Set([
  'index',
  'conceitos/index',
  'laboratorios/index',
]);

if (
  !pagesWithoutRequiredReferences.has(slug) &&
  !/https?:\/\/\S+/.test(draft.sections['Referências'] || '')
) throw Error('Inclua uma referência HTTP(S).');
const date=new Date().toLocaleDateString('sv-SE');const meta={...(editing?.meta||{}),title:f.title.trim(),description:f.description.trim(),type:f.type,stage:f.stage,status:f.status,created:editing?.meta.created||date,updated:date,tags,relations:draft.relations};
if(f.type==='laboratorio')delete meta.relations;
const relationLines=draft.relations.map(r=>`- [[${r.target}|${data.notes.find(n=>n.slug===r.target).title}]] — ${r.kind}.`).join('\n');
const related=editing&&draft.sections['Conexões']?draft.sections['Conexões']+'\n\n'+relationLines.split('\n').filter(line=>!draft.sections['Conexões'].includes(line.match(/\[\[([^|]+)\|/)?.[1]||line)).join('\n'):relationLines;
const body=headings.filter(h=>h!=='Resolução e resultados'||draft.sections[h]?.trim()).map(h=>'## '+h+'\n\n'+(h==='Conexões'?related:draft.sections[h].trim())).join('\n\n');
if(/<script\b|<iframe\b|javascript\s*:/i.test(body))throw Error('Não insira scripts ou iframes.');
generated='---\n'+JSON.stringify(meta,null,2)+'\n---\n\n'+body+'\n';filename='content/'+slug+'.md';return generated;}
try{const response=await fetch('garden-data.json');if(!response.ok)throw Error('Dados indisponíveis');data=await response.json();const editSlug=new URLSearchParams(location.search).get('editar');
if(editSlug){editing=data.notes.find(n=>n.slug===editSlug);if(!editing?.meta||!editing?.body)throw Error('Nota indisponível para edição.');
draftKey='garden-edit-'+editSlug;draft.reportVisible=false;draft.fields={...editing.meta,slug:editSlug.split('/').pop(),tags:editing.meta.tags.join(',')};draft.relations=editing.meta.relations||[];
for(const m of editing.body.matchAll(/^## (.+)\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm))draft.sections[m[1]]=m[2].trim();
$('type').disabled=true;$('slug').readOnly=true;$('github').textContent='Abrir arquivo no GitHub ↗';
$('editing-status').textContent='Editando: '+editing.title+'. Revise e salve no mesmo arquivo; nenhuma alteração é publicada automaticamente.';
}
try{const saved=JSON.parse(localStorage.getItem(draftKey));if(saved)draft=saved;}catch{}
for(const t of Object.keys(data.schema.types).filter(t=>t!=='guia'||editing?.meta.type==='guia'))$('type').append(option(t,names[t]));for(const t of data.schema.stages)$('stage').append(option(t));for(const t of data.schema.statuses)$('status').append(option(t));
if((!data.schema.types[draft.fields.type] || (draft.fields.type==='guia'&&!editing)) && draft.fields.type)draft.fields.type='laboratorio';
const requestedType=new URLSearchParams(location.search).get('tipo');if(!editing&&['conceito','laboratorio'].includes(requestedType))draft.fields.type=requestedType;
for(const [key,value]of Object.entries(draft.fields))if($(key))$(key).value=value;
if(!$('type').value)$('type').value='conceito';renderSections();for(const r of draft.relations.length?draft.relations:($('type').value==='laboratorio'?[]:[{}]))addRelation(r);
$('loading').hidden=true;$('workspace').hidden=false;
$('type').addEventListener('change',()=>{capture();renderSections();save();invalidate();});
$('editor').addEventListener('input',()=>{save();invalidate();});$('editor').addEventListener('change',()=>{save();invalidate();});
$('slug').addEventListener('input',()=>{slugEdited=true;});
slugEdited=Boolean(draft.fields.slug);
$('title').addEventListener('input',()=>{if(!slugEdited){$('slug').value=$('title').value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}});
$('add-report').onclick=()=>{capture();draft.sections['Resolução e resultados']??='';draft.reportVisible=true;renderSections();save();invalidate();};
$('add-relation').onclick=()=>{addRelation();save();invalidate();};
$('editor').onsubmit=e=>{e.preventDefault();try{build();$('preview').textContent=generated;$('result').textContent=`Arquivo: ${filename}\nRevise e conclua no GitHub. A pipeline fará a validação completa.`;$('result').className='message';$('github').disabled=false;$('download').disabled=false;$('copy').disabled=false;save();}catch(err){$('result').textContent=err.message;$('result').className='message error';}};
$('github').onclick=()=>{if(editing){
$('result').textContent='Copie o Markdown completo da prévia (ou baixe o arquivo). No GitHub, substitua o conteúdo existente e conclua o commit/PR. Abrir o editor não transfere o texto automaticamente.';
window.open(`https://github.com/${data.settings.repository}/edit/${encodeURIComponent(data.settings.branch)}/${filename}`,'_blank','noopener,noreferrer');return;}
const url=new URL(`https://github.com/${data.settings.repository}/new/${encodeURIComponent(data.settings.branch)}`);url.searchParams.set('filename',filename);url.searchParams.set('value',generated);if(url.href.length>7500){$('result').textContent='Texto grande para encaminhar por URL. Use Baixar .md e faça upload no GitHub na pasta indicada.';return;}window.open(url.href,'_blank','noopener,noreferrer');};
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(generated);$('result').textContent='Markdown copiado. Abra o arquivo no GitHub e substitua seu conteúdo.';}catch{$('result').textContent='Cópia automática indisponível. Selecione o texto da prévia ou baixe o arquivo.';}};
$('download').onclick=()=>{const url=URL.createObjectURL(new Blob([generated],{type:'text/markdown;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=filename.split('/').pop();a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('media-kind').onchange=()=>{const img=$('media-kind').value==='image';$('image-fields').hidden=!img;$('diagram-fields').hidden=img;};
$('media-insert').onclick=()=>{try{const section=$('media-section').value;const field=[...document.querySelectorAll('[data-section]')].find(x=>x.dataset.section===section);let snippet;
if($('media-kind').value==='image'){const url=$('image-url').value.trim(),alt=$('image-alt').value.trim();if(!alt)throw Error('Descreva a imagem para quem usa leitor de tela.');if(!/^https:\/\/[^\s]+$/.test(url)&&!/^\/[^\s]+$/.test(url))throw Error('Use uma URL HTTPS ou um caminho iniciado por /.');snippet='!['+alt.replace(/[\[\]]/g,'')+']('+url.replaceAll(')','%29')+')';}
else {const code=$('diagram-code').value.trim();if(!code)throw Error('Preencha o diagrama.');snippet=String.fromCharCode(96).repeat(3)+'mermaid\n'+code+'\n'+String.fromCharCode(96).repeat(3);}
field.value=field.value.trim()+'\n\n'+snippet;save();invalidate();$('media-feedback').textContent='Inserido na seção '+section+'. Revise o Markdown antes de enviar.';}
catch(e){$('media-feedback').textContent=e.message;}};
$('image-upload').href='https://github.com/'+data.settings.repository+'/upload/'+encodeURIComponent(data.settings.branch)+'/content/assets';
$('clear').onclick=()=>{if(confirm('Apagar o rascunho salvo neste navegador?')){try{localStorage.removeItem(draftKey);}catch{}location.reload();}};
}catch(e){$('loading').textContent='Não foi possível carregar o editor. Abra esta página pelo site publicado ou por um servidor local. '+e.message;}
