/* Static HTML editions: no framework runtime required. */
(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
const kind=document.body.dataset.edition||document.body.className;
const dark=kind==='field';
const ink=dark?'#dce0e4':kind==='blueprint'?'#064cf0':'#17191d';
const paper=dark?'#101112':kind==='blueprint'?'#f7faff':'#fafafa';
const art=document.querySelector('.art'),canvas=document.querySelector('.reactor-art');
const cleanups=[];
let pointer={x:-999,y:-999,active:false};
const pointerField=window.createPointerField?.();if(pointerField)cleanups.push(()=>pointerField.destroy());
if(art&&canvas&&!canvas.hasAttribute('data-core')){
 const ctx=canvas.getContext('2d'),logo=new Image(),sampler=document.createElement('canvas');sampler.width=200;sampler.height=200;
 let shape=[],w=0,h=0,raf=0,last=0,time=0,visible=true;
 logo.onload=()=>{const c=sampler.getContext('2d',{willReadFrequently:true});c.drawImage(logo,0,0,200,200);const data=c.getImageData(0,0,200,200).data;for(let y=0;y<200;y+=3)for(let x=0;x<200;x+=3){if(data[(y*200+x)*4+3]>100)shape.push({x:x/200-.5,y:y/200-.5});}canvas.dataset.logoLoaded='true';};logo.src='assets/reactor-mono.svg';
 const resize=()=>{w=art.clientWidth;h=art.clientHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);};const ro=new ResizeObserver(resize);ro.observe(art);resize();
 const onMove=e=>{if(!matchMedia('(pointer:fine)').matches){pointer.active=false;return;}const r=art.getBoundingClientRect();pointer={x:e.clientX-r.left,y:e.clientY-r.top,active:e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom};};addEventListener('pointermove',onMove,{passive:true});
 const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});io.observe(art);
 const dot=(x,y,size,alpha=1)=>{const dx=x-pointer.x,dy=y-pointer.y,d=Math.hypot(dx,dy),push=pointer.active?Math.exp(-d*d/11000)*22:0;ctx.globalAlpha=alpha;ctx.fillRect(x+(dx/(d||1))*push,y+(dy/(d||1))*push,size,size);};
 const draw=now=>{raf=requestAnimationFrame(draw);if(now-last<33||!visible||document.hidden)return;const dt=Math.min((now-last)/1000,.05);last=now;if(!reduced.matches)time+=dt;ctx.clearRect(0,0,w,h);ctx.fillStyle=ink;
  if(!matchMedia('(pointer:fine)').matches)pointer.active=false;
  if(kind==='field'){
   const copy=document.querySelector('.hero-copy').getBoundingClientRect(),bounds=art.getBoundingClientRect();
   const cx=copy.left+copy.width/2-bounds.left,cy=copy.top+copy.height/2-bounds.top;
   const radius=Math.min(w*.39,h*.44);
   canvas.dataset.centerX=String(cx);canvas.dataset.centerY=String(cy);
   for(let row=0;row<=42;row++){const lat=row/42*Math.PI;for(let col=0;col<90;col++){const lng=col/90*Math.PI*2+time*.055;const z=Math.sin(lat)*Math.sin(lng),x=Math.sin(lat)*Math.cos(lng),y=Math.cos(lat);const depth=1+z*.18;const hole=Math.abs(x)<.57&&Math.abs(y)<.53;dot(cx+x*radius*depth,cy+y*radius*depth,Math.max(1,1.7+z*.7),hole?.06:.18+Math.max(0,z)*.55);}}
  }else{
   const scale=Math.min(w,h)*.73,cx=w/2,cy=h*.48;
   for(const p of shape)dot(cx+p.x*scale,cy+p.y*scale,kind==='paper'?2.2:1.8,.9);
   if(kind==='blueprint'){
    const r=scale*.6;for(let i=0;i<150;i++){const a=i/150*Math.PI*2;dot(cx+Math.cos(a)*r,cy+Math.sin(a)*r,i%5===0?3:1,.55);}
    ctx.globalAlpha=.7;ctx.strokeStyle=ink;ctx.lineWidth=1;ctx.font='12px Tech,monospace';
    const labels=[['VOICE',-.43,-.36],['VISION',.31,-.32],['TOOLS',.3,.31],['MEMORY',-.44,.32]];
    labels.forEach(([label,x,y])=>{const tx=cx+x*w,ty=cy+y*h;ctx.beginPath();ctx.moveTo(cx+x*scale*.5,cy+y*scale*.5);ctx.lineTo(tx,ty);ctx.lineTo(tx+42,ty);ctx.stroke();ctx.fillText(label,tx,ty-9);});
   }
  }ctx.globalAlpha=1;canvas.dataset.rendered='true';
 };raf=requestAnimationFrame(draw);cleanups.push(()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();removeEventListener('pointermove',onMove);});
}
// Letter proximity uses one shared frame callback, not hooks inside loops.
const heading=document.querySelector('h1');
if(heading&&!heading.querySelector('img')&&!reduced.matches){const text=heading.textContent;heading.setAttribute('aria-label',text);const children=[...heading.childNodes];heading.textContent='';const letters=[];for(const node of children){if(node.nodeName==='BR'){heading.append(document.createElement('br'));continue;}node.textContent.split(' ').forEach((word,i)=>{if(i)heading.append(' ');const span=document.createElement('span');span.className='word';span.setAttribute('aria-hidden','true');for(const letter of word){const el=document.createElement('span');el.className='letter';el.textContent=letter;span.append(el);letters.push(el);}heading.append(span);});}
 let x=-999,y=-999,frame=0;const move=e=>{x=e.clientX;y=e.clientY;};addEventListener('pointermove',move,{passive:true});const draw=()=>{for(const el of letters){const r=el.getBoundingClientRect(),n=Math.exp(-Math.pow(Math.hypot(r.x+r.width/2-x,r.y+r.height/2-y)/85,2));el.style.transform=`translateY(${-n*6}px)`;el.style.color=n>.15?(dark?'#8ab8ff':'#064cf0'):'';}frame=requestAnimationFrame(draw);};draw();cleanups.push(()=>{cancelAnimationFrame(frame);removeEventListener('pointermove',move);});
 const alphabet='.:+*';letters.forEach((el,i)=>{const original=el.textContent,start=performance.now();const tick=now=>{if(now-start>400+i*9){el.textContent=original;return;}el.textContent=alphabet[Math.floor(Math.random()*4)];requestAnimationFrame(tick);};requestAnimationFrame(tick);});
}
const paths={voice:'M12 3v11m-4-9v5a4 4 0 008 0V5a4 4 0 00-8 0m-3 5a7 7 0 0014 0M12 17v4m-4 0h8',computer:'M3 4h18v12H3zM8 21h8m-4-5v5',research:'M14 14l7 7M10 3a7 7 0 110 14 7 7 0 010-14',cowork:'M3 6h18v15H3zM8 6V3h8v3M3 11h18m-9-2v4'};
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[el.dataset.icon]}"/></svg>`);
let noticeTimer;const notice=text=>{const el=document.querySelector('.notice');el.textContent=text;el.classList.add('visible');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>el.classList.remove('visible'),4500);};
const config=window.JARVIS_MEDIA||{};
document.querySelector('[data-github]')?.addEventListener('click',e=>{if(!config.github){e.preventDefault();notice('The GitHub repository has not been published yet. Its link will appear here.');}});
if(config.github)document.querySelector('[data-github]').href=config.github;
if(config.installer){const el=document.querySelector('[data-installer]'),a=document.createElement('a');a.className='installer';a.href=config.installer;a.textContent='Download Windows installer →';el.replaceWith(a);}
const dialog=document.querySelector('.media-dialog');document.querySelectorAll('[data-expand]').forEach(button=>button.addEventListener('click',()=>{const node=button.closest('figure').querySelector('img,video').cloneNode(true);dialog.querySelector('div').replaceChildren(node);dialog.showModal();if(node.tagName==='VIDEO'){node.controls=true;node.play().catch(()=>{});}}));
const close=()=>{dialog?.querySelector('video')?.pause();dialog?.close();};document.querySelector('.close-dialog')?.addEventListener('click',close);dialog?.addEventListener('click',e=>{if(e.target===dialog)close();});dialog?.addEventListener('close',()=>dialog.querySelector('video')?.pause());
document.querySelectorAll('.product-media video').forEach(video=>{const toggle=video.closest('figure').querySelector('.loop-toggle');let userPaused=false;
 const update=()=>{toggle?.setAttribute('aria-pressed',String(video.paused));toggle?.setAttribute('aria-label',video.paused?'Play recording':'Pause recording');if(toggle)toggle.innerHTML=video.paused?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 10 7-10 7Z"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12"/></svg>';};
 toggle?.addEventListener('click',()=>{userPaused=!video.paused;if(userPaused)video.pause();else video.play().catch(()=>{});});video.addEventListener('play',update);video.addEventListener('pause',update);
 const io=new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!reduced.matches&&!userPaused)video.play().catch(()=>{});else video.pause();},{threshold:.12});io.observe(video);video.addEventListener('error',()=>{video.poster='assets/films/desktop-poster.jpg';});cleanups.push(()=>io.disconnect());});
const descriptions={voice:'Listen and respond through Gemini Live. Share a screen or camera, use text, or wake the assistant by voice.',computer:'Translate a request into desktop and browser actions. Keep activity visible as the assistant works.',context:'Keep sources, local memory and conversation context together. Research and project work stay connected.'};
const tabs=[...document.querySelectorAll('[data-system]')];const select=index=>{tabs.forEach((b,i)=>{b.setAttribute('aria-selected',String(i===index));b.tabIndex=i===index?0:-1;});document.querySelector('#system-detail').textContent=descriptions[tabs[index].dataset.system];};tabs.forEach((b,i)=>{b.addEventListener('click',()=>select(i));b.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const next=(i+(e.key==='ArrowDown'||e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;select(next);tabs[next].focus();}});});if(tabs.length)select(0);
addEventListener('pagehide',()=>cleanups.forEach(fn=>fn()),{once:true});
})();

