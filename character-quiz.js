/* Original roleplaying situations; recommendations are editorial, not a personality test. */
(function(root){
 'use strict';
 const q=(id,title,scene,answers)=>({id,title,scene,answers:answers.map(([id,text,weights,reason])=>({id,text,weights,reason}))});
 const questions=[
  q('stranger','Чужая беда','Незнакомец просит укрыть его на ночь. За ним идут люди, которых он боится. Времени на долгий разговор нет.',[
   ['shelter','Впущу. Сначала обеспечу безопасность, потом разберусь.',{house:{asharu:2},role:{guardian:4},motive:{redemption:2}},'Сначала защищает уязвимого, даже без полной информации.'],
   ['investigate','Потребую рассказать, кто его преследует и почему.',{house:{neberu:2},role:{scholar:4},motive:{truth:2}},'Предпочитает разобраться в причине происходящего.'],
   ['bargain','Помогу, но договорюсь о встречной услуге.',{house:{namaru:2},role:{envoy:4},motive:{influence:2}},'Видит в помощи начало отношений и взаимных обязательств.'],
   ['route','Покажу безопасный выход и уведу преследователей по ложному следу.',{house:{rabisu:2},role:{survivor:4},motive:{independence:2}},'Предпочитает обходить угрозу и сохранять свободу действий.']]),
  q('memory','Обрывок неба','Из прошлого возвращается одно отчётливое воспоминание. Какое вы оставите герою?',[
   ['forge','Момент, когда нечто впервые обрело форму в моих руках.',{house:{annunaki:4},role:{maker:3}},'С прошлым связывает прежде всего созидание.'],
   ['horizon','Небо над ещё нетронутой землёй и бесконечное движение жизни.',{house:{asharu:2,rabisu:2},role:{survivor:2}},'Хранит образ свободной и живой природы.'],
   ['voice','Тишину, в которой можно было услышать чужую душу.',{house:{halaku:4},role:{scholar:1},motive:{redemption:1}},'Слышит ценность в памяти, душах и невысказанном.'],
   ['wonder','Совершенную красоту, ради которой хотелось забыть обо всём.',{house:{lammasu:4},role:{performer:3}},'Связывает утраченное небо с красотой и переживанием.']]),
  q('power','Предложение власти','Влиятельный падший предлагает покровительство. Взамен он хочет, чтобы вы перестали задавать неудобные вопросы.',[
   ['decline','Откажусь. Мне хватило чужих приказов.',{motive:{rebellion:4},role:{guardian:1},house:{namaru:1}},'Не хочет снова подчиняться прежней иерархии.'],
   ['negotiate','Буду торговаться: покровительство полезно, молчание — слишком высокая цена.',{motive:{influence:4},role:{envoy:2}},'Ищет влияние, сохраняя пространство для сделки.'],
   ['learn','Попробую выяснить, какие именно вопросы его пугают.',{motive:{truth:4},role:{scholar:2},house:{neberu:1}},'Неизвестность интересует сильнее предложенных выгод.'],
   ['distance','Останусь в стороне и займусь людьми, которым могу помочь сейчас.',{motive:{redemption:4},role:{guardian:1},house:{asharu:1}},'Предпочитает конкретную помощь политической сделке.']]),
  q('host','Следы носителя','Вы приходите в себя в чужой квартире. Что в ней первым делом рассказывает о прежней жизни?',[
   ['ordinary','Рабочие записи, семейные фотографии и напоминания о платежах.',{host:{settled:5},role:{envoy:1}},'Носитель оставил повседневные обязанности и устойчивые связи.'],
   ['escape','Небольшая сумка, запасные документы и телефоны нескольких надёжных людей.',{host:{outsider:5},role:{survivor:1}},'Носитель привык рассчитывать на малый круг и возможность уйти.'],
   ['research','Книги, чертежи и письма человека, которого носитель считал наставником.',{host:{seeker:5},role:{maker:1,scholar:1}},'Прежнюю жизнь определяли поиск, обучение и незаконченная работа.'],
   ['public','Афиши, приглашения и сообщения людей, ожидающих публичного появления.',{host:{public:5},role:{performer:1}},'У носителя есть аудитория: исчезновение будет замечено.']]),
  q('miracle','Одно чудо','У вас есть возможность изменить один небольшой уголок города. Какой след хочется оставить?',[
   ['repair','Вернуть к жизни заброшенное место, которое снова станет кому-то нужным.',{house:{annunaki:3},role:{maker:4},motive:{redemption:1}},'Хочет оставлять после себя работающие, осязаемые вещи.'],
   ['hope','Зажечь в людях уверенность, что они способны действовать вместе.',{house:{namaru:3},role:{envoy:2,performer:2},motive:{influence:1}},'Тянется к вдохновению, общему делу и человеческой воле.'],
   ['reveal','Показать скрытую правду, которую долго никто не мог увидеть.',{house:{neberu:3},role:{scholar:3},motive:{truth:1}},'Выбирает раскрытие скрытого вместо внешнего благополучия.'],
   ['feeling','Дать людям почувствовать то, для чего им пока не хватает слов.',{house:{lammasu:3},role:{performer:4}},'Предпочитает воздействовать через чувства и воображение.']]),
  q('betrayal','Нарушенное обещание','Союзник нарушил обещание и подвёл вашу группу. Теперь он просит дать ему ещё один шанс.',[
   ['listen','Выслушаю и предложу способ исправить причинённый вред.',{motive:{redemption:2},role:{envoy:1},house:{asharu:1}},'Допускает исправление, если за словами следуют действия.'],
   ['terms','Дам шанс, но новые условия должны быть понятны всем.',{motive:{influence:2},role:{envoy:1,guardian:1},house:{namaru:1}},'Стремится превратить конфликт в ясные обязательства.'],
   ['understand','Выясню, что привело к этому решению и не повторится ли оно.',{motive:{truth:2},role:{scholar:1},house:{neberu:1}},'Ищет причины и закономерности даже в личном конфликте.'],
   ['leave','Не стану мстить, но больше не позволю зависеть от него.',{motive:{independence:3},role:{survivor:1}},'После предательства прежде всего восстанавливает самостоятельность.']]),
  q('ruin','Пустой дом','В заброшенном доме происходит нечто странное. Вы пришли без спутников. Что первым привлекает внимание героя?',[
   ['voices','Ощущение, будто здесь ещё ждут человека, который никогда не вернётся.',{house:{halaku:4},role:{scholar:1}},'Замечает присутствие памяти и незавершённой утраты.'],
   ['structure','Необычные соединения камней, скрытые проходы и устройство здания.',{house:{annunaki:3},role:{maker:2}},'Читает место через его устройство и скрытые возможности.'],
   ['wild','Следы животных и растений, постепенно отвоёвывающих пространство.',{house:{rabisu:4},role:{survivor:2}},'Замечает возвращение дикой жизни туда, где отступил человек.'],
   ['reflection','Отражения и звуки, которые меняют чувства раньше, чем их удаётся объяснить.',{house:{lammasu:2,neberu:1},role:{performer:2}},'Обращает внимание на восприятие, отражения и перемену настроения.']]),
  q('promise','Личное обещание','Перед новой жизнью герой произносит одно обещание. Какое?',[
   ['heal','Я больше не оставлю того, кого ещё можно спасти.',{house:{asharu:3},motive:{redemption:2},role:{guardian:2}},'Связывает будущий путь с сохранением жизни.'],
   ['remember','Я сохраню имена тех, кого остальные предпочли забыть.',{house:{halaku:3},motive:{truth:1,redemption:1}},'Берёт на себя память о других и незавершённые истории.'],
   ['build','Я создам нечто, что переживёт мою гордость и мои ошибки.',{house:{annunaki:2,namaru:1},role:{maker:2},motive:{influence:1}},'Ищет смысл в длительном результате своего труда.'],
   ['choose','Следующий путь будет выбран мной, а не теми, кто считает себя моими хозяевами.',{motive:{independence:2,rebellion:2},house:{rabisu:1},role:{survivor:1}},'Ставит личный выбор выше готового места в иерархии.']])
 ];
 const maxima={};
 for(const question of questions){const local={};for(const answer of question.answers)for(const [category,values] of Object.entries(answer.weights)){local[category]||={};for(const [id,value] of Object.entries(values))local[category][id]=Math.max(local[category][id]||0,value)}for(const [category,values] of Object.entries(local)){maxima[category]||={};for(const [id,value] of Object.entries(values))maxima[category][id]=(maxima[category][id]||0)+value}}
 function analyze(responses){
  const scores={house:{namaru:0,asharu:0,annunaki:0,neberu:0,lammasu:0,rabisu:0,halaku:0},role:{guardian:0,envoy:0,scholar:0,maker:0,survivor:0,performer:0},motive:{redemption:0,truth:0,rebellion:0,influence:0,independence:0},host:{settled:0,outsider:0,seeker:0,public:0}},chosen=[];
  for(const question of questions){const answer=question.answers.find(a=>a.id===responses?.[question.id]);if(!answer)throw Error('Ответьте на ситуацию «'+question.title+'».');chosen.push({question,answer});for(const [category,values] of Object.entries(answer.weights))for(const [id,value] of Object.entries(values))scores[category][id]+=value}
  const signature=questions.map(q=>responses[q.id]).join('|');
  const tie=id=>{let hash=2166136261;for(const char of signature+'|'+id)hash=Math.imul(hash^char.charCodeAt(0),16777619);return hash>>>0};
  const ranking=category=>Object.entries(scores[category]).map(([id,score])=>{const maximum=maxima[category]?.[id]||0;return {id,score,affinity:maximum?score/maximum:0}}).sort((a,b)=>b.affinity-a.affinity||tie(a.id)-tie(b.id));
  const houses=ranking('house').map(row=>({...row,reasons:chosen.filter(c=>(c.answer.weights.house?.[row.id]||0)>0).sort((a,b)=>(b.answer.weights.house[row.id]||0)-(a.answer.weights.house[row.id]||0)).slice(0,3).map(c=>c.answer.reason)}));
  return {answers:{role:ranking('role')[0].id,house:houses[0].id,motive:ranking('motive')[0].id,host:ranking('host')[0].id},houses,scores,responses:{...responses},evidence:chosen.map(c=>c.answer.reason)};
 }
 const interview={index:0,responses:{},house:null,role:null};
 function mount({parent,el,houses,roles,motives,hosts,onComplete}){
  const state=interview;
  function draw(){
   parent.replaceChildren();
   if(state.index<questions.length){
    const question=questions[state.index],heading=el('div','interview-heading');heading.append(el('p','eyebrow','ИСТОРИЯ ПЕРСОНАЖА · '+(state.index+1)+' / '+questions.length),el('h3','',question.title),el('p','interview-scene',question.scene));parent.append(heading);
    const progress=el('progress','interview-progress');progress.max=questions.length;progress.value=state.index;progress.setAttribute('aria-label','Пройдено ситуаций');parent.append(progress);
    const choices=el('div','interview-answers');choices.setAttribute('role','group');choices.setAttribute('aria-label',question.title);
    for(const answer of question.answers){const button=el('button','interview-answer',answer.text);button.type='button';button.setAttribute('aria-pressed',String(state.responses[question.id]===answer.id));button.onclick=()=>{state.responses[question.id]=answer.id;state.house=null;state.role=null;draw();parent.querySelector('[aria-pressed="true"]')?.focus({preventScroll:true})};choices.append(button)}parent.append(choices);
    const nav=el('div','interview-navigation'),back=el('button','','Назад'),next=el('button','character-primary',state.index===questions.length-1?'Посмотреть результат':'Далее');back.type=next.type='button';back.disabled=state.index===0;next.disabled=!state.responses[question.id];back.onclick=()=>{state.index--;draw()};next.onclick=()=>{state.index++;draw();parent.scrollIntoView({block:'start',behavior:'smooth'})};nav.append(back,next);parent.append(nav);
   }else{
    const profile=analyze(state.responses);if(!state.house)state.house=profile.answers.house;if(!state.role)state.role=profile.answers.role;
    parent.append(el('p','eyebrow','РЕКОМЕНДАЦИЯ ПО ОТВЕТАМ'),el('h3','interview-result-title',roles[state.role].title+' · '+motives[profile.answers.motive].title),el('p','builder-hint','Это варианты для героя, а не тест вашей личности. Выберите подходящий Дом или укажите другой.'));
    const cards=el('div','interview-house-options');
    profile.houses.slice(0,3).forEach((row,i)=>{const house=houses.find(h=>h.id===row.id),button=el('button','interview-house');button.type='button';button.setAttribute('aria-pressed',String(state.house===row.id));button.append(el('small','',i===0?'Ближайший образ':'Другой вариант'),el('strong','',house.title));const reasons=el('ul');for(const text of row.reasons.slice(0,2))reasons.append(el('li','',text));button.append(reasons);button.onclick=()=>{state.house=row.id;draw()};cards.append(button)});parent.append(cards);
    const alternative=el('label','character-field','Любой другой Дом'),select=el('select');for(const h of houses)select.append(new Option(h.title,h.id));select.value=state.house;select.onchange=()=>{state.house=select.value;draw()};alternative.append(select);parent.append(alternative);
    const roleField=el('label','character-field','Профиль сборки'),roleSelect=el('select');for(const [id,r] of Object.entries(roles))roleSelect.append(new Option(r.title,id));roleSelect.value=state.role;roleSelect.onchange=()=>{state.role=roleSelect.value;draw()};roleField.append(roleSelect);parent.append(roleField);
    parent.append(el('p','interview-host','Жизнь носителя: '+hosts[profile.answers.host].title+'. Группировка и история будут предложены, их можно изменить в листе.'));
    const nav=el('div','interview-navigation'),back=el('button','','Изменить ответы'),finish=el('button','character-primary','Создать персонажа'),restart=el('button','','Начать заново');back.type=finish.type=restart.type='button';back.onclick=()=>{state.index--;draw()};finish.onclick=()=>onComplete({answers:{...profile.answers,house:state.house,role:state.role},profile});restart.onclick=()=>{state.index=0;state.responses={};state.house=null;state.role=null;draw()};nav.append(back,finish,restart);parent.append(nav);
   }
  }
  draw();
 }
 const api={questions,analyze,mount};if(typeof module==='object'&&module.exports)module.exports=api;else root.DemonCharacterQuiz=api;
})(typeof window==='object'?window:globalThis);
