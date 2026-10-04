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


  let leavesEnabled=read('vs-leaves')!=='off';
  const leavesButton=document.createElement('button');
  leavesButton.className='vs-leaves-toggle';leavesButton.type='button';
  const leavesCaption=document.createElement('span');
  leavesCaption.className='vs-leaves-label';leavesCaption.setAttribute('aria-hidden','true');
  leavesButton.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5C12 3.5 5.8 6.4 4.1 12.1c-.8 2.7.8 5 3.5 5.5 5.8 1.2 11.4-5 12.9-14.1ZM5 20l8-9"/></svg>';
  function leavesLabel(){
    const uk=document.documentElement.lang==='uk';
    const label=leavesEnabled?(uk?'Зупинити листя':'Pause falling leaves'):(uk?'Відновити листопад':'Resume falling leaves');
    leavesButton.setAttribute('aria-pressed',String(!leavesEnabled));
    leavesButton.setAttribute('aria-label',label);leavesButton.title=label;
    const lines=uk?(leavesEnabled?['Зупинити','листя']:['Відновити','листопад']):(leavesEnabled?['Pause falling','leaves']:['Resume falling','leaves']);
    leavesCaption.textContent=lines.join('\\n');
  }
  leavesLabel();document.body.appendChild(leavesCaption);document.body.appendChild(leavesButton);
  new MutationObserver(leavesLabel).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  leavesButton.addEventListener('click',()=>{
    leavesEnabled=!leavesEnabled;save('vs-leaves',leavesEnabled?'on':'off');leavesLabel();
    clearTimeout(timer);
    if(leavesEnabled)schedule(250);else clearLeaves();
  });

  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const layer=document.createElement('div');layer.className='vs-leaves';layer.setAttribute('aria-hidden','true');document.body.appendChild(layer);
  // Use the six individual transparent originals from the author, in rotation.
  const leaves=[
    {name:'maple-green-yellow',scale:1},
    {name:'oak-brown',scale:.95},
    {name:'red-small',scale:.62},
    {name:'maple-red',scale:1},
    {name:'green-small',scale:.75},
    {name:'maple-gold-green',scale:1.05}
  ].map(leaf=>({...leaf,src:'assets/leaves/'+leaf.name+'.png'}));
  leaves.forEach(leaf=>{const warm=new Image();warm.src=leaf.src;});
  const rand=(min,max)=>min+Math.random()*(max-min);
  let timer=null,serial=0,atEnding=false;
  const active=new Set();
  function clearLeaves(){for(const animation of active)animation.cancel();active.clear();layer.replaceChildren();}
  function schedule(delay){
    clearTimeout(timer);
    if(leavesEnabled&&!reduced.matches&&!document.hidden)timer=setTimeout(flyLeaf,delay??(atEnding?rand(550,950):rand(1100,1800)));
  }
  function flyLeaf(){
    if(!leavesEnabled||reduced.matches||document.hidden)return;
    const mobile=innerWidth<=720;
    const limit=atEnding?(mobile?8:12):(mobile?5:8);
    if(active.size>=limit){schedule();return;}
    const index=serial++,leaf=leaves[index%leaves.length];
    const size=(mobile?rand(135,190):rand(205,285))*leaf.scale;
    const el=document.createElement('span');el.className='vs-leaf';el.dataset.leaf=leaf.name;
    el.style.width=size+'px';el.style.height=size+'px';
    const image=document.createElement('img');image.src=leaf.src;image.alt='';image.draggable=false;el.appendChild(image);layer.appendChild(el);
    // Each leaf enters separately, at a different height; never a row or a burst.
    const left=Math.floor(index/9)%2===0;
    const start=left?-size:innerWidth+size*.2,end=left?innerWidth+size:-size*1.2;
    const lane=(index*3)%7;
    const sy=innerHeight*(.02+lane*.095)+rand(-25,25);
    const drop=rand(innerHeight*.12,innerHeight*.32),turn=rand(-90,40),sway=rand(24,65);
    const frames=[0,.18,.42,.68,.88,1].map((t,n)=>({offset:t,opacity:n===0||n===5?0:.96,transform:`translate3d(${start+(end-start)*t}px,${sy+drop*t+Math.sin(t*Math.PI*2)*sway}px,0) rotate(${turn+t*(left?180:-180)}deg) rotateY(${Math.sin(t*Math.PI*2)*38}deg)`}));
    const animation=el.animate(frames,{duration:rand(8500,11500),easing:'linear',fill:'both'});
    active.add(animation);
    const done=()=>{el.remove();active.delete(animation);};animation.onfinish=done;animation.oncancel=done;
    schedule();
  }
  const ending=document.querySelector('.final-quote')||document.querySelector('footer');
  if(ending){
    new IntersectionObserver(entries=>{
      const visible=entries.some(entry=>entry.isIntersecting);
      if(visible!==atEnding){atEnding=visible;layer.dataset.ending=String(visible);schedule(visible?350:1200);}
    },{threshold:.1}).observe(ending);
  }
  // Leaves remain behind the rabbit; its appearance no longer cancels the wind.
  document.addEventListener('visibilitychange',()=>{clearTimeout(timer);clearLeaves();if(!document.hidden)schedule(800);});
  reduced.addEventListener('change',()=>{clearTimeout(timer);clearLeaves();if(!reduced.matches)schedule(800);});
  addEventListener('pagehide',()=>{clearTimeout(timer);clearLeaves();});
  addEventListener('pageshow',event=>{if(event.persisted)schedule(800);});
  schedule(900);
})();
