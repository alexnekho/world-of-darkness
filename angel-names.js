/* Fictional naming patterns are editorial game material, not Hebrew translations. */
(function(root){
 'use strict';
 const themes=[
  {id:'light',title:'Свет и звёзды',roots:[['Аур','Aur','рассвета'],['Сэф','Sef','первых звёзд'],['Люмар','Lumar','немеркнущего света'],['Орэ','Ore','небесного сияния'],['Вэлар','Velar','утренней зари']]},
  {id:'fire',title:'Пламя и воля',roots:[['Азар','Azar','священного пламени'],['Фэр','Fer','несломленной воли'],['Кэдар','Kedar','тлеющих углей'],['Ифар','Ifar','последней искры'],['Эшар','Eshar','огненного венца']]},
  {id:'wind',title:'Ветер и небеса',roots:[['Аэр','Aer','высокого неба'],['Саэр','Saer','вольного ветра'],['Ваэр','Vaer','далёкого грома'],['Нэф','Nef','тихого дыхания'],['Тэлар','Telar','облачных врат']]},
  {id:'stone',title:'Камень и созидание',roots:[['Ардан','Ardan','вечного камня'],['Кэран','Keran','первой кузни'],['Тар','Tar','оснований мира'],['Дэрам','Deram','сокрытых сводов'],['Орт','Ort','нерушимого порога']]},
  {id:'tide',title:'Вода и глубина',roots:[['Наэр','Naer','безмолвных глубин'],['Лиор','Lior','лунного прилива'],['Мэар','Mear','дальнего берега'],['Умар','Umar','подземных вод'],['Тэнир','Tenir','невидимых течений']]},
  {id:'fate',title:'Судьба и тайны',roots:[['Нэвар','Nevar','непройденных дорог'],['Сафар','Safar','сокрытых знамений'],['Эйран','Eiran','ненаписанных судеб'],['Вэнир','Venir','неизбежного часа'],['Ортан','Ortan','разомкнутого круга']]},
  {id:'life',title:'Жизнь и исцеление',roots:[['Раэн','Raen','новой жизни'],['Вэсан','Vesan','весеннего пробуждения'],['Лэвар','Levar','живого дыхания'],['Энар','Enar','исцелённых ран'],['Нафир','Nafir','первого ростка']]},
  {id:'wild',title:'Зверь и дикая природа',roots:[['Равар','Ravar','дикой чащи'],['Амар','Amar','древнего леса'],['Кэвар','Kevar','неукротимого зверя'],['Тэран','Teran','лунной охоты'],['Вар','Var','нетронутой земли']]},
  {id:'death',title:'Сумерки и покой',roots:[['Мора','Mora','последнего порога'],['Сэвар','Sevar','вечного покоя'],['Эйр','Eir','забытых могил'],['Нэрам','Neram','безмолвных душ'],['Кэйл','Keil','сумеречной завесы']]},
  {id:'memory',title:'Память и клятвы',roots:[['Зэфар','Zefar','утраченной памяти'],['Сэнир','Senir','нерушимых клятв'],['Вэрам','Veram','несказанных слов'],['Илар','Ilar','забытого имени'],['Орэйн','Orein','последнего обещания']]}
 ];
 // Meanings below are explicitly assigned by this fictional naming system.
 const endings=[
  {sound:'иэль',latin:'iel',role:'Хранитель'},
  {sound:'аэль',latin:'ael',role:'Вестник'},
  {sound:'иил',latin:'iil',role:'Страж'},
  {sound:'эль',latin:'el',role:'Свидетель'},
  {sound:'аил',latin:'ail',role:'Певец'},
  {sound:'ион',latin:'ion',role:'Проводник'},
  {sound:'иан',latin:'ian',role:'Искатель'},
  {sound:'еон',latin:'eon',role:'Служитель'},
  {sound:'риэль',latin:'riel',role:'Защитник'},
  {sound:'тиэль',latin:'tiel',role:'Глашатай'}
 ];
 const source={title:'NJOP — Angel Names',url:'https://njop.org/angel-names/'};
 const traditional=[
  {id:'michael',name:'Михаил',latin:'Michael',meaning:'Кто подобен Богу?',kind:'traditional',theme:'Известное имя',source},
  {id:'gabriel',name:'Гавриил',latin:'Gabriel',meaning:'Моя сила — Бог.',kind:'traditional',theme:'Известное имя',source},
  {id:'uriel',name:'Уриил',latin:'Uriel',meaning:'Бог — мой свет.',kind:'traditional',theme:'Известное имя',source},
  {id:'raphael',name:'Рафаил',latin:'Raphael',meaning:'Бог — мой целитель.',kind:'traditional',theme:'Известное имя',source}
 ];
 function pool(theme='any'){
  const selected=theme==='any'?themes:themes.filter(t=>t.id===theme);
  return selected.flatMap(t=>t.roots.flatMap(([stem,latin,domain],index)=>endings.map((end,i)=>({
   id:t.id+'-'+index+'-'+i,name:stem+end.sound,latin:latin+end.latin,
   meaning:end.role+' '+domain,kind:'generated',theme:t.title,themeId:t.id,
   parts:[{sound:stem,meaning:'образ '+domain},{sound:end.sound,meaning:'роль: '+end.role.toLowerCase()}]
  }))));
 }
 function generate({theme='any',count=6,exclude=[],random=Math.random}={}){
  const all=pool(theme),seen=new Set(exclude),fresh=all.filter(n=>!seen.has(n.id));
  const candidates=fresh.length>=Math.min(count,all.length)?fresh:all;
  for(let i=candidates.length-1;i>0;i--){const value=random(),j=Math.floor(Math.max(0,Math.min(.999999999999,Number.isFinite(value)?value:0))*(i+1));[candidates[i],candidates[j]]=[candidates[j],candidates[i]]}
  return candidates.slice(0,Math.max(0,Math.min(50,Number.isFinite(count)?Math.floor(count):6)));
 }
 function describe(item){
  const lines=[item.name+' / '+item.latin,item.meaning];
  if(item.kind==='generated')lines.push('Игровое имя. Авторская расшифровка, не перевод с древнего языка.',...item.parts.map(p=>p.sound+' — '+p.meaning));
  else lines.push('Известное имя; передача значения: '+item.source.title,item.source.url);
  return lines.join('\n');
 }
 const api={themes:themes.map(t=>({id:t.id,title:t.title})),traditional,pool,generate,describe};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DemonAngelNames=api;
})(typeof window==='object'?window:globalThis);
