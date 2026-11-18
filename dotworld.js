(()=>{'use strict';
const reduce=matchMedia('(prefers-reduced-motion:reduce)'),phone=matchMedia('(max-width:700px)');
const dispose=[];
const fusion=document.body.classList.contains('fusion');
// One palette is shared by the supplied shader and the code-native reactor.
document.querySelectorAll('[data-gradient]').forEach(el=>{let engine=null;const mount=()=>{engine?.destroy();engine=null;const canopy=fusion&&el.dataset.light==='canopy';if(window.createGradientASCII)engine=window.createGradientASCII(el.querySelector('canvas'),{colors:canopy?(document.body.classList.contains('trio')?['#1e3fd8','#f6f8ff','#a5d8ff','#38bdf8']:['#12234a','#264baf','#4fa6ee','#d6f4ff']):['#152b3c','#527e9f','#aed7f5','#e3f1fb'],shape:el.dataset.gradient,characters:canopy?' .:01XS8#@':' .·:+xX#',cellSize:canopy?13:14,density:canopy?.76:.62,glyphOpacity:document.body.classList.contains('trio')?.92:.65,gradientOpacity:canopy?(document.body.classList.contains('trio')?.8:.35):.16,glow:canopy?.18:.08,flow:.35,speed:.35,grain:.025,intro:!document.body.classList.contains('trio'),scale:1.25,dpr:1.2,fontFamily:'Tech,monospace'});el.dataset.ready=String(!!engine);};mount();reduce.addEventListener('change',mount);dispose.push(()=>{engine?.destroy();reduce.removeEventListener('change',mount);});});
const canvas=document.querySelector('[data-core]');
if(canvas){const art=canvas.parentElement,ctx=canvas.getContext('2d'),mode=canvas.dataset.core;
let width=1,height=1,time=0,last=0,raf=0,visible=true,px=0,py=0,mx=0,my=0;
const resize=()=>{width=art.clientWidth;height=art.clientHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);};const ro=new ResizeObserver(resize);ro.observe(art);resize();
const move=e=>{if(!matchMedia('(pointer:fine)').matches)return;const r=art.getBoundingClientRect();mx=(e.clientX-r.x)/r.width-.5;my=(e.clientY-r.y)/r.height-.5;};addEventListener('pointermove',move,{passive:true});
const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting;});io.observe(art);
const render=now=>{raf=requestAnimationFrame(render);if(now-last<33||!visible||document.hidden)return;const dt=Math.min((now-last)/1000,.05);last=now;if(!reduce.matches)time+=dt;px+=(mx-px)*.05;py+=(my-py)*.05;ctx.clearRect(0,0,width,height);
const relay=mode==='relay'&&!phone.matches,solo=mode==='singularity';
const cx=relay?width*.76:width/2,cy=solo?height*.67:height*.48;
const radius=Math.min(width*(relay?.23:.4),height*(solo?.28:.42));
canvas.dataset.centerX=String(cx);canvas.dataset.centerY=String(cy);canvas.dataset.radius=String(radius);
ctx.save();ctx.translate(cx,cy);ctx.strokeStyle='#709bb9';ctx.fillStyle='#c4e6fb';ctx.lineWidth=1;
if(fusion){const light=ctx.createLinearGradient(0,-radius*1.2,0,radius);light.addColorStop(0,'#8faef2');light.addColorStop(.25,'#c2cbd3');light.addColorStop(1,'#54616b');ctx.strokeStyle=light;ctx.fillStyle='#c6cdd3';}
// Deformed sphere: organic surface movement, no spinning logo or opaque glow.
for(let i=1;i<37;i++){const lat=i/37*Math.PI;for(let j=0;j<82;j++){const lng=j/82*Math.PI*2;
const flux=1+.035*Math.sin(lng*5+time*.75)*Math.sin(lat*4-time*.4);const x=Math.sin(lat)*Math.cos(lng),y=Math.cos(lat),z=Math.sin(lat)*Math.sin(lng);
const rx=(x*Math.cos(px*.35)+z*Math.sin(px*.35))*radius*flux,ry=(y*Math.cos(py*.25)-z*Math.sin(py*.25))*radius*flux;
const d=Math.hypot(rx,ry)/radius,alpha=(.12+Math.max(z,0)*.48)*(d<.77&&!solo?.16:1);
ctx.globalAlpha=alpha;const size=1+Math.max(z,0)*1.15;ctx.fillRect(rx,ry,size,size);
}}
// Segmented mechanical rings are distinct from the soft inner mesh.
ctx.globalAlpha=.62;const spin=reduce.matches?0:time*.025;
for(let ring=0;ring<3;ring++){const r=radius*(1.035+ring*.07);ctx.lineWidth=ring===1?2:1;for(let i=0;i<8;i++){const a=i*Math.PI/4+(ring%2?-spin:spin);ctx.beginPath();ctx.arc(0,0,r,a+.03,a+(i%3===0?.32:.56));ctx.stroke();}}
ctx.globalAlpha=.35;ctx.lineWidth=1;for(let i=0;i<72;i++){const a=i/72*Math.PI*2,r=radius*1.23;ctx.beginPath();ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);ctx.lineTo(Math.cos(a)*(r+(i%6===0?9:3)),Math.sin(a)*(r+(i%6===0?9:3)));ctx.stroke();}
if(solo){ctx.globalAlpha=.65;ctx.beginPath();ctx.ellipse(0,radius*.73,radius*1.3,radius*.2,-.1,0,Math.PI*2);ctx.stroke();}
ctx.restore();ctx.globalAlpha=1;canvas.dataset.rendered='true';};raf=requestAnimationFrame(render);dispose.push(()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();removeEventListener('pointermove',move);});}
const journey=fusion?null:document.querySelector('.relay-journey'),track=document.querySelector('.journey-track');
const theatre=document.querySelector('.theatre-screen');let queued=false;
const update=()=>{queued=false;if(journey&&track){const r=journey.getBoundingClientRect();const progress=phone.matches||reduce.matches?0:Math.max(0,Math.min(1,-r.top/Math.max(1,journey.offsetHeight-innerHeight)));const ease=x=>x*x*(3-2*x);const travel=progress<.15?0:progress<.35?ease((progress-.15)/.2):progress<.65?1:progress<.85?1+ease((progress-.65)/.2):2;track.style.transform=`translate3d(${-travel/2*(track.scrollWidth-track.parentElement.clientWidth)}px,0,0)`;journey.style.setProperty('--journey',progress.toFixed(4));journey.dataset.progress=String(progress);const label=document.querySelector('.journey-count');if(label)label.textContent=['Conversation','Context','Action'][Math.round(travel)];}
if(theatre){const r=theatre.getBoundingClientRect(),p=Math.max(0,Math.min(1,1-r.top/innerHeight));theatre.style.setProperty('--theatre-tilt',(reduce.matches?0:9*(1-p))+'deg');theatre.style.setProperty('--theatre-scale',String(reduce.matches?1:.93+.07*p));}};
const request=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});update();dispose.push(()=>{removeEventListener('scroll',request);removeEventListener('resize',request);});
addEventListener('pagehide',()=>dispose.forEach(fn=>fn()),{once:true});
})();

