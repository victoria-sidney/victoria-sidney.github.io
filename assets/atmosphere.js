(() => {
  'use strict';
  const read = key => { try { return sessionStorage.getItem(key); } catch { return null; } };
  const save = (key,value) => { try { sessionStorage.setItem(key,value); } catch {} };
  let enabled=read('vs-sound')==='on';
  let entryPlayed=read('vs-entry-played')==='yes';
  let pendingCollection=read('vs-collection-sound')==='yes';
  save('vs-collection-sound','no');
  const tracks={
    entry:new Audio('assets/audio/world-entry.mp3'),
    ding:new Audio('assets/audio/rabbit-ding.mp3'),
    touch:new Audio('assets/audio/collection-touch.mp3')
  };
  for(const [name,track] of Object.entries(tracks)){
    track.preload='none';track.loop=false;track.volume=name==='ding'?.65:name==='entry'?.4:.35;
  }
  const stop=()=>Object.values(tracks).forEach(track=>{track.pause();track.currentTime=0;});
  async function play(name){
    if(!enabled||document.hidden||!tracks[name]) return false;
    stop();
    try{await tracks[name].play();return true;}catch{return false;}
  }
  window.VSAtmosphere=Object.freeze({play});
  const button=document.createElement('button');
  button.className='vs-sound-toggle';button.type='button';
  button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4Z"/><g class="vs-sound-on"><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/></g><path class="vs-sound-off" d="m16 9 5 6m0-6-5 6"/></svg><span></span>';
  function label(){
    const uk=document.documentElement.lang==='uk';
    button.setAttribute('aria-pressed',String(enabled));
    button.setAttribute('aria-label',uk?(enabled?'Вимкнути звук':'Увімкнути звук'):(enabled?'Turn sound off':'Turn sound on'));
    button.title=button.getAttribute('aria-label');
    button.querySelector('span').textContent=uk?(enabled?'Звук увімкнено':'Увімкнути звук'):(enabled?'Sound on':'Sound off');
  }
  label();document.body.appendChild(button);
  new MutationObserver(label).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  button.addEventListener('click',async()=>{
    enabled=!enabled;save('vs-sound',enabled?'on':'off');label();
    if(!enabled){stop();pendingCollection=false;return;}
    if(!entryPlayed&&await play('entry')){entryPlayed=true;save('vs-entry-played','yes');}
  });
  const resumePending=async()=>{
    if(pendingCollection&&enabled&&await play('touch')) pendingCollection=false;
  };
  if(pendingCollection)resumePending();
  document.addEventListener('pointerdown',event=>{if(!event.target.closest('.vs-sound-toggle'))resumePending();},{passive:true});
  document.addEventListener('keydown',resumePending);
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-collection-lang]')){pendingCollection=false;play('touch');}
    if(enabled&&event.target.closest('.collection-links a'))save('vs-collection-sound','yes');
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  addEventListener('pagehide',stop);

  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const layer=document.createElement('div');layer.className='vs-leaves';layer.setAttribute('aria-hidden','true');document.body.appendChild(layer);
  // Crop the user's transparent sheet in SVG: preserve the original artwork and resolution.
  const leaves=[
    {box:[344,4,376,310],polygon:'348,82 384,60 407,23 459,59 474,5 518,42 545,12 568,52 627,12 627,68 676,42 661,104 690,133 655,152 705,169 670,199 654,220 682,253 713,289 704,308 660,274 626,240 583,267 549,243 514,272 479,235 435,229 454,196 401,193 424,156 375,153 391,128'},
    {box:[36,466,294,264],polygon:'44,566 88,545 82,503 119,517 149,481 176,497 207,467 220,509 271,487 265,533 319,521 303,554 329,570 295,601 306,630 261,642 248,679 215,665 183,705 147,676 123,693 101,654 76,636 37,677 38,662 73,627 49,609'},
    {box:[992,344,302,218],polygon:'999,345 1038,377 1082,387 1121,385 1159,351 1168,391 1201,392 1265,365 1241,411 1288,410 1265,438 1291,450 1256,478 1265,514 1217,518 1196,549 1164,529 1132,560 1107,525 1068,522 1074,491 1026,480 1051,455 1000,430 1021,411'}
  ];
  const source='assets/autumn-leaves-original.png';
  const warm=new Image();warm.src=source;
  let timer=null,serial=0;let coolingUntil=0;let active=[];
  const rand=(min,max)=>min+Math.random()*(max-min);
  function clearLeaves(){active.forEach(a=>a.cancel());active=[];layer.replaceChildren();}
  function schedule(delay=rand(21000,34000)){clearTimeout(timer);if(!reduced.matches&&!document.hidden)timer=setTimeout(gust,delay);}
  function gust(){
    if(reduced.matches||document.hidden)return;
    if(document.querySelector('.rabbit-character')||Date.now()<coolingUntil){schedule(5000);return;}
    const left=Math.random()<.5;const mobile=innerWidth<=720;const count=mobile?2:3;
    for(let i=0;i<count;i++){
      const leaf=leaves[(serial+i)%leaves.length], [x,y,w,h]=leaf.box;
      const size=mobile?rand(125,180):rand(200,300);
      const el=document.createElement('span');el.className='vs-leaf';el.style.width=size+'px';el.style.height=(size*h/w)+'px';
      const id='vs-leaf-'+(++serial);
      el.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" aria-hidden="true"><defs><clipPath id="${id}"><polygon points="${leaf.polygon}"/></clipPath></defs><image href="${source}" width="1672" height="941" clip-path="url(#${id})"/></svg>`;
      layer.appendChild(el);
      const start=left?-size*1.6:innerWidth+size*.6;const end=left?innerWidth+size*1.6:-size*1.6;
      const sy=rand(innerHeight*.06,innerHeight*.48);const drop=rand(innerHeight*.22,innerHeight*.45);const turn=rand(-80,20);
      const frames=[0,.22,.5,.78,1].map((t,n)=>({offset:t,opacity:n===0||n===4?0:.94,transform:`translate3d(${start+(end-start)*t}px,${sy+drop*t+Math.sin(t*Math.PI*2)*30}px,0) rotate(${turn+t*(left?180:-180)}deg) rotateY(${Math.sin(t*Math.PI*2)*48}deg)`}));
      const anim=el.animate(frames,{duration:rand(6500,8500),delay:i*650,easing:'linear',fill:'both'});active.push(anim);
      const done=()=>{el.remove();active=active.filter(a=>a!==anim);};anim.onfinish=done;anim.oncancel=done;
    }
    schedule();
  }
  // Rabbit movement and timing stay unchanged; only leaves yield to its appearance.
  addEventListener('vs:rabbit-start',()=>{coolingUntil=Date.now()+6500;clearLeaves();});
  document.addEventListener('visibilitychange',()=>{clearTimeout(timer);clearLeaves();if(!document.hidden)schedule(10000);});
  reduced.addEventListener('change',()=>{clearTimeout(timer);clearLeaves();if(!reduced.matches)schedule(10000);});
  addEventListener('pagehide',()=>{clearTimeout(timer);clearLeaves();});
  addEventListener('pageshow',e=>{if(e.persisted)schedule(10000);});
  schedule(19000);
})();
