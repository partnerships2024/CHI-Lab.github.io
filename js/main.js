(async function(){
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let lab,team;
try{
  [lab,team]=await Promise.all([fetch('data/lab.json').then(r=>r.json()),fetch('data/team.json').then(r=>r.json())]);
}catch(e){
  $('#grid').innerHTML='<p class="empty">Content could not load. Open the site through GitHub Pages or a local server (for example: python -m http.server) instead of opening the file directly.</p>';
  return;
}
$('#headline').textContent=lab.headline;$('#intro').textContent=lab.intro;
$('#parent').textContent=lab.parent+' research lab';
$('#mission-text').textContent=lab.mission;
$('#pillars').innerHTML=lab.pillars.map(p=>`<li><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join('');
$('#mail').href='mailto:'+lab.contact.email;
$('#foot').textContent=`${lab.short} · ${lab.parent} · ${new Date().getFullYear()}`;

const tiers=['All',...new Set(team.map(t=>t.tier))];let tier='All',term='';
$('#chips').innerHTML=tiers.map(t=>`<button class="chip" aria-pressed="${t==='All'}" data-t="${esc(t)}">${esc(t)}</button>`).join('');
const initials=n=>n.replace(/^(Dr\.|Md\.)\s*/,'').split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('');
function render(){
  const list=team.filter(m=>(tier==='All'||m.tier===tier)&&(m.name+m.domain+m.role+m.tags.join(' ')+m.contribution).toLowerCase().includes(term));
  $('#grid').innerHTML=list.map((m,i)=>`<article class="card${m.tier==='Leadership'&&i===0&&tier==='All'&&!term?' lead-card':''}">
    <div class="head">${m.photo?`<img class="avatar" src="${esc(m.photo)}" alt="${esc(m.name)}">`:`<div class="avatar" aria-hidden="true">${esc(initials(m.name))}</div>`}
    <div><h3>${esc(m.name)}</h3><p class="meta">${esc(m.role)}</p></div></div>
    <p class="domain">${esc(m.domain)}</p>
    <div class="tags">${m.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
    <details class="more"><summary>Potential contribution</summary><p>${esc(m.contribution)}</p></details></article>`).join('');
  $('#empty').hidden=list.length>0;
}
$('#chips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;tier=b.dataset.t;
  document.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',c===b));render();});
$('#q').addEventListener('input',e=>{term=e.target.value.trim().toLowerCase();render();});
render();

const cv=$('#net'),cx=cv.getContext('2d');
if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
let W,H,pts=[],mx=-999,my=-999;
function size(){const d=devicePixelRatio||1;W=cv.clientWidth;H=cv.clientHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);
  pts=Array.from({length:Math.min(90,Math.floor(W*H/14000))},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35}));}
size();addEventListener('resize',size);
cv.parentElement.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;});
(function tick(){
  cx.clearRect(0,0,W,H);
  for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;}
  for(let i=0;i<pts.length;i++){const a=pts[i];
    for(let j=i+1;j<pts.length;j++){const b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<140){const near=Math.hypot((a.x+b.x)/2-mx,(a.y+b.y)/2-my)<160;
        cx.strokeStyle=`rgba(92,224,184,${(1-d/140)*(near?.7:.22)})`;cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke();}}
    cx.fillStyle='rgba(92,224,184,.8)';cx.beginPath();cx.arc(a.x,a.y,2,0,6.3);cx.fill();}
  requestAnimationFrame(tick);
})();
})();
