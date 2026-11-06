/* Presentation-only grouping. Source text and legacy property IDs stay intact. */
(function(root){
 'use strict';
 const clean=value=>String(value??'').normalize('NFC').replace(/\s+/gu,' ').trim();
 function extract(data){
  const properties=[];
  for(const form of data.entries.filter(e=>e.type==='form'))for(const block of form.blocks){
   const raw=data.units[block.unit_id];if(typeof raw!=='string')continue;
   const markers=[...raw.matchAll(/●\s+/g)];
   markers.forEach((m,i)=>{let end=markers[i+1]?.index??raw.length;const boundary=raw.indexOf('Мука:',m.index);if(boundary>=0&&boundary<end)end=boundary;
    const text=raw.slice(m.index+m[0].length,end).trim(),split=text.indexOf(':');if(split<0)return;
    properties.push({id:form.id+'~'+i,title:text.slice(0,split),text:text.slice(split+1).trim(),parent:form,unit:block.unit_id,high:raw.slice(0,m.index).includes('Мука:')});
   });
  }
  for(const e of data.entries.filter(e=>e.type==='form-property'))properties.push({id:e.id,title:e.title,text:e.blocks.map(b=>data.units[b.unit_id]).join('\n\n'),parent:e,unit:e.blocks[0].unit_id,high:e.property_high_only,torment:e.property_high_only?'high':'either',cost:e.property_cost,propertyHouse:e.property_house,catalogKind:'priced'});
  return properties;
 }
 function group(properties){
  const byKey=new Map(),byId=new Map(),groups=[];
  for(const p of properties){
   const key=JSON.stringify([clean(p.title),clean(p.text),!!p.high,p.parent.line,p.parent.edition,[...new Set(p.parent.source_refs.map(r=>r.source_id))].sort(),p.catalogKind==='priced'?[p.propertyHouse,p.cost,p.torment]:null]);
   let g=byKey.get(key);if(!g){g={...p,occurrences:[]};byKey.set(key,g);groups.push(g)}
   g.occurrences.push(p);byId.set(p.id,g);
  }
  return {groups,byId};
 }
 function collapseMatched(properties,index){const seen=new Set(),items=[];for(const p of properties){const g=index.byId.get(p.id);if(g&&!seen.has(g.id)){seen.add(g.id);items.push(g)}}return items}
 function tormentMatches(p,level){return !level||p.torment==='either'||(p.high?'high':'low')===level}
 function priceLabel(p){return p.catalogKind==='priced'&&Number.isFinite(p.cost)?p.cost+' БФ'+(p.high?' *':''):'Цена не указана'}
 function sortByCost(items,order){
  const direction=order==='cost-desc'?-1:1;
  return [...items].sort((a,b)=>{
   const aKnown=a.catalogKind==='priced'&&Number.isFinite(a.cost);
   const bKnown=b.catalogKind==='priced'&&Number.isFinite(b.cost);
   if(aKnown!==bKnown)return aKnown?-1:1;
   return (aKnown?direction*(a.cost-b.cost):0)||a.title.localeCompare(b.title,'ru');
  });
 }
 const api={extract,group,collapseMatched,tormentMatches,priceLabel,sortByCost};
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.DemonPropertyGroups=api;
})(typeof window==='object'?window:globalThis);
