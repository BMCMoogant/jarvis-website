(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:700px)'),cleanups=[];
const clamp=x=>Math.max(0,Math.min(1,x));
// Native vertical scroll drives the horizontal camera, with time-based easing.
const journey=document.body.classList.contains('trio')?null:document.querySelector('.relay-journey'),track=document.querySelector('.journey-track');
let target=0,current=0,anim=0,previous=0;
const smooth=x=>x*x*x*(x*(x*6-15)+10);
const measure=()=>{if(!journey)return;const r=journey.getBoundingClientRect();const progress=mobile.matches||reduced.matches?0:clamp(-r.top/Math.max(1,journey.offsetHeight-innerHeight));target=progress<.12?0:progress<.4?smooth((progress-.12)/.28):progress<.6?1:progress<.88?1+smooth((progress-.6)/.28):2;journey.dataset.progress=String(progress);journey.style.setProperty('--journey',progress);if(!anim)anim=requestAnimationFrame(move);};
function move(now){const dt=Math.min((now-(previous||now-16))/1000,.05);previous=now;const delta=(target-current)*(1-Math.exp(-dt*4.8));current+=Math.max(-dt*.95,Math.min(dt*.95,delta));if(mobile.matches||reduced.matches)current=0;
if(track){const width=track.parentElement.clientWidth;track.style.transform=`translate3d(${-current*width}px,0,0)`;journey.dataset.travel=current.toFixed(4);const label=journey.querySelector('.journey-count');if(label)label.textContent=['Conversation','Context','Action'][Math.round(current)];}
if(Math.abs(current-target)>.0002&&!mobile.matches&&!reduced.matches)anim=requestAnimationFrame(move);else{anim=0;previous=0;}}
addEventListener('scroll',measure,{passive:true});addEventListener('resize',measure,{passive:true});reduced.addEventListener('change',measure);measure();cleanups.push(()=>{cancelAnimationFrame(anim);removeEventListener('scroll',measure);removeEventListener('resize',measure);reduced.removeEventListener('change',measure);});
// Each gate is a short, independent rotor of glyphs in a continuous frame.
const gates=[...document.querySelectorAll('.chapter-gate')];
const gateObserver=new IntersectionObserver(entries=>entries.forEach(e=>{e.target.style.setProperty('--gate',e.isIntersecting?1:0);e.target.dataset.visible=String(e.isIntersecting);}),{threshold:.1});gates.forEach(g=>gateObserver.observe(g));cleanups.push(()=>gateObserver.disconnect());
gates.forEach((gate,index)=>{const canvas=gate.querySelector('canvas'),ctx=canvas.getContext('2d');let w=1,h=1,raf=0,last=0,time=index;
const resize=()=>{w=canvas.clientWidth;h=canvas.clientHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);};const ro=new ResizeObserver(resize);ro.observe(canvas);resize();
const draw=now=>{raf=requestAnimationFrame(draw);if(document.hidden||gate.dataset.visible!=='true'||now-last<50)return;const dt=Math.min((now-last)/1000,.05);last=now;if(!reduced.matches)time+=dt;ctx.clearRect(0,0,w,h);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='10px Tech,monospace';
for(let ring=0;ring<4;ring++){const r=(.18+ring*.08)*Math.min(w,h);for(let i=0;i<42;i++){const a=i/42*Math.PI*2+(ring%2?-1:1)*time*.16;const x=w/2+Math.cos(a)*r,y=h/2+Math.sin(a)*r;if((i+ring)%11<2)continue;ctx.fillStyle=y<h*.3?'#799bcf':'#a3afb7';ctx.globalAlpha=.3+(ring===2?.3:0);ctx.fillText(['·','+','x',':'][ring],x,y);}}
ctx.globalAlpha=.8;ctx.font='11px Tech,monospace';ctx.fillStyle='#d1d7dc';ctx.fillText(['SYS','I/O','CTX','RUN'][index%4],w/2,h/2);ctx.globalAlpha=1;canvas.dataset.rendered='true';};raf=requestAnimationFrame(draw);cleanups.push(()=>{cancelAnimationFrame(raf);ro.disconnect();});});
// A source image resolves from characters when it enters. Manual ASCII view stays inspectable.
document.querySelectorAll('.product-media').forEach(figure=>{const picture=figure.querySelector('.media-picture'),source=picture?.querySelector('img,video'),button=figure.querySelector('.ascii-toggle');if(!picture||!source)return;
const canvas=document.createElement('canvas');canvas.className='media-ascii';canvas.setAttribute('aria-hidden','true');picture.append(canvas);const ctx=canvas.getContext('2d');const sample=document.createElement('canvas'),sc=sample.getContext('2d',{willReadFrequently:true});let width=1,height=1,visible=false,manual=false,amount=0,raf=0,last=0;
const resize=()=>{width=picture.clientWidth;height=picture.clientHeight;canvas.width=width;canvas.height=height;sample.width=Math.ceil(width/10);sample.height=Math.ceil(height/12);};const ro=new ResizeObserver(resize);ro.observe(picture);resize();
const io=new IntersectionObserver(e=>visible=e[0].isIntersecting,{rootMargin:'100px'});io.observe(figure);
button?.addEventListener('click',()=>{manual=!manual;button.setAttribute('aria-pressed',String(manual));button.textContent=manual?'Original view':'ASCII view';});
const draw=now=>{raf=requestAnimationFrame(draw);if(document.hidden||!visible||now-last<85)return;last=now;const rect=picture.getBoundingClientRect();const next=manual?1:reduced.matches?0:clamp((rect.top-innerHeight*.3)/(innerHeight*.55));amount=reduced.matches?next:amount+(next-amount)*.25;canvas.style.setProperty('--ascii',amount.toFixed(3));if(amount<.01)return;
if(source.tagName==='VIDEO'?source.readyState<2:!source.complete||!source.naturalWidth)return;
try{sc.drawImage(source,0,0,sample.width,sample.height);const pixels=sc.getImageData(0,0,sample.width,sample.height).data;ctx.fillStyle='#0e1318';ctx.fillRect(0,0,width,height);ctx.font='11px Tech,monospace';ctx.textBaseline='top';const chars=' .·:+xXS8#@';for(let y=0;y<sample.height;y++)for(let x=0;x<sample.width;x++){const i=(y*sample.width+x)*4,l=Math.pow((pixels[i]*.2126+pixels[i+1]*.7152+pixels[i+2]*.0722)/255,.58);if(l<.05)continue;const shade=Math.round(65+l*190);ctx.fillStyle=y<sample.height*.16?`rgb(${Math.round(shade*.66)},${Math.round(shade*.8)},${shade})`:`rgb(${shade},${shade},${shade})`;ctx.fillText(chars[Math.min(chars.length-1,Math.floor(l*(chars.length-1)*1.35))],x*10,y*12);}canvas.dataset.rendered='true';}catch{canvas.style.opacity='0';}
};raf=requestAnimationFrame(draw);cleanups.push(()=>{cancelAnimationFrame(raf);io.disconnect();ro.disconnect();});});
// Peripheral terminal texture stays clear of the reading column.
const stream=document.createElement('canvas');stream.className='terminal-drift';stream.setAttribute('aria-hidden','true');document.body.append(stream);const ctx=stream.getContext('2d');let width=0,height=0,raf=0,last=0,time=0;
const resize=()=>{width=innerWidth;height=innerHeight;stream.width=width;stream.height=height;};resize();addEventListener('resize',resize,{passive:true});
const drift=now=>{raf=requestAnimationFrame(drift);if(document.hidden||reduced.matches||now-last<80)return;time+=(now-last)/1000;last=now;ctx.clearRect(0,0,width,height);ctx.font='10px Tech,monospace';const cols=mobile.matches?2:4;for(let side=0;side<2;side++)for(let col=0;col<cols;col++)for(let row=0;row<Math.ceil(height/23)+4;row++){const y=(row*23+time*(8+col*2))%(height+60)-30,x=side?width-12-col*13:8+col*13;ctx.fillStyle=row%9===0?'#5e7fae':'#85929b';ctx.globalAlpha=.15+((row+col)%5)*.1;ctx.fillText('01.:+<>'[(row+col+Math.floor(time*.4))%7],x,y);}ctx.globalAlpha=1;};raf=requestAnimationFrame(drift);cleanups.push(()=>{cancelAnimationFrame(raf);removeEventListener('resize',resize);});
addEventListener('pagehide',()=>cleanups.forEach(fn=>fn()),{once:true});
})();

