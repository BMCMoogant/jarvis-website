/* Original supplied fluid simulation: same advection, pressure and glyphs. */
window.createPointerField=()=>{
const layer=document.createElement('div');layer.className='site-cursor-layer';layer.setAttribute('aria-hidden','true');layer.style.setProperty('mix-blend-mode','normal','important');const canvas=document.createElement('canvas');canvas.className='site-cursor';layer.append(canvas);document.body.append(layer);
const reduce=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(pointer:fine)');let engine=null;
const filter=e=>{canvas.dataset.pointerX=String(e.clientX);canvas.dataset.pointerY=String(e.clientY);const accept=!e.target.closest('header,input,button,textarea,select,.media-dialog');canvas.dataset.suppressed=String(!accept);return accept;};
const mask=()=>{const header=document.querySelector('header'),bottom=header?Math.max(0,header.getBoundingClientRect().bottom):0;layer.style.maskImage=bottom>0?`linear-gradient(to bottom,transparent 0px,transparent ${bottom-8}px,#000 ${bottom+8}px)`:'none';};
const mount=()=>{engine?.destroy();engine=null;layer.hidden=reduce.matches||!fine.matches;if(!layer.hidden)engine=window.createAsciiFluid?.(canvas,{theme:'dark',color:'#c8d4e4',backgroundColor:'#000000',charset:' .·:+*#',cellSize:11,force:1.45,brush:.42,dissipation:.055,animate:false,pointerFilter:filter});canvas.dataset.active=String(!!engine);mask();};
mount();reduce.addEventListener('change',mount);fine.addEventListener('change',mount);addEventListener('scroll',mask,{passive:true});addEventListener('resize',mask,{passive:true});return{destroy(){engine?.destroy();reduce.removeEventListener('change',mount);fine.removeEventListener('change',mount);removeEventListener('scroll',mask);removeEventListener('resize',mask);layer.remove();}};
};
