(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory;
 else root.createDemonReaderState=factory;
})(typeof globalThis!=='undefined'?globalThis:this,function(validIds,storage){
 'use strict';
 const allowed=new Set(validIds),key='dtf-reader-v1';let persistent=Boolean(storage),state={v:1,bookmarks:[],recent:[]};
 const clean=items=>Array.isArray(items)?[...new Set(items.filter(id=>typeof id==='string'&&allowed.has(id)))]:[];
 try{const raw=storage&&storage.getItem(key);if(raw){const parsed=JSON.parse(raw);if(parsed&&parsed.v===1){state.bookmarks=clean(parsed.bookmarks);state.recent=clean(parsed.recent).slice(0,5)}}}catch{}
 const save=()=>{if(storage)try{storage.setItem(key,JSON.stringify(state))}catch{persistent=false}};
 return {
  has:id=>state.bookmarks.includes(id),
  bookmarks:()=>state.bookmarks.slice(),recent:()=>state.recent.slice(),
  toggle(id){if(!allowed.has(id))return false;const i=state.bookmarks.indexOf(id);if(i<0)state.bookmarks.push(id);else state.bookmarks.splice(i,1);save();return state.bookmarks.includes(id)},
  visit(id){if(!allowed.has(id))return;state.recent=[id,...state.recent.filter(x=>x!==id)].slice(0,5);save()},
  canPersist:()=>persistent
 };
});
