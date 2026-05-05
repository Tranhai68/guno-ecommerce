/* Admin Core - State & Helpers */
const DB={
  get(k,d){try{const v=localStorage.getItem('guno_'+k);return v?JSON.parse(v):d}catch(e){return d}},
  set(k,v){localStorage.setItem('guno_'+k,JSON.stringify(v))},
  del(k){localStorage.removeItem('guno_'+k)}
};
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
function fmt(n){return Number(n).toLocaleString('vi-VN')+'đ'}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2200)}
function openModal(title,body,foot){$('#modalTitle').textContent=title;$('#modalBody').innerHTML=body;$('#modalFoot').innerHTML=foot||'';$('#modal').classList.add('active');$('#modalOverlay').classList.add('active')}
function closeModal(){$('#modal').classList.remove('active');$('#modalOverlay').classList.remove('active')}
$('#modalClose').onclick=$('#modalOverlay').onclick=closeModal;

/* Init default data if empty */
if(!DB.get('products')){DB.set('products',PRODUCTS)}
if(!DB.get('banners')){DB.set('banners',[
  {id:'b1',img:'https://picsum.photos/seed/guno-home/1400/520',title:'GUNO Summer Essentials',link:'collection.html?cat=nam',active:true},
  {id:'b2',img:'https://picsum.photos/seed/guno-men/1400/520',title:'Thời trang Nam',link:'collection.html?cat=nam',active:true},
  {id:'b3',img:'https://picsum.photos/seed/guno-women/1400/520',title:'Thời trang Nữ',link:'collection.html?cat=nu',active:true}
])}
if(!DB.get('navItems')){DB.set('navItems',[
  {id:'n1',label:'NEW',href:'index.html',badge:'new',active:true},
  {id:'n2',label:'NAM',href:'collection.html?cat=nam',active:true},
  {id:'n3',label:'NỮ',href:'collection.html?cat=nu',active:true},
  {id:'n4',label:'THỂ THAO',href:'collection.html?cat=the-thao',active:true},
  {id:'n5',label:'PHỤ KIỆN',href:'collection.html?cat=phu-kien',active:true},
  {id:'n6',label:'SALE',href:'collection.html?cat=sale',badge:'sale',active:true}
])}
if(!DB.get('vouchers')){DB.set('vouchers',[
  {id:'v1',code:'GUNO100',desc:'Giảm 100K đơn từ 299K',discount:100000,minOrder:299000,active:true},
  {id:'v2',code:'FREESHIP',desc:'Miễn phí ship',discount:0,freeShip:true,minOrder:0,active:true}
])}
if(!DB.get('popups')){DB.set('popups',[
  {id:'p1',title:'🎉 Chào mừng bạn!',content:'Nhập mã GUNO100 giảm ngay 100K cho đơn đầu tiên từ 299K',btnText:'Mua ngay',btnLink:'collection.html?cat=sale',active:false}
])}
if(!DB.get('policies')){DB.set('policies',[
  {id:'po1',title:'Chính sách đổi trả',content:'Đổi trả miễn phí trong 60 ngày kể từ ngày nhận hàng.'},
  {id:'po2',title:'Chính sách giao hàng',content:'Miễn phí vận chuyển đơn từ 299K. Giao 2-5 ngày toàn quốc.'},
  {id:'po3',title:'Chính sách bảo mật',content:'Thông tin cá nhân được bảo mật theo quy định pháp luật.'}
])}
if(!DB.get('orders')){DB.set('orders',[])}
if(!DB.get('settings')){DB.set('settings',{
  storeName:'GUNO',hotline:'1900.27.27.37',email:'cool@guno.vn',
  promoText:'🔥 GUNO DAY – Nhập GUNO100 giảm 100K đơn từ 299K | 🚚 Freeship từ 299K | 🔄 Đổi trả 60 ngày | 💰 GunoCash 7%',
  freeShipMin:299000,gunocashPercent:7
})}
if(!DB.get('articles')){DB.set('articles',[
  {id:'a1',type:'blog',title:'5 cách phối đồ thể thao đi làm cực cháy',excerpt:'Xu hướng athleisure 2026 không chỉ dành cho phòng gym mà còn phù hợp cả công sở.',url:'#',thumb:'https://picsum.photos/seed/guno-blog1/600/340',date:'01/05/2026'},
  {id:'a2',type:'blog',title:'Chất liệu Excool: Vì sao được 200K+ khách yêu thích?',excerpt:'Tìm hiểu công nghệ vải Excool™ độc quyền giúp thoáng mát tối đa trong mùa hè.',url:'#',thumb:'https://picsum.photos/seed/guno-blog2/600/340',date:'28/04/2026'},
  {id:'a3',type:'blog',title:'GUNO x BST Summer Essentials 2026',excerpt:'Ra mắt bộ sưu tập hè với 50+ items mới, thiết kế tối giản cho lifestyle hiện đại.',url:'#',thumb:'https://picsum.photos/seed/guno-blog3/600/340',date:'25/04/2026'},
  {id:'a4',type:'press',title:'GUNO – Thương hiệu Việt đạt 1 triệu khách hàng',excerpt:'Chỉ sau 3 năm, GUNO đã vươn lên top 5 thương hiệu DTC tại Việt Nam với mô hình bán hàng trực tiếp.',url:'#',source:'VnExpress'},
  {id:'a5',type:'press',title:'Cách GUNO chinh phục Gen Z bằng thời trang bền vững',excerpt:'Chiến lược sử dụng 100% cotton organic và bao bì tái chế giúp GUNO thu hút thế hệ tiêu dùng mới.',url:'#',source:'Forbes Vietnam'},
  {id:'a6',type:'press',title:'GUNO được đầu tư 5 triệu USD cho mở rộng thị trường',excerpt:'Thương hiệu thời trang DTC nhận vốn Series A để phát triển chuỗi cửa hàng và logistics.',url:'#',source:'CafeF'}
])}
if(!DB.get('chatConfig')){DB.set('chatConfig',{
  messenger:'https://m.me/guno.vn',
  zalo:'https://zalo.me/guno',
  enabled:true
})}
