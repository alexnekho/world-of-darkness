/* Ordinary newly returned Fallen, core creation only. No Earthbound or custom form rules. */
(function(root){
 'use strict';
 const prefix='dtf-classic-core-ru-';
 const roles={
  guardian:{title:'Защитник',concepts:['Пожарный, который больше не умеет проходить мимо','Охранник, давший обещание защитить чужую семью','Ветеран, ищущий дело достойнее войны'],attributes:['Физические','Ментальные','Социальные'],abilities:['talents','skills','knowledges'],skills:['brawl','dodge','athletics','alertness','firearms','melee'],stats:['stamina','dexterity','perception'],nature:['caregiver','stoic','competitor']},
  envoy:{title:'Переговорщик',concepts:['Посредник, решающий чужие конфликты','Адвокат, привыкший искать лазейку','Организатор, собирающий вокруг себя потерянных людей'],attributes:['Социальные','Ментальные','Физические'],abilities:['talents','knowledges','skills'],skills:['expression','subterfuge','empathy','leadership','etiquette','law'],stats:['charisma','manipulation','wits'],nature:['director','judge','architect']},
  scholar:{title:'Исследователь',concepts:['Следователь, столкнувшийся с невозможным делом','Исследователь забытых языков и архивов','Аналитик, обнаруживший закономерность в чужих смертях'],attributes:['Ментальные','Социальные','Физические'],abilities:['knowledges','talents','skills'],skills:['investigation','research','occult','awareness','science','computers'],stats:['intelligence','perception','wits'],nature:['visionary','perfectionist','pedagogue']},
  maker:{title:'Созидатель',concepts:['Реставратор, восстанавливающий то, что другие выбрасывают','Инженер, мечтающий закончить один невозможный проект','Мастер из маленькой мастерской, потерявший прежнюю жизнь'],attributes:['Ментальные','Физические','Социальные'],abilities:['skills','knowledges','talents'],skills:['crafts','technology','research','science','security','drive'],stats:['wits','intelligence','dexterity'],nature:['architect','perfectionist','traditionalist']},
  survivor:{title:'Следопыт',concepts:['Проводник, знающий дороги вдали от городов','Курьер, научившийся замечать опасность заранее','Беглец, пытающийся устроить жизнь под новым именем'],attributes:['Физические','Ментальные','Социальные'],abilities:['skills','talents','knowledges'],skills:['survival','stealth','alertness','streetwise','dodge','animal-ken'],stats:['perception','dexterity','stamina'],nature:['loner','rebel','daredevil']},
  performer:{title:'Вдохновитель',concepts:['Музыкант, которому доверяют больше, чем следовало бы','Актёр, начинающий путать собственные лица','Художник, ищущий образ утраченного неба'],attributes:['Социальные','Физические','Ментальные'],abilities:['skills','talents','knowledges'],skills:['performance','expression','empathy','subterfuge','etiquette','intuition'],stats:['charisma','appearance','manipulation'],nature:['bon-vivant','visionary','dandy']}
 };
 const motives={
  redemption:{title:'Искупить прошлое',faction:'Примирители',nature:['penitent','caregiver','martyr'],goal:'Помочь человеку, которого остальные уже списали со счетов.'},
  truth:{title:'Найти истину',faction:'Криптики',nature:['visionary','pedagogue','perfectionist'],goal:'Выяснить, почему в памяти о Войне остался один необъяснимый пробел.'},
  rebellion:{title:'Вернуть утраченную свободу',faction:'Люцифериане',nature:['rebel','competitor','director'],goal:'Найти союзников и перестать зависеть от воли прежних господ.'},
  influence:{title:'Изменить мир через людей',faction:'Фаустианцы',nature:['architect','director','conniver'],goal:'Создать устойчивый круг союзников среди смертных.'},
  independence:{title:'Сначала найти собственный путь',faction:'Не определился',nature:['loner','stoic','judge'],goal:'Обрести безопасное место и понять, кем стать после возвращения.'}
 };
 const hosts={
  settled:{title:'Устроенная жизнь',backgrounds:['resources','contacts','allies'],hook:'После вселения остались работа и близкие, которые замечают перемены.'},
  outsider:{title:'Жизнь на обочине',backgrounds:['contacts','allies','mentor'],hook:'Носитель оставил несколько надёжных связей, но почти никакой уверенности в завтрашнем дне.'},
  seeker:{title:'Поиск и обучение',backgrounds:['mentor','legacy','contacts'],hook:'Чужие записи и старый наставник могут объяснить, что привело носителя к последнему кризису.'},
  public:{title:'Публичная жизнь',backgrounds:['fame','influence','resources'],hook:'Человека-носителя узнают. Исчезнуть без вопросов уже не получится.'}
 };
 const masks=['stoic','bon-vivant','conformist','director','caregiver','loner','judge','dandy'];
 const themes={namaru:'fire',asharu:'life',annunaki:'stone',neberu:'fate',lammasu:'tide',rabisu:'wild',halaku:'death'};
 const ruleIds=['creation-overview','creation-attributes','creation-abilities','creation-advantages','creation-final-touches','lore-use'].map(id=>prefix+id);
 const costs={attribute:5,ability:2,lore:7,background:1,faith:6,virtue:2,willpower:1};
 function rng(seed){let a=seed>>>0;return ()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296}}
 function pick(items,random){return items[Math.floor(random()*items.length)]}
 function total(object){return Object.values(object).reduce((n,v)=>n+v,0)}
 function willpower(virtues){return Object.values(virtues).sort((a,b)=>b-a).slice(0,2).reduce((a,b)=>a+b,0)}
 function options(data){
  const attributes=data.entries.filter(e=>e.type==='trait'&&e.attribute_group&&e.id.startsWith(prefix));
  const abilities=data.entries.filter(e=>e.type==='ability'&&['talents','skills','knowledges'].includes(e.ability_group)&&e.id.startsWith(prefix)&&!['talents','skills','knowledges'].some(id=>e.id===prefix+'ability-'+id));
  const backgrounds=data.entries.filter(e=>e.type==='background'&&e.id.startsWith(prefix)&&['allies','contacts','resources','mentor','influence','fame','followers','legacy'].some(id=>e.id===prefix+'background-'+id));
  const houses=data.lore_families.filter(f=>f.house_entry).map(f=>({...f,entry:data.entries.find(e=>e.id===prefix+'house-'+f.house_entry)}));
  const archetypes=data.entries.filter(e=>e.type==='archetype'&&e.id.startsWith(prefix)&&e.id!==prefix+'archetype-overview');
  return {attributes,abilities,backgrounds,houses,archetypes};
 }
 function allocate(entries,points,start,max,weight,random,floors={}){
  const result=Object.fromEntries(entries.map(e=>[e.id,Math.max(start,floors[e.id]||0)]));
  let remaining=points-(total(result)-start*entries.length);
  if(remaining<0)throw Error('Начальные минимумы превышают бюджет.');
  while(remaining--){const pool=entries.filter(e=>result[e.id]<max),weights=pool.map(e=>Math.max(.1,weight(e))),sum=weights.reduce((a,b)=>a+b,0);let target=random()*sum;let selected=pool[pool.length-1];for(let i=0;i<pool.length;i++){target-=weights[i];if(target<0){selected=pool[i];break}}if(!selected)throw Error('Нет допустимой характеристики.');result[selected.id]++}
  return result;
 }
 function generate(data,names,{seed=Date.now()>>>0,answers={},mode='random'}={}){
  const random=rng(seed),O=options(data),answer=(key,allowed)=>allowed.includes(answers[key])?answers[key]:pick(allowed,random);
  const roleId=answer('role',Object.keys(roles)),motiveId=answer('motive',Object.keys(motives)),hostId=answer('host',Object.keys(hosts)),houseId=answer('house',O.houses.map(h=>h.id));
  const role=roles[roleId],motive=motives[motiveId],host=hosts[hostId],house=O.houses.find(h=>h.id===houseId);
  const name=names.generate({theme:themes[houseId],count:1,random})[0];
  const c={format:'dtf-character',version:1,id:'char-'+seed.toString(36)+'-'+Math.floor(random()*1e8).toString(36),seed:seed>>>0,mode,answers:{role:roleId,motive:motiveId,host:hostId,house:houseId},name:name.name,nameMeaning:name.meaning,mortalName:pick(['Алекс Морган','Никита Волков','Анна Миронова','Марк Белов','София Орлова','Даниэль Ким','Виктор Соколов','Елена Морозова','Ли Чжун','Мира Лебедева'],random),player:'',chronicle:'',concept:pick(role.concepts,random),house:houseId,houseEntry:house.entry.id,faction:motive.faction,goal:motive.goal,story:host.hook,notes:'',nature:prefix+'archetype-'+pick(motive.nature,random),mask:prefix+'archetype-'+pick(masks,random),attributePriority:[...role.attributes],abilityPriority:[...role.abilities],attributes:{},abilities:{},backgrounds:{},lore:{},virtues:{conscience:1,conviction:1,courage:1},faith:3,torment:house.entry.initial_torment,extraWillpower:0,ledger:[],merits:[],flaws:[],specializations:{},sourceRules:ruleIds};
  for(let i=0;i<3;i++){
   const entries=O.attributes.filter(e=>e.attribute_group===role.attributes[i]);const floor=houseId==='lammasu'?{[prefix+'attribute-appearance']:3}:{};
   Object.assign(c.attributes,allocate(entries,[7,5,3][i],1,5,e=>role.stats.some(id=>e.id===prefix+'attribute-'+id)?5:1,random,floor));
   const abilities=O.abilities.filter(e=>e.ability_group===role.abilities[i]);
   const signature=abilities.filter(e=>role.skills.some(id=>e.id===prefix+'ability-'+id));
   const floors=Object.fromEntries(signature.slice(0,2).map(e=>[e.id,2]));
   Object.assign(c.abilities,allocate(abilities,[13,9,5][i],0,3,e=>role.skills.some(id=>e.id===prefix+'ability-'+id)?7:1,random,floors));
  }
  const backgroundFloors=Object.fromEntries(host.backgrounds.slice(0,2).map(id=>[prefix+'background-'+id,1]));c.backgrounds=allocate(O.backgrounds,5,0,5,e=>host.backgrounds.some(id=>e.id===prefix+'background-'+id)?7:1,random,backgroundFloors);
  for(let i=0;i<3;i++)c.virtues[pick(Object.keys(c.virtues),random)]++;
  const houseLores=data.lore_groups.filter(g=>g.house_id===houseId),available=data.lore_groups.filter(g=>g.house_id===houseId||g.house_id==='common');
  c.primaryLore=pick(houseLores,random).id;c.lore=Object.fromEntries(available.map(g=>[g.id,0]));c.lore[c.primaryLore]=1;
  for(let i=0;i<2;i++){const eligible=available.filter(g=>g.id===c.primaryLore||c.lore[g.id]<c.lore[c.primaryLore]);c.lore[pick(eligible,random).id]++}
  c.base=JSON.parse(JSON.stringify({attributes:c.attributes,abilities:c.abilities,backgrounds:c.backgrounds,lore:c.lore,virtues:c.virtues,faith:c.faith}));
  let remaining=15;
  while(remaining){
   const offers=[];const offer=(kind,id,value,max,weight)=>{if(value<max&&costs[kind]<=remaining)offers.push({kind,id,from:value,to:value+1,cost:costs[kind],weight})};
   for(const e of O.attributes)offer('attribute',e.id,c.attributes[e.id],5,role.stats.some(id=>e.id===prefix+'attribute-'+id)?5:1);
   for(const e of O.abilities)offer('ability',e.id,c.abilities[e.id],5,role.skills.some(id=>e.id===prefix+'ability-'+id)?8:.5);
   for(const e of O.backgrounds)offer('background',e.id,c.backgrounds[e.id],5,host.backgrounds.some(id=>e.id===prefix+'background-'+id)?3:.3);
   for(const g of available)if(g.id===c.primaryLore||c.lore[g.id]<c.lore[c.primaryLore])offer('lore',g.id,c.lore[g.id],5,4);
   offer('faith','faith',c.faith,10,5);
   for(const id of Object.keys(c.virtues)){const next={...c.virtues,[id]:c.virtues[id]+1};if(willpower(next)+c.extraWillpower<=10)offer('virtue',id,c.virtues[id],5,2)}
   offer('willpower','willpower',willpower(c.virtues)+c.extraWillpower,10,1);
   if(!offers.length)throw Error('Не удалось распределить свободные очки.');
   let number=random()*offers.reduce((n,o)=>n+o.weight,0),chosen=offers[offers.length-1];for(const o of offers){number-=o.weight;if(number<0){chosen=o;break}}
   const {kind,id,to,cost}=chosen;
   if(kind==='faith')c.faith=to;else if(kind==='willpower')c.extraWillpower++;else c[{attribute:'attributes',ability:'abilities',background:'backgrounds',lore:'lore',virtue:'virtues'}[kind]][id]=to;
   c.ledger.push({kind,id,from:chosen.from,to,cost});remaining-=cost;
  }
  c.willpower=willpower(c.virtues)+c.extraWillpower;c.form=data.entries.find(e=>e.type==='form'&&e.lore_id===c.primaryLore).id;
  for(const e of [...O.attributes,...O.abilities])if((c.attributes[e.id]||c.abilities[e.id]||0)>=4){const block=e.blocks.find(b=>/специализац/i.test(b.label));if(block){const text=data.units[block.unit_id];if(typeof text==='string')c.specializations[e.id]=pick(text.split(/[,;\n]/).map(x=>x.trim()).filter(Boolean),random)}}
  c.reasons=[roles[roleId].title+': приоритеты '+role.attributes.join(' → ')+'.',house.title+': основное Знание '+data.lore_groups.find(g=>g.id===c.primaryLore).title+' и связанный образ.',motive.title+': предложены группировка и цель; их можно изменить.'];
  const errors=validate(c,data);if(errors.length)throw Error(errors.join('\n'));return c;
 }
 function validate(c,data){
  const errors=[],check=(test,message)=>{if(!test)errors.push(message)};
  if(!c||c.format!=='dtf-character'||c.version!==1||!c.base){return ['Неизвестный формат персонажа.']}
  if(typeof c.id!=='string'||!/^char-[a-z0-9-]+$/.test(c.id))return ['Некорректный идентификатор персонажа.'];
  if(!c.answers||!roles[c.answers.role]||!motives[c.answers.motive]||!hosts[c.answers.host])return ['Некорректный профиль персонажа.'];
  for(const field of ['age','origin','profession','fear','secret','awakening'])if(c[field]!==undefined&&(typeof c[field]!=='string'||c[field].length>10000))return ['Некорректное поле истории: '+field];
  for(const field of ['name','nameMeaning','mortalName','player','chronicle','concept','faction','goal','story','notes'])if(typeof c[field]!=='string'||c[field].length>10000)return ['Некорректное текстовое поле: '+field];
  if(!c.specializations||typeof c.specializations!=='object'||Array.isArray(c.specializations)||Object.values(c.specializations).some(v=>typeof v!=='string'||v.length>1000))return ['Некорректные специализации.'];
  if(!Array.isArray(c.reasons)||c.reasons.length>10||c.reasons.some(v=>typeof v!=='string'||v.length>2000))return ['Некорректное описание персонажа.'];
  for(const field of ['attributes','abilities','backgrounds','lore','virtues'])if(!c[field]||typeof c[field]!=='object'||Array.isArray(c[field])||!c.base[field]||typeof c.base[field]!=='object'||Array.isArray(c.base[field]))return ['Отсутствует блок характеристик: '+field];
  const O=options(data),house=O.houses.find(h=>h.id===c.house);if(!house)return ['Неизвестный Дом.'];
  check(c.houseEntry===house.entry.id,'Ссылка Дома не соответствует персонажу.');
  const numeric=(obj,entries,min,max,name)=>{if(!obj||typeof obj!=='object'){errors.push('Нет блока: '+name);return false}check(Object.keys(obj).every(id=>entries.some(e=>e.id===id)),name+': неизвестная характеристика.');for(const e of entries)check(Number.isInteger(obj[e.id])&&obj[e.id]>=min&&obj[e.id]<=max,name+': недопустимое значение '+e.title);return true};
  const fields=[['attributes',O.attributes,1,5],['abilities',O.abilities,0,5],['backgrounds',O.backgrounds,0,5]];
  for(const [field,entries,min,max] of fields){numeric(c[field],entries,min,max,field);numeric(c.base[field],entries,min,field==='abilities'?3:max,'База '+field)}
  const priorities=(value,allowed)=>Array.isArray(value)&&value.length===3&&new Set(value).size===3&&allowed.every(v=>value.includes(v));
  check(priorities(c.attributePriority,['Физические','Социальные','Ментальные']),'Некорректные приоритеты Атрибутов.');
  check(priorities(c.abilityPriority,['talents','skills','knowledges']),'Некорректные приоритеты Способностей.');
  if(errors.length)return errors;
  c.attributePriority.forEach((group,i)=>check(O.attributes.filter(e=>e.attribute_group===group).reduce((n,e)=>n+c.base.attributes[e.id]-1,0)===[7,5,3][i],'Начальные Атрибуты: требуется 7/5/3.'));
  c.abilityPriority.forEach((group,i)=>check(O.abilities.filter(e=>e.ability_group===group).reduce((n,e)=>n+c.base.abilities[e.id],0)===[13,9,5][i],'Начальные Способности: требуется 13/9/5.'));
  check(total(c.base.backgrounds)===5,'Детали биографии: требуется 5 начальных точек.');
  const virtues=['conscience','conviction','courage'].map(id=>({id,title:id}));numeric(c.virtues,virtues,1,5,'Добродетели');numeric(c.base.virtues,virtues,1,5,'База Добродетелей');check(total(c.base.virtues)===6,'Добродетели: 1 в каждой + 3 точки.');
  const lores=data.lore_groups.filter(g=>g.house_id===c.house||g.house_id==='common');numeric(c.lore,lores,0,5,'Знания');numeric(c.base.lore,lores,0,3,'База Знаний');
  check(lores.some(g=>g.id===c.primaryLore&&g.house_id===c.house),'Основное Знание должно принадлежать Дому.');check(total(c.base.lore)===3,'Знания: требуется 3 начальные точки.');
  check(c.base.lore[c.primaryLore]>=1&&Object.values(c.base.lore).every(n=>n<=c.base.lore[c.primaryLore]),'Основное Знание не может быть ниже других.');check(Object.values(c.lore).every(n=>n<=c.lore[c.primaryLore]),'Итоговое основное Знание не может быть ниже других.');
  check(c.base.faith===3&&Number.isInteger(c.faith)&&c.faith>=3&&c.faith<=10,'Начальная Вера 3; итоговая — от 3 до 10.');check(c.torment===house.entry.initial_torment,'Начальная Мука не соответствует Дому.');
  check(Number.isInteger(c.extraWillpower)&&c.extraWillpower>=0&&c.willpower===willpower(c.virtues)+c.extraWillpower&&c.willpower<=10,'Некорректная Сила воли.');
  check(data.entries.some(e=>e.type==='form'&&e.id===c.form&&e.lore_id===c.primaryLore),'Образ должен соответствовать основному Знанию.');
  check(O.archetypes.some(e=>e.id===c.nature)&&O.archetypes.some(e=>e.id===c.mask),'Неизвестные Натура или Маска.');
  if(c.house==='lammasu')check(c.base.attributes[prefix+'attribute-appearance']>=3&&c.attributes[prefix+'attribute-appearance']>=3,'У Осквернителя Внешность должна быть не ниже 3.');
  check(Array.isArray(c.merits)&&c.merits.length===0&&Array.isArray(c.flaws)&&c.flaws.length===0,'Достоинства и Недостатки в этой версии выбираются отдельно.');
  if(!Array.isArray(c.ledger))return [...errors,'Нет расчёта свободных очков.'];
  const final=JSON.parse(JSON.stringify(c.base));let wp=0,spent=0;
  for(const purchase of c.ledger){const {kind,id,from,to,cost}=purchase||{},field={attribute:'attributes',ability:'abilities',background:'backgrounds',lore:'lore',virtue:'virtues'}[kind];
   if(!Object.hasOwn(costs,kind)||cost!==costs[kind]||to!==from+1){errors.push('Некорректная покупка свободными очками.');continue}
   if(kind==='faith'){check(id==='faith'&&from===final.faith,'Расчёт Веры расходится.');final.faith=to}
   else if(kind==='willpower'){check(id==='willpower'&&from===willpower(final.virtues)+wp,'Расчёт Силы воли расходится.');wp++}
   else if(final[field]&&Object.hasOwn(final[field],id)){check(final[field][id]===from,'Расчёт покупки расходится: '+id);final[field][id]=to}
   else errors.push('Неизвестная черта в покупке.');spent+=cost;
  }
  check(spent===15,'Должны быть распределены ровно 15 свободных очков.');
  for(const field of ['attributes','abilities','backgrounds','lore','virtues'])check(Object.keys(c[field]).every(id=>c[field][id]===final[field][id]),'Итог не совпадает с расчётом: '+field);
  check(c.faith===final.faith&&c.extraWillpower===wp,'Итог Веры / Силы воли не совпадает с расчётом.');
  return errors;
 }
 function resetFreebies(c,data){
  for(const field of ['attributes','abilities','backgrounds','lore','virtues'])c[field]=JSON.parse(JSON.stringify(c.base[field]));
  c.faith=c.base.faith;c.extraWillpower=0;c.ledger=[];c.willpower=willpower(c.virtues);
  c.form=data.entries.find(e=>e.type==='form'&&e.lore_id===c.primaryLore)?.id||'';return c;
 }
 function startBuild(data,names,{seed=Date.now()>>>0,character=null,answers={}}={}){
  const c=character?JSON.parse(JSON.stringify(character)):generate(data,names,{seed,answers,mode:'manual'});
  if(!character){
   for(const id of Object.keys(c.base.attributes))c.base.attributes[id]=1;
   if(c.house==='lammasu')c.base.attributes[prefix+'attribute-appearance']=3;
   for(const id of Object.keys(c.base.abilities))c.base.abilities[id]=0;
   for(const id of Object.keys(c.base.backgrounds))c.base.backgrounds[id]=0;
   for(const id of Object.keys(c.base.lore))c.base.lore[id]=id===c.primaryLore?1:0;
   c.base.virtues={conscience:1,conviction:1,courage:1};
  }
  c.mode='manual';c.specializations={};return resetFreebies(c,data);
 }
 function baseStatus(c,data,kind){
  const O=options(data);
  if(kind==='attribute')return c.attributePriority.map((id,i)=>({id,label:id,spent:O.attributes.filter(e=>e.attribute_group===id).reduce((n,e)=>n+c.base.attributes[e.id]-1,0),budget:[7,5,3][i]}));
  if(kind==='ability')return c.abilityPriority.map((id,i)=>({id,label:({talents:'Таланты',skills:'Навыки',knowledges:'Познания'})[id],spent:O.abilities.filter(e=>e.ability_group===id).reduce((n,e)=>n+c.base.abilities[e.id],0),budget:[13,9,5][i]}));
  if(kind==='background')return [{id:'background',label:'Детали биографии',spent:total(c.base.backgrounds),budget:5}];
  if(kind==='lore')return [{id:'lore',label:'Знания',spent:total(c.base.lore),budget:3}];
  if(kind==='virtue')return [{id:'virtue',label:'Добродетели',spent:total(c.base.virtues)-3,budget:3}];
  return [];
 }
 function baseErrors(c,data){return ['attribute','ability','background','lore','virtue'].flatMap(kind=>baseStatus(c,data,kind).filter(g=>g.spent!==g.budget).map(g=>g.label+': распределено '+g.spent+' из '+g.budget+'.'))}
 function setBase(c,data,kind,id,value){
  const O=options(data),field={attribute:'attributes',ability:'abilities',background:'backgrounds',lore:'lore',virtue:'virtues'}[kind];
  if(!field||!Object.hasOwn(c.base[field],id))throw Error('Неизвестная характеристика.');
  const min=kind==='attribute'||kind==='virtue'?1:0,max=kind==='ability'||kind==='lore'?3:5,old=c.base[field][id];
  if(!Number.isInteger(value)||value<min||value>max)throw Error('Допустимое значение: '+min+'–'+max+'.');
  if(c.house==='lammasu'&&id===prefix+'attribute-appearance'&&value<3)throw Error('У Осквернителя Внешность не ниже 3.');
  const group=kind==='attribute'?O.attributes.find(e=>e.id===id)?.attribute_group:kind==='ability'?O.abilities.find(e=>e.id===id)?.ability_group:kind;
  const status=baseStatus(c,data,kind).find(s=>s.id===group);
  if(value>old&&status&&status.spent+value-old>status.budget)throw Error('В этой группе больше нет начальных точек.');
  if(kind==='lore'){
   if(id===c.primaryLore&&(value<1||Object.entries(c.base.lore).some(([other,v])=>other!==id&&v>value)))throw Error('Основное Знание не ниже 1 и не ниже остальных.');
   if(id!==c.primaryLore&&value>c.base.lore[c.primaryLore])throw Error('Знание не может быть выше основного.');
  }
  c.base[field][id]=value;c.specializations={};return resetFreebies(c,data);
 }
 function setPriority(c,data,kind,group,index){
  const array=kind==='attribute'?c.attributePriority:kind==='ability'?c.abilityPriority:null;
  if(!array||!array.includes(group)||![0,1,2].includes(index))throw Error('Неизвестный приоритет.');
  const from=array.indexOf(group);[array[from],array[index]]=[array[index],array[from]];return resetFreebies(c,data);
 }
 function setHouse(c,data,id){
  const house=options(data).houses.find(h=>h.id===id);if(!house)throw Error('Неизвестный Дом.');
  c.house=id;c.houseEntry=house.entry.id;c.torment=house.entry.initial_torment;c.answers.house=id;
  const paths=data.lore_groups.filter(g=>g.house_id===id||g.house_id==='common');c.primaryLore=paths.find(g=>g.house_id===id).id;
  c.base.lore=Object.fromEntries(paths.map(g=>[g.id,g.id===c.primaryLore?1:0]));
  if(id==='lammasu')c.base.attributes[prefix+'attribute-appearance']=Math.max(3,c.base.attributes[prefix+'attribute-appearance']);
  return resetFreebies(c,data);
 }
 function setPrimaryLore(c,data,id){
  if(!data.lore_groups.some(g=>g.id===id&&g.house_id===c.house))throw Error('Основное Знание выбирается из трёх Знаний Дома.');
  c.primaryLore=id;c.base.lore=Object.fromEntries(Object.keys(c.base.lore).map(key=>[key,key===id?1:0]));return resetFreebies(c,data);
 }
 function fillBase(c,data,kind){
  const O=options(data),random=rng((c.seed+total(c.base.attributes)+total(c.base.abilities)+Object.values(c.base.backgrounds).join('').length)>>>0),role=roles[c.answers.role]||roles.scholar,host=hosts[c.answers.host]||hosts.settled;
  if(kind==='attribute')for(let i=0;i<3;i++){const entries=O.attributes.filter(e=>e.attribute_group===c.attributePriority[i]);Object.assign(c.base.attributes,allocate(entries,[7,5,3][i],1,5,e=>role.stats.some(id=>e.id===prefix+'attribute-'+id)?5:1,random,c.house==='lammasu'?{[prefix+'attribute-appearance']:3}:{}))}
  if(kind==='ability')for(let i=0;i<3;i++){const entries=O.abilities.filter(e=>e.ability_group===c.abilityPriority[i]);Object.assign(c.base.abilities,allocate(entries,[13,9,5][i],0,3,e=>role.skills.some(id=>e.id===prefix+'ability-'+id)?7:1,random))}
  if(kind==='background')c.base.backgrounds=allocate(O.backgrounds,5,0,5,e=>host.backgrounds.some(id=>e.id===prefix+'background-'+id)?7:1,random,Object.fromEntries(host.backgrounds.slice(0,2).map(id=>[prefix+'background-'+id,1])));
  if(kind==='virtue'){c.base.virtues={conscience:1,conviction:1,courage:1};for(let i=0;i<3;i++)c.base.virtues[pick(Object.keys(c.base.virtues),random)]++}
  if(kind==='lore'){for(const id of Object.keys(c.base.lore))c.base.lore[id]=id===c.primaryLore?1:0;for(let i=0;i<2;i++){const eligible=Object.keys(c.base.lore).filter(id=>id===c.primaryLore||c.base.lore[id]<c.base.lore[c.primaryLore]);c.base.lore[pick(eligible,random)]++}}
  c.specializations={};return resetFreebies(c,data);
 }
 function remainingFreebies(c){return 15-c.ledger.reduce((sum,p)=>sum+p.cost,0)}
 function buy(c,data,kind,id){
  const errors=baseErrors(c,data);if(errors.length)throw Error(errors[0]);
  if(!Object.hasOwn(costs,kind))throw Error('Неизвестная покупка.');if(remainingFreebies(c)<costs[kind])throw Error('Недостаточно свободных очков.');
  const field={attribute:'attributes',ability:'abilities',background:'backgrounds',lore:'lore',virtue:'virtues'}[kind];
  const from=kind==='faith'?c.faith:kind==='willpower'?c.willpower:field&&Object.hasOwn(c[field],id)?c[field][id]:undefined;
  if(!Number.isInteger(from)||from>=(kind==='faith'||kind==='willpower'?10:5))throw Error('Достигнут максимум или неизвестная характеристика.');
  if((kind==='faith'&&id!=='faith')||(kind==='willpower'&&id!=='willpower'))throw Error('Неизвестная характеристика.');
  if(kind==='lore'&&id!==c.primaryLore&&from>=c.lore[c.primaryLore])throw Error('Знание не может стать выше основного.');
  if(kind==='virtue'&&willpower({...c.virtues,[id]:from+1})+c.extraWillpower>10)throw Error('Сила воли превысит 10.');
  if(kind==='faith')c.faith++;else if(kind==='willpower')c.extraWillpower++;else c[field][id]++;
  c.ledger.push({kind,id,from,to:from+1,cost:costs[kind]});c.willpower=willpower(c.virtues)+c.extraWillpower;return c;
 }
 function undoPurchase(c,data){const keep=c.ledger.slice(0,-1);resetFreebies(c,data);for(const p of keep)buy(c,data,p.kind,p.id);return c}
 function finishBuild(c,data){
  const out=JSON.parse(JSON.stringify(c)),O=options(data),random=rng(c.seed);out.specializations={};
  for(const e of [...O.attributes,...O.abilities])if((out.attributes[e.id]||out.abilities[e.id]||0)>=4){const block=e.blocks.find(b=>/специализац/i.test(b.label));const text=block&&data.units[block.unit_id];if(typeof text==='string')out.specializations[e.id]=pick(text.split(/[,;\n]/).map(s=>s.trim()).filter(Boolean),random)}
  out.reasons=['Собран вручную: начальные бюджеты и 15 свободных очков проверены.','Основное Знание определяет апокалиптический образ.'];const errors=validate(out,data);if(errors.length)throw Error(errors[0]);return out;
 }
 function serializeDraft(c,step,openGroups=[],openDetails=[]){return JSON.stringify({format:'dtf-character-draft',version:1,step,character:c,openGroups:[...openGroups],openDetails:[...openDetails]})}
 function restoreDraft(text,data,names){
  if(typeof text!=='string'||text.length>1000000)throw Error('Неверный размер черновика.');
  const raw=JSON.parse(text),old=raw.character;
  if(raw.format!=='dtf-character-draft'||raw.version!==1||!Number.isInteger(raw.step)||raw.step<0||raw.step>4||!old)throw Error('Неизвестный формат черновика.');
  const O=options(data),house=O.houses.find(h=>h.id===old.house);
  if(!house||!old.answers||!roles[old.answers.role]||!motives[old.answers.motive]||!hosts[old.answers.host]||typeof old.id!=='string'||!/^char-[a-z0-9-]+$/.test(old.id))throw Error('Некорректная основа черновика.');
  if(!Number.isInteger(old.seed)||old.seed<0||old.seed>4294967295)throw Error('Некорректное зерно генерации.');
  const c=generate(data,names,{seed:old.seed,answers:{...old.answers,house:old.house},mode:'manual'});c.id=old.id;
  for(const field of ['name','nameMeaning','mortalName','player','chronicle','concept','faction','goal','story','notes','age','origin','profession','fear','secret','awakening']){
   if(old[field]!==undefined&&(typeof old[field]!=='string'||old[field].length>10000))throw Error('Некорректное поле черновика: '+field);c[field]=old[field]||'';
  }
  for(const field of ['nature','mask']){if(!O.archetypes.some(e=>e.id===old[field]))throw Error('Неизвестный Архетип.');c[field]=old[field]}
  for(const [field,allowed] of [['attributePriority',['Физические','Социальные','Ментальные']],['abilityPriority',['talents','skills','knowledges']]]){
   if(!Array.isArray(old[field])||old[field].length!==3||new Set(old[field]).size!==3||!allowed.every(v=>old[field].includes(v)))throw Error('Некорректные приоритеты.');c[field]=[...old[field]];
  }
  if(!data.lore_groups.some(g=>g.id===old.primaryLore&&g.house_id===c.house))throw Error('Некорректное основное Знание.');c.primaryLore=old.primaryLore;
  const ids={attributes:O.attributes.map(e=>e.id),abilities:O.abilities.map(e=>e.id),backgrounds:O.backgrounds.map(e=>e.id),lore:data.lore_groups.filter(g=>g.house_id===c.house||g.house_id==='common').map(g=>g.id),virtues:['conscience','conviction','courage']};
  if(!old.base||old.base.faith!==3)throw Error('Некорректная начальная Вера.');c.base={faith:3};
  for(const [field,allowed] of Object.entries(ids)){
   const values=old.base[field],min=field==='attributes'||field==='virtues'?1:0,max=field==='abilities'||field==='lore'?3:5;
   if(!values||typeof values!=='object'||Array.isArray(values)||Object.keys(values).length!==allowed.length||Object.keys(values).some(id=>!allowed.includes(id))||allowed.some(id=>!Number.isInteger(values[id])||values[id]<min||values[id]>max))throw Error('Некорректный блок черновика: '+field);
   c.base[field]={...values};
  }
  if(c.house==='lammasu'&&c.base.attributes[prefix+'attribute-appearance']<3)throw Error('Внешность Осквернителя ниже 3.');
  if(total(c.base.backgrounds)>5||total(c.base.virtues)>6||total(c.base.lore)>3||c.base.lore[c.primaryLore]<1||Object.values(c.base.lore).some(v=>v>c.base.lore[c.primaryLore]))throw Error('Превышен начальный бюджет черновика.');
  resetFreebies(c,data);c.specializations={};
  if(!Array.isArray(old.ledger)||old.ledger.length>15)throw Error('Некорректные покупки черновика.');
  for(const purchase of old.ledger){if(!purchase||typeof purchase!=='object')throw Error('Некорректная покупка.');buy(c,data,purchase.kind,purchase.id);const actual=c.ledger[c.ledger.length-1];if(['kind','id','from','to','cost'].some(k=>actual[k]!==purchase[k]))throw Error('Расчёт покупки черновика не совпадает.');}
  return {c,step:raw.step,openGroups:new Set(Array.isArray(raw.openGroups)?raw.openGroups.filter(id=>Object.hasOwn(costs,id)):['ability']),openDetails:new Set(Array.isArray(raw.openDetails)?raw.openDetails.filter(id=>typeof id==='string'&&id.length<160).slice(0,100):[])};
 }
 function createStore(storage,data){
  const key='dtf-characters-v1';let records=[],persistent=Boolean(storage),readable=true;
  try{const raw=storage?.getItem(key);if(raw){const parsed=JSON.parse(raw);if(parsed?.version!==1||!Array.isArray(parsed.characters))throw Error('Формат сохранений не поддерживается.');records=parsed.characters.filter(c=>{try{return !validate(c,data).length}catch{return false}})}}catch{readable=false;persistent=false}
  const clone=c=>JSON.parse(JSON.stringify(c));
  return {
   list:()=>records.map(clone),persistent:()=>persistent,
   save(c){const errors=validate(c,data);if(errors.length)throw Error(errors[0]);if(!readable)throw Error('Не удалось прочитать прежние сохранения; они оставлены без изменений.');if(!records.some(x=>x.id===c.id)&&records.length>=40)throw Error('Сохранено 40 персонажей. Экспортируйте и удалите ненужный лист.');records=[clone(c),...records.filter(x=>x.id!==c.id)];if(storage)try{storage.setItem(key,JSON.stringify({version:1,characters:records}));persistent=true}catch{persistent=false}return persistent},
   remove(id){if(!readable)return false;records=records.filter(c=>c.id!==id);if(storage)try{storage.setItem(key,JSON.stringify({version:1,characters:records}))}catch{persistent=false}return true}
  };
 }
 function importCharacter(text,data){
  if(typeof text!=='string'||text.length>1000000)throw Error('Файл персонажа слишком большой.');
  const c=JSON.parse(text),errors=validate(c,data);if(errors.length)throw Error(errors[0]);
  for(const key of ['name','nameMeaning','mortalName','player','chronicle','concept','faction','goal','story','notes'])if(c[key]!==undefined&&typeof c[key]!=='string')throw Error('Некорректное текстовое поле: '+key);
  if(typeof c.id!=='string'||!/^char-[a-z0-9-]+$/.test(c.id))throw Error('Некорректный идентификатор персонажа.');
  return c;
 }
 const api={roles,motives,hosts,costs,ruleIds,options,generate,validate,createStore,importCharacter,startBuild,baseStatus,baseErrors,setBase,setPriority,setHouse,setPrimaryLore,fillBase,remainingFreebies,buy,undoPurchase,resetFreebies,finishBuild,serializeDraft,restoreDraft};if(typeof module==='object'&&module.exports)module.exports=api;else root.DemonCharacterGenerator=api;
})(typeof window==='object'?window:globalThis);
