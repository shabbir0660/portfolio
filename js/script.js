const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const root=document.documentElement;
/* loader (with safety fallback) */
const hide=()=>$('#loader').classList.add('hide');
addEventListener('load',()=>setTimeout(hide,450));setTimeout(hide,3500);
$('#yr').textContent=new Date().getFullYear();
/* mobile menu */
const nav=$('#navbar'),menu=$('#menu');
const setMenu=o=>{nav.classList.toggle('open',o);menu.classList.toggle('open',o);menu.setAttribute('aria-expanded',o)};
menu.onclick=()=>setMenu(!nav.classList.contains('open'));
$$('#navbar a').forEach(a=>a.onclick=()=>setMenu(false));
/* scroll: progress, sticky header, active link, parallax */
const secs=$$('main section'),links=$$('#navbar a');
function onScroll(){
  const y=scrollY,h=root.scrollHeight-innerHeight;
  $('#progress').style.width=(y/h*100)+'%';$('#header').classList.toggle('stuck',y>60);
  root.style.setProperty('--sy',Math.min(y,900));
  secs.forEach(s=>{if(y>=s.offsetTop-220&&y<s.offsetTop+s.offsetHeight-220)links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+s.id))});
}
addEventListener('scroll',onScroll,{passive:true});onScroll();
/* rotating role words */
const roles=['Web Developer','Graphic Designer','Automation Specialist','BPO Support Professional','AI Prompt Specialist'];
let ri=0;const sw=$('#swap');
setInterval(()=>{sw.classList.add('out');setTimeout(()=>{ri=(ri+1)%roles.length;sw.textContent=roles[ri];sw.classList.remove('out');sw.classList.add('pre');void sw.offsetWidth;sw.classList.remove('pre')},450)},2600);
/* reveal on scroll */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;
  const el=e.target;el.classList.add('in');io.unobserve(el);setTimeout(()=>el.classList.add('done'),1100)}),{threshold:.1});
$$('.reveal').forEach((el,i)=>{el.style.setProperty('--d',(i%3)*.1+'s');io.observe(el)});
const hio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');hio.unobserve(e.target)}}),{threshold:.2});
$$('section').forEach(s=>hio.observe(s));
/* safety: anything at/above the viewport bottom is always revealed (deep links, fast jumps) */
function sweep(){$$('.reveal:not(.in)').forEach(el=>{if(el.getBoundingClientRect().top<innerHeight){el.classList.add('in');setTimeout(()=>el.classList.add('done'),1100)}})}
addEventListener('scroll',sweep,{passive:true});addEventListener('load',()=>setTimeout(sweep,300));
/* counters */
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;
  const el=e.target,end=+el.dataset.count,suf=el.dataset.suffix||'';let n=0;
  const id=setInterval(()=>{n+=Math.max(1,end/40);if(n>=end){n=end;clearInterval(id)}el.textContent=Math.round(n)+suf},35);co.unobserve(el)}),{threshold:.6});
$$('[data-count]').forEach(el=>co.observe(el));
/* portfolio gallery thumbnails */
$$('.proj').forEach(p=>{const main=p.querySelector('.pmain');
  p.querySelectorAll('.thumbs button').forEach(b=>b.onclick=()=>{
    p.querySelectorAll('.thumbs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
    main.style.opacity=0;setTimeout(()=>{main.src=b.dataset.src;main.style.opacity=1},200)})});
/* showcase: filter + lightbox */

/* live preview popup */
const pv=$('#pv'),pvi=$('#pvi'),pvf=$('#pvf');
function openPrev(src,title){$('#pvt').textContent=title+' — Live Preview';$('#pvo').href=src;pvi.src=src;pv.classList.add('on');pv.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setDev('d')}
function closePrev(){pv.classList.remove('on');pv.setAttribute('aria-hidden','true');pvi.removeAttribute('src');document.body.style.overflow=''}
function setDev(w){pvf.className='pvframe '+w;$$('#pvdev button').forEach(b=>b.classList.toggle('on',b.dataset.w===w))}
document.addEventListener('click',e=>{const d=e.target.closest('[data-demo]');if(d){e.preventDefault();openPrev(d.dataset.demo,d.dataset.title)}});
$('#pvx').onclick=closePrev;$('#pvdev').onclick=e=>{const b=e.target.closest('button');if(b)setDev(b.dataset.w)};
addEventListener('keydown',e=>{if(e.key==='Escape'&&pv.classList.contains('on'))closePrev()});
/* background spotlight follows cursor (drifts by itself on touch) */
let tx=innerWidth*.6,ty=innerHeight*.35,cx=tx,cy=ty,last=0;
addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){tx=e.clientX;ty=e.clientY;last=performance.now()}});
(function loop(t){
  if(t-last>3000){tx=innerWidth*(.5+.35*Math.sin(t/4000));ty=innerHeight*(.4+.25*Math.cos(t/5200))}
  cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;root.style.setProperty('--mx',cx+'px');root.style.setProperty('--my',cy+'px');requestAnimationFrame(loop)})(0);
/* card spotlight + magnetic buttons */
$$('.spot').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--x',e.clientX-r.left+'px');c.style.setProperty('--y',e.clientY-r.top+'px')}));
if(matchMedia('(hover:hover)').matches)$$('.mag').forEach(b=>{
  b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.2}px)`});
  b.addEventListener('pointerleave',()=>b.style.transform='')});
/* contact form (Google Apps Script) */
const scriptURL='https://script.google.com/macros/s/AKfycbwUOmis47-LEjG-6Bl7BpabPl1sDKxVHLs6HNDjbCXD-qMp3TQqf874P42M-QmBvmjErw/exec';
const form=$('#contactForm'),st=$('#status');
form.addEventListener('submit',e=>{
  e.preventDefault();const btn=form.querySelector('button');const old=btn.innerHTML;
  btn.disabled=true;btn.textContent='Sending...';st.className='status';st.textContent='';
  fetch(scriptURL,{method:'POST',mode:'no-cors',body:new FormData(form)})
    .then(()=>{st.className='status ok';st.textContent='Thank you! Your message has been sent. I will get back to you shortly.';form.reset()})
    .catch(()=>{st.className='status err';st.innerHTML='Sorry, the message could not be sent. Please email <a href="mailto:shabbir0660@gmail.com">shabbir0660@gmail.com</a> or use WhatsApp.'})
    .finally(()=>{btn.disabled=false;btn.innerHTML=old});
});
