/* Display helpers only. Full rules and source text are never changed. */
(function(root){
 'use strict';
 function summary(item,data,catalog=root.DEMON_NOTE_SUMMARIES){
  const record=catalog?.entries?.[item.id];
  if(record?.rows?.length)return record.rows.map(row=>({label:row.label,text:row.text}));
  return [{label:'Памятка',text:'Краткая сводка для этой записи недоступна. Откройте полное правило.'}];
 }
 function defaultPosition(index,width){const columns=Math.max(1,Math.floor((width+16)/276));return {x:(index%columns)*276,y:Math.floor(index/columns)*326,z:0}}
 function boundedPosition(p,width,height,cardWidth=260){return {x:Math.round(Math.max(0,Math.min(Math.max(0,width-cardWidth),p.x))),y:Math.round(Math.max(0,Math.min(Math.max(0,16000-height),p.y))),z:p.z||0}}
 function resizeRect(rect,edge,dx,dy,canvasWidth){
  let x=rect.x,y=rect.y,width=rect.width,height=rect.height;
  if(edge.includes('e'))width=Math.max(200,Math.min(1000,canvasWidth-x,rect.width+dx));
  if(edge.includes('s'))height=Math.max(160,Math.min(1400,16000-y,rect.height+dy));
  if(edge.includes('w')){width=Math.max(200,Math.min(1000,rect.x+rect.width,rect.width-dx));x=rect.x+rect.width-width}
  if(edge.includes('n')){height=Math.max(160,Math.min(1400,rect.y+rect.height,rect.height-dy));y=rect.y+rect.height-height}
  return {x:Math.round(x),y:Math.round(y),width:Math.round(width),height:Math.round(height),z:rect.z||0};
 }
 const api={summary,defaultPosition,boundedPosition,resizeRect};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DemonNoteBoard=api;
})(typeof window==='object'?window:globalThis);
