(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory;
 else root.createDemonReaderState=factory;
})(typeof globalThis!=='undefined'?globalThis:this,function(validIds,storage){
 'use strict';
 const allowed=new Set(validIds),key='dtf-reader-v1';let persistent=Boolean(storage),state={v:1,bookmarks:[],recent:[],bookmarkView:'cards',expandedBookmarks:[],notes:{},positions:{},sizes:{}};
 const colors=new Set(['paper','sage','rose','blue']);state.scrolls={};
 const clean=items=>Array.isArray(items)?[...new Set(items.filter(id=>typeof id==='string'&&allowed.has(id)))]:[];
 try{const raw=storage&&storage.getItem(key);if(raw){const parsed=JSON.parse(raw);if(parsed&&parsed.v===1){
  if(parsed.notes&&typeof parsed.notes==='object')for(const [id,n] of Object.entries(parsed.notes)){
   if(!n||typeof n!=='object'||(!allowed.has(id)&&!/^note-[a-z0-9-]+$/.test(id)))continue;
   if(id.startsWith('note-'))allowed.add(id);
   state.notes[id]={title:typeof n.title==='string'?n.title.slice(0,160):'',text:typeof n.text==='string'?n.text.slice(0,12000):'',color:colors.has(n.color)?n.color:'paper'};
  }
  if(parsed.positions&&typeof parsed.positions==='object')for(const [id,p] of Object.entries(parsed.positions)){
   if(allowed.has(id)&&p&&Number.isFinite(p.x)&&Number.isFinite(p.y))state.positions[id]={x:Math.max(0,Math.min(16000,p.x)),y:Math.max(0,Math.min(16000,p.y)),z:Number.isFinite(p.z)?Math.max(0,Math.min(100000,p.z)):0};
  }
  if(parsed.sizes&&typeof parsed.sizes==='object')for(const [id,size] of Object.entries(parsed.sizes)){
   if(allowed.has(id)&&size&&Number.isFinite(size.width)&&Number.isFinite(size.height))state.sizes[id]={width:Math.round(Math.max(200,Math.min(1000,size.width))),height:Math.round(Math.max(160,Math.min(1400,size.height)))};
  }
  if(parsed.scrolls&&typeof parsed.scrolls==='object')for(const [id,top] of Object.entries(parsed.scrolls))if(allowed.has(id)&&Number.isFinite(top))state.scrolls[id]=Math.max(0,Math.min(1000000,top));
  state.bookmarks=clean(parsed.bookmarks);state.recent=clean(parsed.recent).slice(0,5);state.bookmarkView=['list','grid'].includes(parsed.bookmarkView)?parsed.bookmarkView:'cards';state.expandedBookmarks=clean(parsed.expandedBookmarks).filter(id=>state.bookmarks.includes(id))
 }}}catch{}
 const save=()=>{if(storage)try{storage.setItem(key,JSON.stringify(state))}catch{persistent=false}};
 return {
  has:id=>state.bookmarks.includes(id),
  bookmarks:()=>state.bookmarks.slice(),recent:()=>state.recent.slice(),
  scroll:id=>state.scrolls[id]||0,
  setScroll(id,top){if(!allowed.has(id)||!Number.isFinite(top))return;state.scrolls[id]=Math.max(0,Math.min(1000000,top));save()},
  size(id){return Object.hasOwn(state.sizes,id)?{...state.sizes[id]}:null},
  setSize(id,size){if(!allowed.has(id)||!Number.isFinite(size.width)||!Number.isFinite(size.height))return;state.sizes[id]={width:Math.round(Math.max(200,Math.min(1000,size.width))),height:Math.round(Math.max(160,Math.min(1400,size.height)))};save()},
  position(id){return Object.hasOwn(state.positions,id)?{...state.positions[id]}:null},
  setPosition(id,p){if(!allowed.has(id)||!Number.isFinite(p.x)||!Number.isFinite(p.y))return;state.positions[id]={x:Math.max(0,Math.min(16000,p.x)),y:Math.max(0,Math.min(16000,p.y)),z:Number.isFinite(p.z)?Math.max(0,Math.min(100000,p.z)):0};save()},
  resetPositions(){state.positions={};save()},
  note(id){return Object.hasOwn(state.notes,id)?{...state.notes[id]}:null},
  saveNote(id,n){if(!allowed.has(id))return;state.notes[id]={title:String(n.title||'').trim().slice(0,160),text:String(n.text||'').slice(0,12000),color:colors.has(n.color)?n.color:'paper'};save()},
  createNote(n){const id='note-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);allowed.add(id);state.bookmarks.push(id);this.saveNote(id,n);return id},
  removeNote(id){if(!id.startsWith('note-'))return;state.bookmarks=state.bookmarks.filter(x=>x!==id);state.expandedBookmarks=state.expandedBookmarks.filter(x=>x!==id);delete state.notes[id];delete state.scrolls[id];allowed.delete(id);save()},
  toggle(id){if(!allowed.has(id))return false;const i=state.bookmarks.indexOf(id);if(i<0)state.bookmarks.push(id);else{state.bookmarks.splice(i,1);state.expandedBookmarks=state.expandedBookmarks.filter(item=>item!==id)}save();return state.bookmarks.includes(id)},
  bookmarkView:()=>state.bookmarkView,
  setBookmarkView(value){state.bookmarkView=['list','grid'].includes(value)?value:'cards';save()},
  isExpanded:id=>state.expandedBookmarks.includes(id),
  setExpanded(id,open){if(!state.bookmarks.includes(id)||state.expandedBookmarks.includes(id)===open)return;state.expandedBookmarks=open?[...state.expandedBookmarks,id]:state.expandedBookmarks.filter(item=>item!==id);save()},
  moveBefore(id,beforeId){if(!state.bookmarks.includes(id)||id===beforeId||(beforeId!==null&&!state.bookmarks.includes(beforeId)))return;state.bookmarks=state.bookmarks.filter(item=>item!==id);const index=beforeId===null?state.bookmarks.length:state.bookmarks.indexOf(beforeId);state.bookmarks.splice(index,0,id);save()},
  visit(id){if(!allowed.has(id))return;state.recent=[id,...state.recent.filter(x=>x!==id)].slice(0,5);save()},
  canPersist:()=>persistent
 };
});
