'use strict';
(() => {
  const cards = [...document.querySelectorAll('.tarot')];
  const count = cards.length;
  const positions = [...document.querySelectorAll('[data-position]')];
  const deck = document.getElementById('deck');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const games = {
    demon: {name:'Демоны: Падшие', original:'Demon: The Fallen', tagline:'Утраченное небо. Человеческая душа. Второй шанс.', description:'Истории падших ангелов, вернувшихся в мир людей. Память о сотворении мира встречается с человеческими чувствами, а древняя ярость — с возможностью обрести новую цель.'},
    hunter: {name:'Охотники: Возмездие', original:'Hunter: The Reckoning', tagline:'Открытые глаза. Неизвестный враг. Ваш выбор.', description:'Истории людей, столкнувшихся со сверхъестественной стороной привычного мира. Знание об угрозе меняет всё — от отношений с близкими до ответа на вопрос, кому можно доверять.'}
  };
  let active=0, reversed=false, paused=reduced.matches, armed=true, sideTimer=null, cooldown=0, touchStart=null;
  const reverse=document.getElementById('reverse');
  function render(){
    const narrow=window.innerWidth<540;
    const offset=narrow?79:window.innerWidth<800?118:142;
    // Symmetric five-card ring: active, near right, far right, far left, near left.
    const layout=[
      {x:0,y:0,a:0,s:1,b:1,z:5,r:0},
      {x:offset,y:8,a:-22,s:.84,b:.77,z:4,r:3},
      {x:offset*1.8,y:15,a:-32,s:.68,b:.52,z:2,r:6},
      {x:-offset*1.8,y:15,a:32,s:.68,b:.52,z:2,r:-6},
      {x:-offset,y:8,a:22,s:.84,b:.77,z:4,r:-3}
    ];
    cards.forEach((card,i)=>{
      const slot=(i-active+count)%count,l=layout[slot];
      card.style.setProperty('--x',l.x+'px');card.style.setProperty('--y',l.y+'px');
      card.style.setProperty('--angle',l.a+'deg');card.style.setProperty('--roll',l.r+'deg');
      card.style.setProperty('--scale',l.s);card.style.setProperty('--bright',l.b);
      card.style.setProperty('--delay',(-i*1.6)+'s');card.style.zIndex=l.z;
      card.classList.toggle('is-active',i===active);card.classList.toggle('is-reversed',i===active&&reversed);
      card.setAttribute('aria-label',games[card.dataset.game].name+(i>1?' — повтор карты':'')+(i===active?' — открыть историю':' — выбрать карту'));
      if(i===active)card.setAttribute('aria-current','true');else card.removeAttribute('aria-current');
    });
    const game=games[cards[active].dataset.game];
    document.getElementById('selection-name').textContent=game.name;
    document.getElementById('selection-description').textContent=game.tagline;
    document.getElementById('enter').href='#line/'+cards[active].dataset.game;
    positions.forEach((p,i)=>p.setAttribute('aria-current',String(i===active)));
    reverse.setAttribute('aria-pressed',String(reversed));reverse.textContent=reversed?'Показать лицевую сторону':'Показать рубашку';
  }
  function select(index){active=((index%count)+count)%count;reversed=false;cooldown=performance.now()+850;render()}
  function cancelSide(){clearTimeout(sideTimer);sideTimer=null}
  document.getElementById('previous').addEventListener('click',()=>select(active-1));
  document.getElementById('next').addEventListener('click',()=>select(active+1));
  positions.forEach(p=>p.addEventListener('click',()=>select(Number(p.dataset.position))));
  cards.forEach((card,i)=>card.addEventListener('click',()=>{if(i===active)location.hash='line/'+card.dataset.game;else select(i)}));
  reverse.addEventListener('click',()=>{reversed=!reversed;render()});
  deck.addEventListener('pointermove',event=>{
    if(event.pointerType!=='mouse')return;
    const box=deck.getBoundingClientRect(),x=(event.clientX-box.left)/box.width,y=(event.clientY-box.top)/box.height;
    if(!paused&&!reduced.matches){deck.style.setProperty('--tilt-x',((x-.5)*7)+'deg');deck.style.setProperty('--tilt-y',((.5-y)*5)+'deg')}
    const side=x<.34?-1:x>.66?1:0;
    if(!side){armed=true;cancelSide();return}
    if(!armed||sideTimer||performance.now()<cooldown)return;
    sideTimer=setTimeout(()=>{sideTimer=null;if(armed){armed=false;select(active+side)}},260);
  });
  deck.addEventListener('pointerleave',()=>{cancelSide();armed=true;deck.style.setProperty('--tilt-x','0deg');deck.style.setProperty('--tilt-y','0deg')});
  deck.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();cancelSide();select(active+(e.key==='ArrowRight'?1:-1))}});
  deck.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')touchStart={x:e.clientX,y:e.clientY}});
  let suppressClick=false;
  deck.addEventListener('pointerup',e=>{if(!touchStart)return;const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>38&&Math.abs(dx)>Math.abs(dy)*1.3){suppressClick=true;select(active+(dx<0?1:-1));setTimeout(()=>suppressClick=false,350)}});
  deck.addEventListener('pointercancel',()=>touchStart=null);
  deck.addEventListener('click',e=>{if(suppressClick){e.stopPropagation();e.preventDefault()}},true);
  const motion=document.getElementById('motion');
  function setMotion(value){paused=value;document.body.classList.toggle('motion-paused',paused);motion.setAttribute('aria-pressed',String(paused));motion.setAttribute('aria-label',paused?'Возобновить анимацию':'Приостановить анимацию');motion.firstElementChild.textContent=paused?'▷':'Ⅱ'}
  motion.addEventListener('click',()=>setMotion(!paused));reduced.addEventListener('change',e=>setMotion(e.matches));
  const dialog=document.getElementById('line-dialog');let returnFocus=null;
  function route(){if(location.hash==='#line/demon'){location.replace('demon.html');return}const match=location.hash.match(/^#line\/(demon|hunter)$/);if(match){const game=games[match[1]];document.getElementById('dialog-original').textContent=game.original;document.getElementById('dialog-title').textContent=game.name;document.getElementById('dialog-description').textContent=game.description;if(!dialog.open){returnFocus=document.activeElement;dialog.showModal()}}else if(dialog.open)dialog.close()}
  function closeDialog(){if(location.hash.startsWith('#line/')){history.replaceState(null,'',location.pathname+location.search+'#lineages')}dialog.close();returnFocus?.focus({preventScroll:true})}
  dialog.querySelector('.dialog-close').addEventListener('click',closeDialog);dialog.querySelector('.dialog-return').addEventListener('click',closeDialog);
  dialog.addEventListener('cancel',e=>{e.preventDefault();closeDialog()});dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)closeDialog()}});
  window.addEventListener('hashchange',route);window.addEventListener('resize',render);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelSide();document.body.classList.add('motion-paused')}else document.body.classList.toggle('motion-paused',paused)});
  render();setMotion(paused);route();
})();
