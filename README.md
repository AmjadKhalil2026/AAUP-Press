# AAUP-Press
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PressLens — Journalist Analytics Dashboard</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --gold: #ffa200; --blue: #4a90d9; --green: #3cb87a;
    --red: #d9ff00e8; --purple: #2e0b5c; --orange: #d97a3a; --teal: #3ab8c8;
    --bg: #0f0f0f; --card: #1b1b1b; --card2: #2e2e2e; --border: #1e1e3f;
    --text: #fafafa; --muted: #ffffff; --subtle: #ffc400;
  }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; padding: 32px 20px; }
  a { color: inherit; }

  /* Layout */
  .container { max-width: 1100px; margin: 0 auto; }

  /* Header */
  .header { display: flex; align-items: center; justify-content: center; margin-bottom: 10px; flex-wrap: wrap; gap: 14px; }
  .logo { font-family: 'Playfair Display', serif; font-size: 44px; font-weight: 900; line-height: 1; letter-spacing: -1px; }
  .logo .press { color: var(--gold); font-style: italic; }
  .logo .lens { color: #fff; }
  .tagline { color: var(--muted); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; margin-top: 6px; }
  .header-btns { display: flex; gap: 10px; flex-wrap: wrap; }
  .btn { font-size: 13px; padding: 9px 18px; border-radius: 8px; border: 1px solid; cursor: pointer; font-weight: 500; font-family: 'DM Sans', sans-serif; transition: all .18s; display: inline-flex; align-items: center; gap: 6px; }
  .btn:hover { opacity: 0.85; transform: translateY(-1px); }
  .btn:active { transform: scale(0.97); }
  .btn-gold { background: var(--gold); color: #0b0b1a; border-color: var(--gold); }
  .btn-outline { background: transparent; color: var(--gold); border-color: var(--gold); }

  /* Stat Cards */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 24px 0 16px; }
  .stat-card { background: linear-gradient(135deg, var(--card2), var(--card)); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; position: relative; overflow: hidden; }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 14px 14px 0 0; }
  .stat-card.gold::before { background: var(--gold); }
  .stat-card.blue::before { background: var(--blue); }
  .stat-card.green::before { background: var(--green); }
  .stat-card.red::before { background: var(--red); }
  .stat-val { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; margin-bottom: 3px; }
  .stat-lbl { font-size: 10px; text-transform: uppercase; letter-spacing: .1em; color: var(--muted); margin-bottom: 5px; }
  .stat-sub { font-size: 11px; color: var(--subtle); }

  /* Highlight Cards */
  .highlight-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
  .hl-card { background: linear-gradient(135deg, var(--card2), var(--card)); border: 1px solid var(--border); border-radius: 14px; padding: 16px 20px; display: flex; align-items: center; gap: 14px; transition: border-color .2s; }
  .hl-card:hover { border-color: #333; }
  .hl-icon { width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .hl-label { font-size: 10px; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 3px; }
  .hl-name { font-weight: 500; font-size: 14px; color: var(--text); }
  .hl-meta { font-size: 11px; color: var(--muted); margin-top: 2px; }

  /* Charts */
  .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
  .chart-card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; }
  .chart-title { font-size: 11px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: .09em; margin-bottom: 14px; }

  /* Filters */
  .filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; align-items: center; }
  .search { font-size: 13px; padding: 8px 14px; border-radius: 8px; border: 1px solid var(--border); background: var(--card); color: var(--text); font-family: 'DM Sans', sans-serif; flex: 1; min-width: 180px; outline: none; transition: border-color .2s; }
  .search:focus { border-color: var(--gold); }
  .search::placeholder { color: var(--subtle); }
  .pills { display: flex; gap: 6px; flex-wrap: wrap; }
  .pill { font-size: 11px; padding: 5px 13px; border-radius: 20px; border: 1px solid var(--border); cursor: pointer; font-weight: 500; transition: all .15s; background: transparent; color: var(--muted); font-family: 'DM Sans', sans-serif; }
  .pill.active { color: #fff; }
  .pill:hover:not(.active) { border-color: #444; color: var(--text); }

  /* Table */
  .table-wrap { background: var(--card); border-radius: 16px; border: 1px solid var(--border); overflow: auto; box-shadow: 0 8px 40px rgba(0,0,0,.5); }
  table { width: 100%; border-collapse: collapse; min-width: 760px; }
  thead th { padding: 11px 14px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .09em; color: var(--muted); border-bottom: 1px solid var(--border); cursor: pointer; white-space: nowrap; font-family: 'Playfair Display', serif; font-weight: 700; user-select: none; transition: color .15s; }
  thead th:hover { color: var(--text); }
  thead th.sorted { color: var(--gold); }
  tbody tr { border-bottom: 1px solid rgba(30,30,63,.8); transition: background .12s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: rgba(255,255,255,.03); }
  td { padding: 12px 14px; font-size: 13px; vertical-align: middle; }
  .rank { color: var(--subtle); font-size: 12px; font-weight: 500; }
  .jname { font-weight: 500; color: var(--text); }
  .badge { display: inline-block; font-size: 11px; padding: 3px 11px; border-radius: 20px; font-weight: 600; letter-spacing: .03em; }
  .bar-wrap { display: flex; align-items: center; gap: 8px; }
  .bar-val { min-width: 34px; font-size: 12px; font-weight: 500; }
  .bar-bg { flex: 1; height: 6px; background: rgba(255,255,255,.07); border-radius: 3px; overflow: hidden; min-width: 55px; }
  .bar-fill { height: 100%; border-radius: 3px; transition: width .5s cubic-bezier(.4,0,.2,1); }
  .stars { color: var(--gold); font-size: 12px; letter-spacing: 1px; }
  .stars .dim { color: rgba(255,255,255,.15); }
  .action-btn { font-size: 11px; padding: 5px 11px; border-radius: 6px; border: 1px solid; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; background: transparent; }
  .action-btn:hover { opacity: .8; }
  .action-btn.edit { color: var(--gold); border-color: rgba(224,160,48,.4); }
  .action-btn.del  { color: var(--red);  border-color: rgba(217,90,90,.4); }

  .footer-note { text-align: right; color: var(--subtle); font-size: 12px; margin-top: 10px; }

  /* Animations */
  @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .anim { animation: fadeUp .32s ease both; }

  /* Modal */
  .modal-bg { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.65); z-index: 100; align-items: center; justify-content: center; }
  .modal-bg.open { display: flex; }
  .modal { background: var(--card2); border: 1px solid var(--border); border-radius: 16px; padding: 28px; width: 340px; max-width: 95vw; }
  .modal h3 { font-family: 'Playfair Display', serif; color: var(--gold); font-size: 20px; margin-bottom: 18px; }
  .field { margin-bottom: 14px; }
  .field label { display: block; font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 5px; }
  .field input, .field select { width: 100%; background: var(--bg); color: var(--text); border: 1px solid var(--border); border-radius: 7px; padding: 8px 11px; font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color .2s; }
  .field input:focus, .field select:focus { border-color: var(--gold); }
  .field select option { background: var(--card2); }
  .modal-btns { display: flex; gap: 10px; margin-top: 18px; }
  .modal-btns .btn { flex: 1; justify-content: center; }

  /* Responsive */
  @media (max-width: 680px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .highlight-grid { grid-template-columns: 1fr; }
    .charts-row { grid-template-columns: 1fr; }
    .logo { font-size: 32px; }
  }
</style>
</head>
<body>
<div class="container">

  <!-- Header -->
  <div class="header">
    <div>
      <div class="logo"><span class="press">Press</span><span class="lens">Lens عدسة الصحافة </span></div>
      <div class="tagline">Introduction to coding for journalists AAUP - Instructor:Amjad Khalil</div>
    </div>
    <div class="header-btns">
      <button class="btn btn-gold" onclick="openModal()">＋ Add Journalist</button>
      <button class="btn btn-outline" onclick="downloadCSV()">↓ Export CSV</button>
      <button class="btn btn-outline" onclick="window.location.href='about the project.htm'">About-This-Project</button>
    </div>
  </div>

  <!-- Stat Cards -->
  <div class="stats-grid" id="statCards"></div>

  <!-- Highlight Row -->
  <div class="highlight-grid" id="hlRow"></div>

  <!-- Charts -->
  <div class="charts-row">
    <div class="chart-card">
      <div class="chart-title">★ Ratings Overview</div>
      <div style="position:relative;height:200px">
        <canvas id="chartRating" role="img" aria-label="Horizontal bar chart of journalist ratings">Ratings from 7.1 to 9.5.</canvas>
      </div>
    </div>
    <div class="chart-card">
      <div class="chart-title">◎ Spread by Specialization</div>
      <div style="position:relative;height:200px">
        <canvas id="chartPie" role="img" aria-label="Donut chart of social spread by beat">Sports leads with 312K impressions.</canvas>
      </div>
    </div>
  </div>

  <!-- Filters -->
  <div class="filters">
    <input class="search" type="text" id="searchInput" placeholder="🔍  Search journalists…" oninput="render()">
    <div class="pills" id="pills"></div>
  </div>

  <!-- Table -->
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th onclick="setSort('name')">Journalist <span id="s-name"></span></th>
          <th onclick="setSort('specialization')">Beat <span id="s-specialization"></span></th>
          <th onclick="setSort('articles')">Articles <span id="s-articles"></span></th>
          <th onclick="setSort('social_posts')">Social Posts <span id="s-social_posts"></span></th>
          <th onclick="setSort('spread')">Spread <span id="s-spread"></span></th>
          <th onclick="setSort('rating')" class="sorted">Rating <span id="s-rating">↓</span></th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="tbody"></tbody>
    </table>
  </div>
  <div class="footer-note" id="footer"></div>
       <footer>
    <footer>
    <div class="ft", align ="center">Press-Lens مشروع عدسة الصحافة</div>
    <p align ="center">Introduction to coding for journalists AAUP - Instructor: Amjad Khalil</p>
    <p style="margin-top:8px;font-size:1rem;opacity:.7", align ="center">Arab American University · Ramallah Campus · Faculty of Modern Media</p>
    </footer>
</div>


<!-- Modal -->
<div class="modal-bg" id="modalBg">
  <div class="modal">
    <h3 id="modalTitle">Add Journalist</h3>
    <div class="field"><label>Full Name</label><input id="f-name" type="text" placeholder="e.g. Sara Ahmed"></div>
    <div class="field"><label>Specialization</label>
      <select id="f-spec">
        <option>Sports</option><option>Politics</option><option>Culture</option>
        <option>Technology</option><option>Economy</option><option>Health</option><option>Environment</option>
      </select>
    </div>
    <div class="field"><label>Articles Published</label><input id="f-articles" type="number" min="0" placeholder="e.g. 120"></div>
    <div class="field"><label>Social Posts</label><input id="f-posts" type="number" min="0" placeholder="e.g. 980"></div>
    <div class="field"><label>Social Spread (impressions)</label><input id="f-spread" type="number" min="0" placeholder="e.g. 87400"></div>
    <div class="field"><label>Rating (0 – 10)</label><input id="f-rating" type="number" min="0" max="10" step="0.1" placeholder="e.g. 8.5"></div>
    <div class="modal-btns">
      <button class="btn btn-gold" onclick="saveModal()">Save</button>
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
    </div>
  </div>
</div>

<script>
const SPEC_COLORS = {
  Sports:'#d97a3a', Politics:'#d95a5a', Culture:'#9b6dd9',
  Technology:'#4a90d9', Economy:'#e0a030', Health:'#3cb87a', Environment:'#3ab8c8'
};

let data = [
  {id:1, name:'رزان إدريس',    specialization:'Sports',      articles:201, social_posts:3400, spread:312000, rating:9.5},
  {id:2, name:'Bahaa Abassi',    specialization:'Politics',    articles:142, social_posts:980,  spread:87400,  rating:9.2},
  {id:3, name:'Mais Ibrahim',    specialization:'Culture',     articles:63,  social_posts:2100, spread:210000, rating:8.9},
  {id:4, name:'Habiba Shadid',   specialization:'Technology',  articles:98,  social_posts:1520, spread:134000, rating:8.7},
  {id:5, name:'Masara Qirish',   specialization:'Technology',  articles:87,  social_posts:1750, spread:178000, rating:8.6},
  {id:6, name:'قصي نعسان',   specialization:'Politics',    articles:130, social_posts:1100, spread:102000, rating:8.4},
  {id:7, name:'Karla Jalad',     specialization:'Economy',     articles:115, social_posts:870,  spread:91000,  rating:8.1},
  {id:8, name:'Falastin Hussain',specialization:'Economy',     articles:109, social_posts:760,  spread:74500,  rating:7.9},
  {id:9, name:'بلقيس عرار',    specialization:'Health',      articles:76,  social_posts:640,  spread:52300,  rating:7.4},
  {id:10,name:'Malak Malah',     specialization:'Environment', articles:54,  social_posts:490,  spread:38700,  rating:7.1},
];

let sortKey='rating', sortDir=-1, filterSpec='All', editingId=null;
const specs=['All',...Object.keys(SPEC_COLORS)];

function fmt(n){ return n>=1000000?(n/1000000).toFixed(1)+'M':n>=1000?(n/1000).toFixed(0)+'K':String(n); }

function starsHtml(r){
  const full=Math.floor(r/2), half=(r%2)>=1, empty=5-full-(half?1:0);
  return `<span class="stars">${'★'.repeat(full)}${half?'<span style="font-size:10px">½</span>':''}${'<span class="dim">☆</span>'.repeat(empty)}</span>`;
}

function badgeHtml(spec){
  const c=SPEC_COLORS[spec]||'#888';
  return `<span class="badge" style="background:${c}22;color:${c};border:1px solid ${c}44">${spec}</span>`;
}

function filtered(){
  const q=document.getElementById('searchInput').value.toLowerCase();
  return data.filter(j=>
    (filterSpec==='All'||j.specialization===filterSpec)&&
    (j.name.toLowerCase().includes(q)||j.specialization.toLowerCase().includes(q))
  );
}

function sorted(arr){
  return [...arr].sort((a,b)=>{
    const av=a[sortKey],bv=b[sortKey];
    return typeof av==='string'?av.localeCompare(bv)*sortDir:(av-bv)*sortDir;
  });
}

function setSort(k){ if(sortKey===k)sortDir*=-1; else{sortKey=k;sortDir=-1;} render(); }

function renderPills(){
  document.getElementById('pills').innerHTML=specs.map(s=>{
    const active=s===filterSpec;
    const c=SPEC_COLORS[s]||'var(--gold)';
    return `<button class="pill${active?' active':''}" onclick="setSpec('${s}')"
      style="${active?`background:${c};border-color:${c};`:''}">
      ${s}
    </button>`;
  }).join('');
}

function setSpec(s){ filterSpec=s; render(); }

function renderStatCards(){
  const avg=(data.reduce((s,d)=>s+d.rating,0)/data.length).toFixed(2);
  const totArt=data.reduce((s,d)=>s+d.articles,0);
  const totSpread=data.reduce((s,d)=>s+d.spread,0);
  const top=[...data].sort((a,b)=>b.rating-a.rating)[0];
  document.getElementById('statCards').innerHTML=`
    <div class="stat-card gold anim" style="animation-delay:.00s">
      <div class="stat-lbl">Avg Rating</div>
      <div class="stat-val" style="color:var(--gold)">${avg}</div>
      <div class="stat-sub">across all journalists</div>
    </div>
    <div class="stat-card blue anim" style="animation-delay:.05s">
      <div class="stat-lbl">Total Articles</div>
      <div class="stat-val" style="color:var(--blue)">${totArt.toLocaleString()}</div>
      <div class="stat-sub">published</div>
    </div>
    <div class="stat-card green anim" style="animation-delay:.10s">
      <div class="stat-lbl">Total Spread</div>
      <div class="stat-val" style="color:var(--green)">${fmt(totSpread)}</div>
      <div class="stat-sub">social impressions</div>
    </div>
    <div class="stat-card red anim" style="animation-delay:.15s">
      <div class="stat-lbl">Top Journalist</div>
      <div class="stat-val" style="color:var(--red);font-size:20px">${top.name.split(' ')[0]}</div>
      <div class="stat-sub">Rating ${top.rating}</div>
    </div>
  `;
}

function renderHighlights(){
  const byRating=[...data].sort((a,b)=>b.rating-a.rating)[0];
  const bySpread=[...data].sort((a,b)=>b.spread-a.spread)[0];
  const byArt=[...data].sort((a,b)=>b.articles-a.articles)[0];
  const hl=(emoji,col,label,name,sub)=>`
    <div class="hl-card anim">
      <div class="hl-icon" style="background:${col}22;color:${col}">${emoji}</div>
      <div>
        <div class="hl-label" style="color:${col}">${label}</div>
        <div class="hl-name">${name}</div>
        <div class="hl-meta">${sub}</div>
      </div>
    </div>`;
  document.getElementById('hlRow').innerHTML=
    hl('🏆','var(--gold)','Best Rated Journalist',byRating.name,`Rating ${byRating.rating} · ${byRating.specialization}`)+
    hl('📡','var(--green)','Highest Social Spread',bySpread.name,`${fmt(bySpread.spread)} impressions · ${bySpread.specialization}`)+
    hl('📰','var(--blue)','Most Articles Published',byArt.name,`${byArt.articles} articles · ${byArt.specialization}`);
}

let chartR=null, chartP=null;
function renderCharts(){
  const byRating=[...data].sort((a,b)=>b.rating-a.rating);
  const rColors=byRating.map(d=>SPEC_COLORS[d.specialization]||'#888');

  if(chartR) chartR.destroy();
  chartR=new Chart(document.getElementById('chartRating'),{
    type:'bar',
    data:{
      labels:byRating.map(d=>d.name.split(' ')[0]),
      datasets:[{
        label:'Rating', data:byRating.map(d=>d.rating),
        backgroundColor:rColors.map(c=>c+'bb'), borderColor:rColors,
        borderWidth:0, borderRadius:4
      }]
    },
    options:{
      indexAxis:'y', responsive:true, maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>`Rating: ${c.raw}`}}},
      scales:{
        x:{min:6,max:10,ticks:{color:'#666',font:{size:10}},grid:{color:'rgba(255,255,255,.05)'}},
        y:{ticks:{color:'#888',font:{size:10}},grid:{display:false}}
      }
    }
  });

  const specSpread={};
  data.forEach(d=>{ specSpread[d.specialization]=(specSpread[d.specialization]||0)+d.spread; });
  const sLabels=Object.keys(specSpread), sVals=Object.values(specSpread);
  const sPalette=sLabels.map(s=>SPEC_COLORS[s]||'#888');

  if(chartP) chartP.destroy();
  chartP=new Chart(document.getElementById('chartPie'),{
    type:'doughnut',
    data:{
      labels:sLabels,
      datasets:[{
        data:sVals,
        backgroundColor:sPalette.map(c=>c+'bb'),
        borderColor:sPalette, borderWidth:2, hoverOffset:8
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false, cutout:'62%',
      plugins:{
        legend:{position:'right',labels:{color:'#888',font:{size:10},boxWidth:10,padding:10}},
        tooltip:{callbacks:{label:c=>`${c.label}: ${fmt(c.raw)}`}}
      }
    }
  });
}

function renderTable(){
  const rows=sorted(filtered());
  const maxArt=Math.max(...data.map(d=>d.articles));
  const maxSpread=Math.max(...data.map(d=>d.spread));

  ['name','specialization','articles','social_posts','spread','rating'].forEach(k=>{
    const el=document.getElementById('s-'+k);
    if(el) el.textContent=sortKey===k?(sortDir===-1?'↓':'↑'):'';
    const ths=document.querySelectorAll('thead th');
    ths.forEach(th=>th.classList.remove('sorted'));
    ths.forEach(th=>{ if(th.getAttribute('onclick')&&th.getAttribute('onclick').includes(sortKey)) th.classList.add('sorted'); });
  });

  document.getElementById('tbody').innerHTML=rows.map((row,i)=>`
    <tr class="anim" style="animation-delay:${i*.025}s">
      <td class="rank">#${i+1}</td>
      <td class="jname">${row.name}</td>
      <td>${badgeHtml(row.specialization)}</td>
      <td>
        <div class="bar-wrap">
          <span class="bar-val" style="color:var(--blue)">${row.articles}</span>
          <div class="bar-bg"><div class="bar-fill" style="width:${(row.articles/maxArt*100).toFixed(1)}%;background:var(--blue)"></div></div>
        </div>
      </td>
      <td style="color:var(--muted)">${row.social_posts.toLocaleString()}</td>
      <td>
        <div class="bar-wrap">
          <span class="bar-val" style="color:var(--green)">${fmt(row.spread)}</span>
          <div class="bar-bg"><div class="bar-fill" style="width:${(row.spread/maxSpread*100).toFixed(1)}%;background:var(--green)"></div></div>
        </div>
      </td>
      <td>${starsHtml(row.rating)} <span style="color:var(--muted);font-size:11px;margin-left:4px">${row.rating.toFixed(1)}</span></td>
      <td style="white-space:nowrap">
        <button class="action-btn edit" onclick="openEdit(${row.id})">✏ Edit</button>
        <button class="action-btn del" onclick="delRow(${row.id})" style="margin-left:6px">✕</button>
      </td>
    </tr>
  `).join('');

  document.getElementById('footer').textContent=`Showing ${rows.length} of ${data.length} journalists`;
}

function render(){
  renderPills(); renderStatCards(); renderHighlights(); renderCharts(); renderTable();
}

// Modal
function openModal(){
  editingId=null;
  document.getElementById('modalTitle').textContent='Add Journalist';
  ['name','articles','posts','spread','rating'].forEach(f=>document.getElementById('f-'+f).value='');
  document.getElementById('f-spec').value='Politics';
  document.getElementById('modalBg').classList.add('open');
}

function openEdit(id){
  const row=data.find(d=>d.id===id);
  editingId=id;
  document.getElementById('modalTitle').textContent='Edit Journalist';
  document.getElementById('f-name').value=row.name;
  document.getElementById('f-spec').value=row.specialization;
  document.getElementById('f-articles').value=row.articles;
  document.getElementById('f-posts').value=row.social_posts;
  document.getElementById('f-spread').value=row.spread;
  document.getElementById('f-rating').value=row.rating;
  document.getElementById('modalBg').classList.add('open');
}

function closeModal(){ document.getElementById('modalBg').classList.remove('open'); editingId=null; }

function saveModal(){
  const name=document.getElementById('f-name').value.trim();
  if(!name){ alert('Name is required'); return; }
  const obj={
    id: editingId||Math.max(...data.map(d=>d.id))+1,
    name,
    specialization:document.getElementById('f-spec').value,
    articles:+document.getElementById('f-articles').value||0,
    social_posts:+document.getElementById('f-posts').value||0,
    spread:+document.getElementById('f-spread').value||0,
    rating:Math.min(10,Math.max(0,parseFloat(document.getElementById('f-rating').value)||0)),
  };
  if(editingId) data=data.map(d=>d.id===editingId?obj:d);
  else data.push(obj);
  closeModal(); render();
}

function delRow(id){
  if(confirm('Remove this journalist from the dashboard?')){ data=data.filter(d=>d.id!==id); render(); }
}

// Close modal on backdrop click
document.getElementById('modalBg').addEventListener('click',function(e){ if(e.target===this) closeModal(); });

// CSV Export
function downloadCSV(){
  const headers=['ID','Name','Specialization','Articles','Social Posts','Spread','Rating'];
  const rows=data.map(d=>[d.id,`"${d.name}"`,d.specialization,d.articles,d.social_posts,d.spread,d.rating]);
  const csv=[headers,...rows].map(r=>r.join(',')).join('\n');
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  a.download='journalists_data.csv';
  a.click();
}

render();
</script>
</body>
</html>
