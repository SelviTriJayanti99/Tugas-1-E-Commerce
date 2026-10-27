(function(){
'use strict';
const $=id=>document.getElementById(id);
const rp=n=>'Rp'+Number(n).toLocaleString('id-ID');
const dt=s=>new Date(String(s).replace(' ','T'));
const fmt=s=>dt(s).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'});
const OSTAT=['baru','diproses','selesai','dibatalkan'],BSTAT=['menunggu','dikonfirmasi','selesai','dibatalkan'];
let user=null,hist={orders:[],bookings:[]},editId=null,curTab='orders';

function el(t,txt,cls){const e=document.createElement(t);if(txt!=null)e.textContent=txt;if(cls)e.className=cls;return e}
function msg(id,t,ok){const m=$(id);m.className='msg '+(ok?'ok':'err');m.textContent=t}
function toast(t){const e=$('toast');e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>{e.hidden=true},3500)}
function tag(t,s){return el('span',t,'tag s-'+s)}
function addRow(tb,cells){const tr=document.createElement('tr');cells.forEach(c=>{const td=document.createElement('td');td.appendChild(c instanceof Node?c:document.createTextNode(String(c)));tr.appendChild(td)});tb.appendChild(tr)}
function sel(opts,cur,fn){
  const s=el('select',null,'sm');
  opts.forEach(o=>{const p=el('option',o);p.value=o;s.appendChild(p)});
  s.value=cur;
  s.onchange=async()=>{try{await fn(s.value);cur=s.value;loadStats().catch(()=>{})}catch(e){s.value=cur;toast(e.message)}};
  return s;
}

async function api(file,action,data){
  const o={credentials:'same-origin'};
  if(data!==undefined){o.method='POST';o.headers={'Content-Type':'application/json'};o.body=JSON.stringify(data)}
  let res;
  try{res=await fetch('api/'+file+'.php?action='+action,o)}
  catch(e){throw new Error('Server tidak terjangkau. Buka lewat http://localhost/loka-web/ dan pastikan Apache & MySQL menyala.')}
  let j={};try{j=await res.json()}catch(e){}
  if(res.status===401&&user){user=null;show('login');throw new Error('Sesi berakhir, silakan masuk lagi.')}
  if(!res.ok)throw new Error(j.error||'Terjadi kesalahan ('+res.status+'). Pastikan file dijalankan lewat PHP (XAMPP).');
  return j;
}

function show(v){
  ['home','register','login','dash','admin'].forEach(n=>{$('v-'+n).hidden=(n!==v)});
  const nav=$('nav');nav.innerHTML='';
  const b=(t,cls,fn)=>{const e=el('button',t,cls);e.onclick=fn;nav.appendChild(e)};
  if(user)b('Keluar','ghost',logout);
  else{b('Masuk','ghost',()=>show('login'));b('Daftar','',()=>show('register'))}
  window.scrollTo(0,0);
}
async function enter(){
  if(user.role==='admin'){show('admin');await renderAdmin()}
  else{show('dash');await renderDash()}
}
async function logout(){
  try{await api('auth','logout',{})}catch(e){}
  user=null;show('home');
}

$('h-reg').onclick=$('to-reg').onclick=()=>show('register');
$('h-log').onclick=$('to-login').onclick=()=>show('login');
document.querySelector('.logo').onclick=()=>{if(user)enter();else show('home')};

$('f-reg').onsubmit=async e=>{
  e.preventDefault();
  const name=$('r-name').value.trim(),email=$('r-email').value.trim().toLowerCase(),phone=$('r-phone').value.trim(),password=$('r-pass').value;
  if(!name||!email||!phone||!password)return msg('r-msg','Lengkapi semua kolom.');
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))return msg('r-msg','Format email belum benar.');
  if(!/^[0-9+][0-9\s-]{8,15}$/.test(phone))return msg('r-msg','Nomor WhatsApp belum benar.');
  if(password.length<6)return msg('r-msg','Kata sandi minimal 6 karakter.');
  if(password!==$('r-pass2').value)return msg('r-msg','Kata sandi tidak sama.');
  try{const r=await api('auth','register',{name,email,phone,password});user=r.user;$('f-reg').reset();msg('r-msg','',true);enter()}
  catch(err){msg('r-msg',err.message)}
};
$('f-log').onsubmit=async e=>{
  e.preventDefault();
  const email=$('l-email').value.trim().toLowerCase(),password=$('l-pass').value;
  if(!email||!password)return msg('l-msg','Isi email dan kata sandi.');
  try{const r=await api('auth','login',{email,password});user=r.user;$('f-log').reset();msg('l-msg','',true);enter()}
  catch(err){msg('l-msg',err.message)}
};

/* ---------- Dashboard pelanggan ---------- */
$('b-date').min=$('b-date').value=new Date().toLocaleDateString('en-CA');
function tab(t){
  document.querySelectorAll('#v-dash .tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.t===t));
  ['order','book','hist','prof'].forEach(n=>{$('t-'+n).hidden=(n!==t)});
}
document.querySelectorAll('#v-dash .tabs button').forEach(b=>{b.onclick=()=>tab(b.dataset.t)});

async function renderDash(){
  $('d-hi').textContent='Halo, '+user.name.split(' ')[0]+'!';
  $('s-since').textContent=dt(user.created_at).toLocaleDateString('id-ID',{month:'short',year:'numeric'});
  $('p-name').value=user.name;$('p-email').value=user.email;$('p-phone').value=user.phone;
  try{
    const [m,h]=await Promise.all([api('user','menu'),api('user','history')]);
    const s=$('o-item');s.innerHTML='';
    m.menu.forEach(x=>{const o=el('option',x.name+' - '+rp(x.price));o.value=x.id;s.appendChild(o)});
    hist=h;
    $('s-ord').textContent=h.orders.length;$('s-book').textContent=h.bookings.length;
    renderHist();
  }catch(e){toast(e.message)}
}
function renderHist(){
  const rows=[];
  hist.orders.forEach(o=>rows.push({t:o.created_at,k:'Pesanan',d:o.qty+'x '+o.item_name,i:rp(o.total),s:o.status,can:o.status==='baru',type:'order',id:o.id}));
  hist.bookings.forEach(b=>rows.push({t:b.created_at,k:'Booking',d:b.booking_date+' pukul '+String(b.booking_time).slice(0,5),i:b.people+' orang',s:b.status,can:b.status==='menunggu',type:'booking',id:b.id}));
  rows.sort((a,b)=>a.t<b.t?1:a.t>b.t?-1:0);
  const tb=$('h-body');tb.innerHTML='';
  rows.forEach(r=>{
    let act='';
    if(r.can){
      act=el('button','Batalkan','ghost sm');
      act.onclick=async()=>{
        if(!confirm('Batalkan '+r.k.toLowerCase()+' ini?'))return;
        try{await api('user','cancel',{type:r.type,id:r.id});await renderDash()}catch(e){toast(e.message)}
      };
    }
    addRow(tb,[tag(r.k,'diproses'),r.d,r.i,tag(r.s,r.s),fmt(r.t),act]);
  });
  $('h-empty').hidden=rows.length>0;
}
$('o-btn').onclick=async()=>{
  const q=parseInt($('o-qty').value,10),id=+$('o-item').value;
  if(!id)return msg('o-msg','Menu belum tersedia.');
  if(!q||q<1||q>50)return msg('o-msg','Jumlah harus 1-50.');
  try{const r=await api('user','order',{menu_id:id,qty:q});msg('o-msg','Pesanan dibuat: '+r.qty+'x '+r.item+' ('+rp(r.total)+').',true);await renderDash()}
  catch(e){msg('o-msg',e.message)}
};
$('b-btn').onclick=async()=>{
  const date=$('b-date').value,time=$('b-time').value,people=parseInt($('b-ppl').value,10);
  if(!date||!time||!people||people<1||people>12)return msg('b-msg','Isi tanggal, jam, dan jumlah orang (1-12).');
  try{const r=await api('user','booking',{date,time,people});msg('b-msg','Meja dibooking untuk '+r.people+' orang, '+r.date+' pukul '+r.time+'. Menunggu konfirmasi admin.',true);await renderDash()}
  catch(e){msg('b-msg',e.message)}
};
$('p-btn').onclick=async()=>{
  const name=$('p-name').value.trim(),phone=$('p-phone').value.trim();
  if(!name||!phone)return msg('p-msg','Nama dan nomor tidak boleh kosong.');
  try{const r=await api('user','profile',{name,phone});user=r.user;msg('p-msg','Profil disimpan.',true);$('d-hi').textContent='Halo, '+user.name.split(' ')[0]+'!'}
  catch(e){msg('p-msg',e.message)}
};

/* ---------- Dashboard admin ---------- */
async function loadStats(){
  const s=await api('admin','stats');
  $('st-users').textContent=s.users;$('st-orders').textContent=s.orders;$('st-books').textContent=s.bookings;
  $('st-rev').textContent=rp(s.revenue);$('st-new').textContent=s.orders_new;$('st-pend').textContent=s.bookings_pending;$('st-login').textContent=s.logins_today;
}
async function loadOrders(){
  const r=await api('admin','orders'),tb=$('ao-body');tb.innerHTML='';
  r.orders.forEach(o=>addRow(tb,['#'+o.id,o.user_name+' ('+o.user_email+')',o.qty+'x '+o.item_name,rp(o.total),
    sel(OSTAT,o.status,v=>api('admin','order_status',{id:o.id,status:v})),fmt(o.created_at)]));
  if(!r.orders.length)addRow(tb,['','Belum ada pesanan.','','','','']);
}
async function loadBooks(){
  const r=await api('admin','bookings'),tb=$('ab-body');tb.innerHTML='';
  r.bookings.forEach(b=>addRow(tb,['#'+b.id,b.user_name+' ('+b.user_phone+')',b.booking_date+' pukul '+String(b.booking_time).slice(0,5),b.people,
    sel(BSTAT,b.status,v=>api('admin','booking_status',{id:b.id,status:v}))]));
  if(!r.bookings.length)addRow(tb,['','Belum ada booking.','','','']);
}
function resetMenuForm(){editId=null;$('m-name').value='';$('m-price').value='';$('m-active').checked=true;$('m-btn').textContent='Tambah menu';$('m-cancel').hidden=true}
async function loadMenu(){
  const r=await api('admin','menu'),tb=$('am-body');tb.innerHTML='';
  r.menu.forEach(m=>{
    const on=+m.is_active===1,act=el('div',null,'acts2');
    const e=el('button','Ubah','ghost sm');
    e.onclick=()=>{editId=m.id;$('m-name').value=m.name;$('m-price').value=m.price;$('m-active').checked=on;$('m-btn').textContent='Simpan perubahan';$('m-cancel').hidden=false;$('m-name').focus()};
    const d=el('button','Hapus','danger sm');
    d.onclick=async()=>{
      if(!confirm('Hapus menu "'+m.name+'"?'))return;
      try{await api('admin','menu_delete',{id:m.id});if(editId===m.id)resetMenuForm();loadMenu()}catch(x){toast(x.message)}
    };
    act.append(e,d);
    addRow(tb,[m.name,rp(m.price),tag(on?'Aktif':'Nonaktif',on?'selesai':'dibatalkan'),act]);
  });
}
$('m-cancel').onclick=resetMenuForm;
$('m-btn').onclick=async()=>{
  const name=$('m-name').value.trim(),price=parseInt($('m-price').value,10);
  if(!name||!price||price<1)return toast('Isi nama dan harga menu dengan benar.');
  try{await api('admin','menu_save',{id:editId,name,price,active:$('m-active').checked});toast('Menu disimpan.');resetMenuForm();loadMenu()}
  catch(e){toast(e.message)}
};
async function loadUsers(){
  const r=await api('admin','users'),tb=$('au-body');tb.innerHTML='';
  r.users.forEach(u=>{
    let act='';
    if(u.role==='user'){
      act=el('button','Hapus','danger sm');
      act.onclick=async()=>{
        if(!confirm('Hapus akun '+u.name+' beserta pesanan dan booking-nya?'))return;
        try{await api('admin','user_delete',{id:u.id});loadUsers();loadStats().catch(()=>{})}catch(x){toast(x.message)}
      };
    }
    addRow(tb,[u.name,u.email,u.phone,tag(u.role,u.role==='admin'?'selesai':'diproses'),u.orders,u.bookings,act]);
  });
}
function devUA(u){
  u=String(u||'');
  const b=/Edg\//.test(u)?'Edge':/OPR\//.test(u)?'Opera':/Chrome\//.test(u)?'Chrome':/Firefox\//.test(u)?'Firefox':/Safari\//.test(u)?'Safari':'Lainnya';
  const o=/Windows/.test(u)?'Windows':/Android/.test(u)?'Android':/iPhone|iPad/.test(u)?'iOS':/Mac OS/.test(u)?'macOS':/Linux/.test(u)?'Linux':'?';
  return b+' / '+o;
}
const LSTAT={berhasil:'selesai',gagal:'dibatalkan',keluar:'diproses'};
async function loadLogins(){
  const r=await api('admin','logins'),tb=$('al-body');tb.innerHTML='';
  r.logins.forEach(l=>addRow(tb,[fmt(l.created_at),l.user_name||'-',l.email,tag(l.status,LSTAT[l.status]),l.ip_address||'-',devUA(l.user_agent)]));
  if(!r.logins.length)addRow(tb,['','Belum ada riwayat login.','','','','']);
}
const LOADERS={orders:loadOrders,books:loadBooks,menu:loadMenu,users:loadUsers,logins:loadLogins};
async function loadTab(t){try{await LOADERS[t]()}catch(e){toast(e.message)}}
function atab(t){
  curTab=t;
  document.querySelectorAll('#v-admin .tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.a===t));
  ['orders','books','menu','users','logins'].forEach(n=>{$('ap-'+n).hidden=(n!==t)});
  loadTab(t);
}
document.querySelectorAll('#v-admin .tabs button').forEach(b=>{b.onclick=()=>atab(b.dataset.a)});
async function renderAdmin(){
  $('a-hi').textContent='Masuk sebagai '+user.name+' ('+user.email+')';
  loadStats().catch(e=>toast(e.message));
  atab(curTab);
}

(async function boot(){
  try{user=(await api('auth','me')).user}
  catch(e){const b=$('boot-err');b.textContent=e.message;b.hidden=false}
  if(user)enter();else show('home');
})();
})();
