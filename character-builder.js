(function(root){
 'use strict';
 let active=null;
 const draftKey='dtf-character-draft-v1';
 function savedDraft(storage,data){try{const text=storage?.getItem(draftKey);return text?root.DemonCharacterGenerator.restoreDraft(text,data,root.DemonAngelNames):null}catch{return null}}
 const guides=[
  ['Сначала носитель и демон','Кем человек был до вселения и чего теперь хочет падший? Начните с нескольких деталей. История помогает выбрать черты, но не создаёт дополнительных механических ограничений.'],
  ['Что даётся герою легче?','Определите приоритеты трёх групп. Одна точка в каждом Атрибуте уже есть; остальные 7 / 5 / 3 распределяются внутри групп. Подсказки раскрывают назначение каждой черты.'],
  ['Что осталось от прежней жизни?','Навык показывает выученное умение, Атрибут — возможности. Выбирайте Способности под профессию и опыт носителя. Счётчики помогут не потерять ни одной из 13 / 9 / 5 точек.'],
  ['На что можно опереться?','Связи и средства, небесные Знания и человеческие Добродетели — разные части персонажа. Основное Знание не должно уступать другим; оно определяет апокалиптический образ.'],
  ['Последние штрихи','Добавьте отличительные сильные стороны за 15 свободных очков. Начальные точки уже распределены. Расходы видны в журнале, последнюю покупку можно отменить.']
 ];
 function mount({parent,data,el,showRule,onFinish,onCancel,character=null,resume=false,storage=null,onDraftChange=()=>{}}){
  const G=root.DemonCharacterGenerator,N=root.DemonAngelNames,O=G.options(data);
  if(resume&&!active)active=savedDraft(storage,data);
  if(!resume||!active)active={c:G.startBuild(data,N,{character,seed:(Date.now()^Math.floor(Math.random()*4294967296))>>>0}),step:0,openGroups:new Set(['ability']),openDetails:new Set()};
  active.openGroups||=new Set(['ability']);active.openDetails||=new Set();const state=active,c=state.c,steps=['Замысел','Атрибуты','Способности','Преимущества','Свободные очки'];
  let draftStatus=null;
  function saveDraft(){if(active!==state||!parent.isConnected)return;try{if(!storage)throw Error('storage');storage.setItem(draftKey,G.serializeDraft(c,state.step,state.openGroups,state.openDetails));if(draftStatus)draftStatus.textContent='Черновик сохранён в этом браузере — можно продолжить после закрытия страницы.'}catch{if(draftStatus)draftStatus.textContent='Черновик доступен только в этой вкладке: браузер не разрешил сохранение.'}onDraftChange(true)}
  function clearDraft(){try{storage?.removeItem(draftKey)}catch{}onDraftChange(false)}
  const title=id=>data.entries.find(e=>e.id===id)?.title||data.lore_groups.find(g=>g.id===id)?.title||({conscience:'Совесть',conviction:'Убеждённость',courage:'Мужество',faith:'Вера',willpower:'Сила воли'})[id]||id;
  function remember(details,key){details.open=state.openDetails.has(key);details.addEventListener('toggle',()=>{if(details.isConnected){if(details.open)state.openDetails.add(key);else state.openDetails.delete(key);saveDraft()}});return details}
  function shortRule(item,parent){
   const record=data.entries.find(e=>e.id===item.id);if(!record)return;
   const details=remember(el('details','builder-inline-rule'),'rule:'+item.id);details.append(el('summary','','Назначение и условия'));
   const rows=root.DemonNoteBoard.summary(record,data);for(const row of rows.slice(0,2))details.append(el('p','',row.label+': '+row.text));
   const full=el('button','builder-rule-full','Открыть полное правило');full.type='button';full.onclick=()=>showRule(item.id);details.append(full);parent.append(details);
  }
  function draw(message=''){
   parent.replaceChildren();const heading=el('div','builder-heading');heading.append(el('p','eyebrow','ПОШАГОВАЯ СБОРКА · '+(state.step+1)+' / 5'),el('h3','',steps[state.step]));parent.append(heading);
   const progress=el('ol','builder-progress');steps.forEach((text,i)=>{const item=el('li',i===state.step?'is-current':i<state.step?'is-complete':'',text);if(i===state.step)item.setAttribute('aria-current','step');if(i<state.step){const jump=el('button','',text);jump.type='button';jump.onclick=()=>{if(state.step===4&&c.ledger.length){draw('Для возврата к начальным точкам используйте «Назад · сбросить покупки СО».');return}state.step=i;draw()};item.replaceChildren(jump)}progress.append(item)});parent.append(progress);
   const guide=el('div','builder-guide');guide.append(el('span','builder-guide-symbol','✦'),el('div','builder-guide-text'));guide.lastChild.append(el('p','eyebrow','ПОДСКАЗКА ВЕДУЩЕГО'),el('h4','',guides[state.step][0]),el('p','',guides[state.step][1]));parent.append(guide);parent.classList.add('builder-with-guide');
   const alert=el('p','builder-message',message);alert.setAttribute('role','status');parent.append(alert);
   const body=el('div','builder-body');parent.append(body);if(character&&state.step===0)body.append(el('p','builder-hint','Настраивается копия начальных точек. Свободные очки распределяются заново на последнем шаге. Прежний лист не изменится, пока сборка не завершена.'));
   function perform(action){const focusKey=document.activeElement?.dataset.builderAction;try{action();draw();if(focusKey)[...parent.querySelectorAll('[data-builder-action]')].find(n=>n.dataset.builderAction===focusKey)?.focus({preventScroll:true})}catch(e){alert.textContent=e.message}}
   function field(label,key,target=body,large=false){const wrap=el('label','character-field',label),input=el(large?'textarea':'input');input.value=c[key]||'';input.maxLength=large?5000:160;if(large)input.rows=3;input.oninput=()=>{c[key]=input.value;if(key==='name')c.nameMeaning='';saveDraft()};wrap.append(input);target.append(wrap)}
   function choose(label,items,value,change){const wrap=el('label','character-field',label),select=el('select');for(const [id,text] of items)select.append(new Option(text,id));select.dataset.builderAction='identity:'+label;select.value=value;select.onchange=()=>perform(()=>change(select.value));wrap.append(select);body.append(wrap)}
   function help(id){const button=el('button','builder-help','?');button.type='button';button.setAttribute('aria-label','Открыть правило: '+title(id));button.onclick=()=>showRule(id);return button}
   function rows(kind,entries,label,groupId){
    const section=el('section','builder-rating-group'),top=el('div','builder-group-heading');top.append(el('h4','',label));
    const budget=G.baseStatus(c,data,kind).find(g=>g.id===groupId),left=budget.budget-budget.spent;top.append(el('span',left<0?'builder-budget is-invalid':'builder-budget',budget.spent+' / '+budget.budget+' · '+(left>=0?'осталось '+left:'лишних '+(-left))));section.append(top);
    if(kind==='attribute'||kind==='ability'){
     const priority=el('select','builder-priority');priority.setAttribute('aria-label','Приоритет: '+label);for(let i=0;i<3;i++)priority.append(new Option(['Основная','Второстепенная','Третья'][i]+' · '+(kind==='attribute'?[7,5,3][i]:[13,9,5][i]),String(i)));
     priority.dataset.builderAction='priority:'+kind+':'+groupId;priority.value=String((kind==='attribute'?c.attributePriority:c.abilityPriority).indexOf(groupId));priority.onchange=()=>perform(()=>G.setPriority(c,data,kind,groupId,Number(priority.value)));section.append(priority);
    }
    const fieldName={attribute:'attributes',ability:'abilities',background:'backgrounds',lore:'lore',virtue:'virtues'}[kind];
    for(const item of entries){const row=el('div','builder-rating-row'),text=el('span','builder-rating-title',item.title),controls=el('div','builder-stepper'),minus=el('button','','−'),plus=el('button','','+'),value=c.base[fieldName][item.id];minus.type=plus.type='button';minus.dataset.builderAction=kind+':'+item.id+':minus';plus.dataset.builderAction=kind+':'+item.id+':plus';minus.setAttribute('aria-label','Уменьшить: '+item.title);plus.setAttribute('aria-label','Увеличить: '+item.title);minus.onclick=()=>perform(()=>G.setBase(c,data,kind,item.id,value-1));plus.onclick=()=>perform(()=>G.setBase(c,data,kind,item.id,value+1));controls.append(minus,el('output','',String(value)),plus);row.append(text,controls);
     if(data.entries.some(e=>e.id===item.id))row.append(help(item.id));const frame=el('div','builder-rating-frame');frame.append(row);shortRule(item,frame);section.append(frame);
    }
    body.append(section);
   }
   if(state.step===0){
    body.classList.add('builder-identity');field('Небесное имя','name');field('Имя носителя','mortalName');field('Концепция','concept');field('Группировка','faction');field('Возраст носителя · необязательно','age');field('Откуда родом · необязательно','origin');field('Занятие носителя · необязательно','profession');
    choose('Профиль для автоматического заполнения',Object.entries(G.roles).map(([id,r])=>[id,r.title]),c.answers.role,id=>{const replaceConcept=G.roles[c.answers.role]?.concepts.includes(c.concept);c.answers.role=id;c.attributePriority=[...G.roles[id].attributes];c.abilityPriority=[...G.roles[id].abilities];if(replaceConcept)c.concept=G.roles[id].concepts[0];G.resetFreebies(c,data)});
    choose('Дом',O.houses.map(h=>[h.id,h.title]),c.house,id=>G.setHouse(c,data,id));
    choose('Основное Знание',data.lore_groups.filter(g=>g.house_id===c.house).map(g=>[g.id,g.title]),c.primaryLore,id=>G.setPrimaryLore(c,data,id));
    choose('Натура',O.archetypes.map(e=>[e.id,e.title]),c.nature,id=>{c.nature=id});choose('Маска',O.archetypes.map(e=>[e.id,e.title]),c.mask,id=>{c.mask=id});
    const story=remember(el('details','builder-story-questions'),'story-questions');story.append(el('summary','','Что движет героем? · вопросы для истории'));field('Чего он добивается?','goal',story,true);field('Чего он опасается?','fear',story,true);field('Какую тайну скрывает?','secret',story,true);field('Как носитель встретился с потусторонним?','awakening',story,true);field('Краткая биография','story',story,true);body.append(story);
    const path=data.lore_groups.find(g=>g.id===c.primaryLore),form=data.entries.find(e=>e.id===c.form),preview=el('section','builder-path-preview');preview.append(el('p','eyebrow','ВЫБРАННЫЙ ПУТЬ'),el('h4','',path.title),el('p','',path.summary),el('p','builder-hint','Откройте способности до выбора точек. В готовый лист попадут только приобретённые ступени.'));
    for(const evocation of data.entries.filter(e=>e.type==='evocation'&&e.lore_id===c.primaryLore).sort((a,b)=>a.level-b.level)){
     const details=remember(el('details','builder-power-preview'),'power:'+evocation.id);details.append(el('summary','','●'.repeat(evocation.level)+' '+evocation.title));for(const row of root.DemonNoteBoard.summary(evocation,data))details.append(el('p','',row.label+': '+row.text));const open=el('button','builder-rule-full','Полное обращение');open.type='button';open.onclick=()=>showRule(evocation.id);details.append(open);preview.append(details);
    }
    const formDetail=remember(el('details','builder-power-preview'),'form:'+form.id);formDetail.append(el('summary','','Апокалиптический образ: '+form.title));for(const row of root.DemonNoteBoard.summary(form,data))formDetail.append(el('p','',row.label+': '+row.text));preview.append(formDetail);body.append(preview);
    body.append(el('p','builder-hint','Дом задаёт начальную Муку и доступные Знания. Смена Дома или основного Знания сбрасывает точки Знаний. Профиль обновляет приоритеты групп и помогает заполнению; точки можно перераспределить вручную.'));
   }
   if(state.step===1||state.step===2){
    const kind=state.step===1?'attribute':'ability',fill=el('button','builder-fill','Предложить распределение');fill.type='button';fill.onclick=()=>perform(()=>G.fillBase(c,data,kind));body.append(fill,el('p','builder-hint',state.step===1?'По 1 в каждом Атрибуте бесплатно; распределите ещё 7 / 5 / 3. Предел — 5.':'Способности начинают с 0; распределите 13 / 9 / 5. На этом шаге предел — 3.'));
    if(kind==='ability'){
     const faq=remember(el('details','builder-skill-faq'),'skill-faq');faq.append(el('summary','','Как работают проверки и отсутствие подготовки?'),el('p','','Обычно запас кубиков d10 = подходящий Атрибут + Способность. Действие и условия определяют сложность; конкретные правила могут менять запас.'),el('p','','Без Таланта бросают соответствующий Атрибут без штрафа за отсутствие подготовки. Без Навыка сложность возрастает на 1. Без Познания бросок недоступен, кроме специального разрешения Рассказчика.'),el('p','','На начальном шаге максимум 3 в Способности. Значения 4–5 можно приобрести на шаге свободных очков.'));body.append(faq);
    }
    const groups=kind==='attribute'?['Физические','Социальные','Ментальные']:['talents','skills','knowledges'];for(const id of groups)rows(kind,(kind==='attribute'?O.attributes:O.abilities).filter(e=>(kind==='attribute'?e.attribute_group:e.ability_group)===id),({talents:'Таланты',skills:'Навыки',knowledges:'Познания'})[id]||id,id);
   }
   if(state.step===3){
    const fill=el('button','builder-fill','Предложить Преимущества');fill.type='button';fill.onclick=()=>perform(()=>{for(const kind of ['background','lore','virtue'])G.fillBase(c,data,kind)});body.append(fill,el('p','builder-hint','5 точек Деталей биографии, 3 точки Знаний. Каждая Добродетель начинает с 1; добавьте ещё 3 точки. Основное Знание — не ниже остальных.'));
    rows('background',O.backgrounds,'Детали биографии','background');rows('lore',data.lore_groups.filter(g=>Object.hasOwn(c.base.lore,g.id)).map(g=>({id:g.id,title:g.title+(g.id===c.primaryLore?' ★':'')})),'Знания','lore');rows('virtue',[{id:'conscience',title:'Совесть'},{id:'conviction',title:'Убеждённость'},{id:'courage',title:'Мужество'}],'Добродетели','virtue');
   }
   if(state.step===4){
    body.append(el('p','builder-freebie-count','Осталось '+G.remainingFreebies(c)+' из 15 свободных очков'),el('p','builder-hint','На этом шаге Способности можно поднять до 4–5. При покупке Добродетелей Сила воли пересчитывается автоматически. Достоинства и Недостатки пока согласуются отдельно.'));
    const undo=el('button','','Отменить последнюю покупку');undo.type='button';undo.disabled=!c.ledger.length;undo.onclick=()=>perform(()=>G.undoPurchase(c,data));body.append(undo);
    const categories=[['attribute','Атрибуты',O.attributes,c.attributes],['ability','Способности',O.abilities,c.abilities],['background','Детали биографии',O.backgrounds,c.backgrounds],['lore','Знания',data.lore_groups.filter(g=>Object.hasOwn(c.lore,g.id)),c.lore],['virtue','Добродетели',[{id:'conscience',title:'Совесть'},{id:'conviction',title:'Убеждённость'},{id:'courage',title:'Мужество'}],c.virtues],['faith','Вера',[{id:'faith',title:'Вера'}],{faith:c.faith}],['willpower','Сила воли',[{id:'willpower',title:'Сила воли'}],{willpower:c.willpower}]];
    for(const [kind,label,entries,values] of categories){const section=el('details','builder-purchases');section.open=state.openGroups.has(kind);section.addEventListener('toggle',()=>{if(section.isConnected){if(section.open)state.openGroups.add(kind);else state.openGroups.delete(kind);saveDraft()}});section.append(el('summary','',label+' · '+G.costs[kind]+' СО / точка'));
     for(const item of entries){const row=el('div','builder-rating-row'),buy=el('button','','+1 · '+G.costs[kind]+' СО');buy.type='button';buy.dataset.builderAction='buy:'+kind+':'+item.id;buy.disabled=G.remainingFreebies(c)<G.costs[kind]||values[item.id]>=(kind==='faith'||kind==='willpower'?10:5)||(kind==='lore'&&item.id!==c.primaryLore&&values[item.id]>=c.lore[c.primaryLore]);buy.setAttribute('aria-label','Купить точку: '+item.title);buy.onclick=()=>perform(()=>G.buy(c,data,kind,item.id));row.append(el('span','builder-rating-title',item.title),el('strong','',String(values[item.id])),buy);section.append(row)}body.append(section);
    }
    if(c.ledger.length){const list=el('ol','builder-purchase-log');for(const p of c.ledger)list.append(el('li','',title(p.id)+': '+p.from+' → '+p.to+' · '+p.cost+' СО'));body.append(list)}
   }
   const nav=el('div','builder-navigation'),back=el('button','',state.step===4&&c.ledger.length?'Назад · сбросить покупки СО':'Назад'),next=el('button','character-primary',state.step===4?'Открыть готовый лист':'Далее'),cancel=el('button','','Отменить сборку');back.type=next.type=cancel.type='button';back.disabled=state.step===0;
   back.onclick=()=>{if(state.step===4)G.resetFreebies(c,data);state.step--;draw()};
   next.onclick=()=>{
    if(state.step===0&&!c.name.trim()){alert.textContent='Укажите имя персонажа.';return}
    const kinds=state.step===1?['attribute']:state.step===2?['ability']:state.step===3?['background','lore','virtue']:[];
    const unfinished=kinds.flatMap(kind=>G.baseStatus(c,data,kind).filter(s=>s.spent!==s.budget));
    if(unfinished.length){alert.textContent=unfinished.map(s=>s.label+': '+s.spent+' / '+s.budget).join('; ')+'. Распределите точки.';return}
    if(state.step===4){try{const completed=G.finishBuild(c,data);clearDraft();active=null;onFinish(completed)}catch(e){alert.textContent=e.message}return}
    state.step++;draw();parent.scrollIntoView({block:'start',behavior:'smooth'});
   };
   cancel.onclick=()=>{clearDraft();active=null;onCancel()};nav.append(back,next,cancel);parent.append(nav);draftStatus=el('p','builder-draft-status');parent.append(draftStatus);saveDraft();
  }
  draw();
 }
 root.DemonCharacterBuilder={mount,savedDraft};
})(typeof window==='object'?window:globalThis);
