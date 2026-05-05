/* ===== GUNO CLONE - APP.JS ===== */
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
const app=$('#app'),overlay=$('#overlay'),cartDrawer=$('#cartDrawer'),cartBody=$('#cartBody'),cartBadge=$('#cartBadge'),cartTotalEl=$('#cartTotal'),toast=$('#toast'),mobileMenu=$('#mobileMenu');
const page=location.pathname.split('/').pop()||'index.html';
const params=new URLSearchParams(location.search);

/* ===== ADMIN DATA BRIDGE ===== */
function getProducts(){try{const d=localStorage.getItem('guno_products');return d?JSON.parse(d):PRODUCTS}catch(e){return PRODUCTS}}
function getBanners(){try{const d=localStorage.getItem('guno_banners');return d?JSON.parse(d).filter(b=>b.active):[]}catch(e){return[]}}
function getNavItems(){try{const d=localStorage.getItem('guno_navItems');return d?JSON.parse(d).filter(n=>n.active):[]}catch(e){return[]}}
function getPopups(){try{const d=localStorage.getItem('guno_popups');return d?JSON.parse(d).filter(p=>p.active):[]}catch(e){return[]}}
function getVouchers(){try{const d=localStorage.getItem('guno_vouchers');return d?JSON.parse(d).filter(v=>v.active):[]}catch(e){return[]}}
function getSettings(){try{const d=localStorage.getItem('guno_settings');return d?JSON.parse(d):{}}catch(e){return{}}}
function getArticles(){try{const d=localStorage.getItem('guno_articles');return d?JSON.parse(d):[]}catch(e){return[]}}
function getChatConfig(){try{const d=localStorage.getItem('guno_chatConfig');return d?JSON.parse(d):{messenger:'',zalo:'',enabled:true}}catch(e){return{messenger:'',zalo:'',enabled:true}}}
function saveOrder(o){try{const orders=JSON.parse(localStorage.getItem('guno_orders')||'[]');orders.push(o);localStorage.setItem('guno_orders',JSON.stringify(orders))}catch(e){}}

/* ===== CART STATE ===== */
let cart=JSON.parse(localStorage.getItem('guno_cart')||'[]');
let selectedSize='',qty=1;

function saveCart(){localStorage.setItem('guno_cart',JSON.stringify(cart))}
function fmt(n){return Number(n).toLocaleString('vi-VN')+'đ'}
function findP(slug){return getProducts().find(p=>p.slug===slug)}

/* ===== DYNAMIC NAV ===== */
function renderDynamicNav(){
  const navEl=$('#mainNav');if(!navEl)return;
  const items=getNavItems();
  if(items.length){navEl.innerHTML=items.map(n=>`<a href="${n.href}" class="nav-link${n.badge==='sale'?' sale-link':''}" ${n.badge==='new'?'data-badge="new"':''}>${n.badge==='sale'?'<span class="sale-sup">-50%</span>':''}${n.label}</a>`).join('')}
}

/* ===== POPUP SYSTEM ===== */
function showPopups(){
  const pops=getPopups();if(!pops.length)return;
  const shown=sessionStorage.getItem('guno_popup_shown');if(shown)return;
  const p=pops[0];
  const div=document.createElement('div');
  div.innerHTML=`<div style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:300;display:flex;align-items:center;justify-content:center" id="popupOverlay"><div style="background:#fff;border-radius:16px;padding:40px;max-width:420px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.2);position:relative"><button onclick="this.closest('#popupOverlay').remove()" style="position:absolute;top:12px;right:16px;background:0;border:0;font-size:22px;cursor:pointer">&times;</button><h2 style="font-size:24px;font-weight:900;margin-bottom:12px">${p.title}</h2><p style="color:#636e72;margin-bottom:20px">${p.content}</p>${p.btnText?`<a href="${p.btnLink||'#'}" style="display:inline-block;padding:12px 32px;background:#2D3436;color:#fff;border-radius:8px;font-weight:700;font-size:14px">${p.btnText}</a>`:''}</div></div>`;
  document.body.appendChild(div);sessionStorage.setItem('guno_popup_shown','1');
}

function renderCartBadge(){cartBadge.textContent=cart.reduce((s,i)=>s+i.qty,0);cartBadge.style.display=cart.length?'':'none'}
function renderCartDrawer(){
  if(!cart.length){cartBody.innerHTML='<p class="empty-msg">Chưa có sản phẩm nào.</p>';cartTotalEl.textContent='0đ';renderCartBadge();return}
  let total=0;
  cartBody.innerHTML=cart.map(i=>{
    const p=findP(i.slug);if(!p)return'';
    const line=p.price*i.qty;total+=line;
    return`<div class="cart-item"><img src="${p.img}" alt="${p.name}"><div><div class="cart-item-name">${p.name}</div><div class="cart-item-meta">Size: ${i.size}</div><div class="cart-item-qty"><button data-cq="${i.slug},${i.size},-1">−</button><span>${i.qty}</span><button data-cq="${i.slug},${i.size},1">+</button></div></div><div class="cart-item-price">${fmt(line)}</div></div>`}).join('');
  cartTotalEl.textContent=fmt(total);renderCartBadge();
}
function addToCart(slug,q=1,size=''){
  const p=findP(slug);if(!p)return;
  const sz=size||p.sizes[0];
  const ex=cart.find(i=>i.slug===slug&&i.size===sz);
  if(ex)ex.qty+=q;else cart.push({slug,qty:q,size:sz});
  saveCart();renderCartDrawer();showToast('Đã thêm '+p.name+' vào giỏ');
}
function openCart(){cartDrawer.classList.add('open');overlay.classList.add('active');document.body.style.overflow='hidden'}
function closeCart(){cartDrawer.classList.remove('open');overlay.classList.remove('active');document.body.style.overflow=''}
function showToast(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),2200)}

/* ===== PRODUCT CARD HTML ===== */
function cardHTML(p){
  const hasSale=p.discount||p.oldPrice;
  const badgeCls=hasSale?'sale':p.badge==='New'?'new':p.badge==='Hot'?'hot':'';
  const badgeText=hasSale?`-${p.discount||Math.round((1-p.price/p.oldPrice)*100)}%`:(p.badge||'');
  return`<div class="product-card" data-slug="${p.slug}">
  <div class="product-img"><img src="${p.img}" alt="${p.name}" loading="lazy">
  ${badgeText?`<span class="product-badge ${badgeCls}">${badgeText}</span>`:''}
  <button class="product-quick" data-add="${p.slug}"><svg class="icon" viewBox="0 0 24 24"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg></button>
  </div>
  <div class="product-swatches">${p.colors.map(c=>`<span class="swatch" style="background:${c}"></span>`).join('')}</div>
  <div class="product-name">${p.name}</div>
  <div class="product-price"><span class="price-current">${fmt(p.price)}</span>${hasSale?`<span class="price-discount">-${p.discount||Math.round((1-p.price/p.oldPrice)*100)}%</span><span class="price-original">${fmt(p.oldPrice||p.price)}</span>`:''}</div></div>`}

/* ===== RENDER HOMEPAGE ===== */
function renderHome(){
  const AP=getProducts();
  const newP=AP.filter(p=>p.cat.includes('new')).slice(0,8);
  const hotP=AP.filter(p=>p.badge==='Bán chạy'||p.rating>=4.7).slice(0,8);
  const saleP=AP.filter(p=>p.discount).slice(0,4);
  const banners=getBanners();
  const bHTML=banners.length?banners.map((b,i)=>`<div class="hero-slide${i===0?' active':''}" style="display:${i===0?'flex':'none'}"><a href="${b.link}"><img class="hero-img" src="${b.img}" alt="${b.title}"></a><div class="hero-overlay"><div class="hero-content"><h1 class="hero-title">${b.title}</h1><a href="${b.link}" class="btn btn-primary">Khám phá ngay</a></div></div></div>`).join(''):'<div class="hero-slide active"><img class="hero-img" src="assets/banners/banner-home.png" alt="GUNO"></div>';
  const dots=banners.length>1?`<div class="hero-dots">${banners.map((_,i)=>`<button class="hero-dot${i===0?' active':''}" data-slide="${i}"></button>`).join('')}</div>`:'';
  app.innerHTML=`
  <section class="hero" id="heroSlider">${bHTML}${dots}${banners.length>1?'<button class="hero-arrow hero-prev" data-dir="-1">‹</button><button class="hero-arrow hero-next" data-dir="1">›</button>':''}</section>
  <div class="quick-links"><a href="collection.html?cat=nam" class="quick-link">Áo thun</a><a href="collection.html?cat=the-thao" class="quick-link">Đồ thể thao</a><a href="collection.html?cat=nam" class="quick-link">Quần shorts</a><a href="collection.html?cat=nu" class="quick-link">Đồ nữ</a><a href="collection.html?cat=phu-kien" class="quick-link">Phụ kiện</a><a href="collection.html?cat=sale" class="quick-link">Outlet</a></div>
  <section class="section container"><div class="section-head"><div><div class="section-eyebrow">Mua theo nhu cầu</div><h2 class="section-title">Tủ đồ Guno cho mọi ngày</h2></div><a href="collection.html?cat=new" class="section-link">Xem tất cả →</a></div><div class="product-grid">${newP.map(cardHTML).join('')}</div></section>
  ${saleP.length?`<div class="container"><div class="sale-strip"><h2>🔥 FLASH SALE - Giảm đến 50%</h2><p>Ưu đãi có hạn, nhanh tay kẻo lỡ!</p><a href="collection.html?cat=sale" class="btn btn-outline-light">Xem ngay →</a></div></div>`:''}
  <section class="section container"><div class="section-head"><div><div class="section-eyebrow">Best sellers</div><h2 class="section-title">Sản phẩm bán chạy</h2></div><a href="collection.html?cat=nam" class="section-link">Xem tất cả →</a></div><div class="product-grid">${hotP.map(cardHTML).join('')}</div></section>
  <div class="container"><div class="service-row"><div class="service-item"><div class="service-icon">🚚</div><strong>Miễn phí vận chuyển</strong><span>Đơn hàng từ 299K</span></div><div class="service-item"><div class="service-icon">🔄</div><strong>60 ngày đổi trả</strong><span>Miễn phí, không cần lý do</span></div><div class="service-item"><div class="service-icon">💰</div><strong>Hoàn tiền 7%</strong><span>Tích GunoCash mỗi đơn</span></div><div class="service-item"><div class="service-icon">📞</div><strong>Hỗ trợ 24/7</strong><span>Hotline: 1900.27.27.37</span></div></div></div>`;
  highlightNav('index.html');
}

/* ===== RENDER COLLECTION ===== */
function renderCollection(){
  const cat=params.get('cat')||'nam';
  const info=CATEGORIES[cat]||CATEGORIES.nam;
  const AP=getProducts();
  let items=cat==='new'?AP.filter(p=>p.cat.includes('new')):AP.filter(p=>p.cat.includes(cat));
  app.innerHTML=`<div class="container"><div class="breadcrumb"><a href="index.html">Trang chủ</a> / <span>${info.title}</span></div></div>
  ${info.banner?`<div class="container"><img src="${info.banner}" alt="${info.title}" style="width:100%;border-radius:var(--radius);margin-bottom:16px"></div>`:''}
  <div class="container"><div class="collection-layout">
  <aside class="filter-sidebar"><div class="filter-head"><h3>Bộ lọc</h3><span class="filter-count">${items.length} kết quả</span></div>
  <details class="filter-group" open><summary>Danh mục</summary><div class="filter-options"><label class="filter-chip" data-fc="nam">Nam</label><label class="filter-chip" data-fc="nu">Nữ</label><label class="filter-chip" data-fc="the-thao">Thể thao</label></div></details>
  <details class="filter-group" open><summary>Kích thước</summary><div class="filter-options">${['XS','S','M','L','XL','2XL'].map(s=>`<label class="filter-chip" data-fs="${s}">${s}</label>`).join('')}</div></details>
  <details class="filter-group"><summary>Giá</summary><div class="filter-options"><label class="filter-chip" data-fp="1">Dưới 200K</label><label class="filter-chip" data-fp="2">200K-400K</label><label class="filter-chip" data-fp="3">Trên 400K</label></div></details>
  </aside>
  <div><div class="collection-toolbar"><span>${info.title}</span><select class="sort-select" id="sortSelect"><option value="featured">Nổi bật</option><option value="price-asc">Giá tăng</option><option value="price-desc">Giá giảm</option><option value="newest">Mới nhất</option></select></div>
  <div class="product-grid" id="collectionGrid">${items.map(cardHTML).join('')}</div></div></div></div>`;
  highlightNav('collection.html?cat='+cat);
}

/* ===== RENDER PRODUCT DETAIL ===== */
function renderProduct(){
  const slug=params.get('slug');const p=findP(slug);
  if(!p){app.innerHTML='<div class="container" style="padding:80px 0;text-align:center"><h2>Không tìm thấy sản phẩm</h2><a href="index.html" class="btn btn-outline" style="margin-top:16px">Về trang chủ</a></div>';return}
  selectedSize=p.sizes[0];qty=1;
  const AP=getProducts();
  const related=AP.filter(r=>r.slug!==slug&&r.cat.some(c=>p.cat.includes(c))).slice(0,4);
  app.innerHTML=`<div class="container"><div class="breadcrumb"><a href="index.html">Trang chủ</a> / <a href="collection.html?cat=${p.cat[0]}">${CATEGORIES[p.cat[0]]?.title||'Guno'}</a> / <span>${p.name}</span></div>
  <div class="pdp-layout"><div class="pdp-gallery"><div class="pdp-main-img"><img src="${p.img}" alt="${p.name}" id="mainImg"></div></div>
  <div class="pdp-info">${p.badge?`<span class="product-badge-inline">${p.badge}</span>`:''}
  <h1 class="pdp-title">${p.name}</h1>
  <div class="pdp-rating"><span class="stars">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5-Math.round(p.rating))}</span> ${p.rating} · ${p.reviews} đánh giá</div>
  <div class="pdp-price-row"><span class="pdp-price">${fmt(p.price)}</span>${p.oldPrice?`<span class="price-discount">-${p.discount||Math.round((1-p.price/p.oldPrice)*100)}%</span><span class="price-original">${fmt(p.oldPrice)}</span>`:''}</div>
  <p class="pdp-desc">${p.desc}</p>
  <div class="pdp-option-label"><span>Màu sắc · ${p.colors.length} màu</span></div>
  <div class="pdp-color-swatches">${p.colors.map((c,i)=>`<span class="color-swatch${i===0?' active':''}" style="background:${c}"></span>`).join('')}</div>
  <div class="pdp-option-label"><span>Kích thước</span><a href="support.html">Hướng dẫn chọn size</a></div>
  <div class="pdp-sizes">${p.sizes.map((s,i)=>`<button class="size-btn${i===0?' active':''}" data-sz="${s}">${s}</button>`).join('')}</div>
  <div class="pdp-option-label"><span>Số lượng</span></div>
  <div class="pdp-qty"><button id="qtyMinus">−</button><span id="qtyVal">1</span><button id="qtyPlus">+</button></div>
  <button class="btn btn-primary btn-block" id="addToCartBtn" data-slug="${p.slug}">Thêm vào giỏ</button>
  <div class="pdp-voucher">🏷️ <strong>GUNO100</strong> – Giảm 100K cho đơn đầu tiên từ 299K</div>
  <div class="pdp-ship">🚚 Freeship đơn từ 299K · Giao hàng 2-5 ngày</div>
  </div></div></div>
  ${related.length?`<section class="section container"><div class="section-head"><div><h2 class="section-title">Có thể bạn thích</h2></div></div><div class="product-grid">${related.map(cardHTML).join('')}</div></section>`:''}`;
  highlightNav('');
}

/* ===== RENDER CHECKOUT ===== */
function renderCheckout(){
  let subtotal=cart.reduce((s,i)=>{const p=findP(i.slug);return s+(p?p.price*i.qty:0)},0);
  const ship=subtotal>=299000?0:30000;
  app.innerHTML=`<div class="checkout-grid"><div class="checkout-form">
  <div style="padding:12px 16px;background:#e3f2fd;border-radius:var(--radius);margin-bottom:24px;font-size:13px;color:#2979ff;font-weight:600">🎁 Tham gia GunoClub nhận Voucher 15% đơn đầu tiên · <a href="club.html" style="text-decoration:underline">Tìm hiểu thêm</a></div>
  <h2>Thông tin vận chuyển</h2>
  <div style="margin-bottom:16px;font-size:13px"><label><input type="checkbox" checked style="margin-right:6px">Bằng việc đặt hàng, bạn đồng ý với <a href="support.html" style="color:#2979ff">chính sách bảo mật</a></label></div>
  <div class="form-row"><div class="form-group"><label>Họ tên</label><input placeholder="Nhập họ tên"></div><div class="form-group"><label>Số điện thoại</label><input placeholder="Nhập SĐT" type="tel"></div></div>
  <div class="form-group"><label>Email</label><input placeholder="Nhập email" type="email"></div>
  <div class="form-group"><label>Địa chỉ</label><input placeholder="Nhập địa chỉ"></div>
  <div class="form-row"><div class="form-group"><label>Tỉnh/Thành phố</label><select><option>Chọn tỉnh/thành</option><option>Hà Nội</option><option>TP. Hồ Chí Minh</option><option>Đà Nẵng</option></select></div><div class="form-group"><label>Quận/Huyện</label><select><option>Chọn quận/huyện</option></select></div></div>
  <div class="form-group"><label>Ghi chú</label><textarea rows="3" placeholder="Ghi chú đơn hàng..."></textarea></div>
  </div>
  <div class="checkout-cart"><h2>Giỏ hàng (${cart.length})</h2>
  ${cart.map(i=>{const p=findP(i.slug);if(!p)return'';return`<div class="checkout-item"><img src="${p.img}" alt="${p.name}"><div><div class="checkout-item-name">${p.name}</div><div class="checkout-item-meta">Size: ${i.size} · SL: ${i.qty}</div></div><div class="checkout-item-price">${fmt(p.price*i.qty)}</div></div>`}).join('')}
  <div class="checkout-summary"><div class="checkout-row"><span>Tạm tính</span><strong>${fmt(subtotal)}</strong></div><div class="checkout-row"><span>Phí vận chuyển</span><strong style="color:${ship?'inherit':'var(--green)'}">${ship?fmt(ship):'Miễn phí'}</strong></div><div class="checkout-row" style="padding-top:12px;border-top:1px solid var(--line)"><span style="font-size:18px;font-weight:800">Tổng cộng</span><span class="checkout-total">${fmt(subtotal+ship)}</span></div></div>
  <button class="btn btn-primary btn-block" style="margin-top:24px;height:52px;font-size:16px" id="placeOrderBtn">ĐẶT HÀNG</button>
  </div></div>`;
}

/* ===== RENDER OTHER PAGES ===== */
function renderAbout(){
  const articles=getArticles();
  const press=articles.filter(a=>a.type==='press');
  const blog=articles.filter(a=>a.type==='blog');
  app.innerHTML=`<div class="content-hero"><h1>Về GUNO</h1><p>Thương hiệu thời trang Việt Nam với sứ mệnh mang đến trang phục thoải mái, bền vững cho mọi người.</p></div>
  <div class="content-section">
  <h2>Câu chuyện của chúng tôi</h2>
  <p>GUNO ra đời từ niềm tin rằng thời trang tốt không cần phải đắt. Chúng tôi thiết kế và sản xuất trực tiếp, loại bỏ trung gian để mang đến sản phẩm chất lượng với giá hợp lý nhất.</p>
  <h2>Cam kết bền vững</h2>
  <p>100% cotton organic, quy trình sản xuất xanh, bao bì tái chế. Mỗi sản phẩm GUNO đều góp phần bảo vệ môi trường.</p>
  </div>
  ${blog.length?`<div class="content-section"><h2>📰 Bài viết từ GUNO</h2><div class="articles-grid">${blog.map(a=>`<a href="${a.url}" target="_blank" class="article-card"><div class="article-thumb"><img src="${a.thumb||''}" alt="${a.title}"></div><div class="article-body"><span class="article-date">${a.date||''}</span><h3>${a.title}</h3><p>${a.excerpt||''}</p></div></a>`).join('')}</div></div>`:''}
  ${press.length?`<div class="content-section"><h2>📺 Báo chí nói về GUNO</h2><div class="press-grid">${press.map(a=>`<a href="${a.url}" target="_blank" class="press-card"><div class="press-logo">${a.source||'Báo chí'}</div><h4>${a.title}</h4><p>${a.excerpt||''}</p><span class="press-link">Đọc bài viết →</span></a>`).join('')}</div></div>`:''}
  `;
}
function renderClub(){
  app.innerHTML=`<div class="content-hero" style="background:linear-gradient(135deg,#2d3436,#636e72);color:#fff"><h1 style="color:#fdcb6e">⭐ GunoClub</h1><p style="color:rgba(255,255,255,.7)">Chương trình thành viên với đặc quyền hoàn tiền, ưu đãi sinh nhật và quà tặng độc quyền.</p></div>
  <div class="content-section"><h2>Quyền lợi thành viên</h2><ul><li>Hoàn tiền 7% GunoCash mỗi đơn hàng</li><li>Voucher sinh nhật giảm 20%</li><li>Ưu tiên mua sản phẩm mới</li><li>Miễn phí ship mọi đơn</li></ul></div>`}
function renderStores(){
  app.innerHTML=`<div class="content-hero"><h1>Hệ thống cửa hàng</h1><p>Ghé thăm GUNO Store để trải nghiệm trực tiếp.</p></div>
  <div class="content-section"><h2>📍 GUNO Store Hà Nội</h2><p>175 Nguyễn Thái Học, Đống Đa, Hà Nội</p><p>Giờ mở: 9:00 – 21:30 hàng ngày</p><h2>📍 GUNO Store TP.HCM</h2><p>KCN Cát Lái, TP. Thủ Đức, TP.HCM</p><p>Giờ mở: 9:00 – 21:30 hàng ngày</p></div>`}
function renderSupport(){
  app.innerHTML=`<div class="content-hero"><h1>Chăm sóc khách hàng</h1><p>Chúng tôi cam kết trải nghiệm mua sắm 100% hài lòng.</p></div>
  <div class="content-section"><h2>Chính sách đổi trả</h2><p>Đổi trả miễn phí trong 60 ngày kể từ ngày nhận hàng. Sản phẩm chưa sử dụng, còn nguyên tem mác.</p><h2>Chính sách giao hàng</h2><p>Miễn phí vận chuyển đơn từ 299K. Giao hàng 2-5 ngày toàn quốc. Kiểm tra hàng trước khi thanh toán.</p><h2>Liên hệ</h2><p>📞 Hotline: <strong>1900.27.27.37</strong> (8:00 – 22:00)</p><p>📧 Email: <strong>cool@guno.vn</strong></p></div>`}

/* ===== NAV HIGHLIGHT ===== */
function highlightNav(href){$$('.nav-link').forEach(a=>{a.classList.toggle('active',a.getAttribute('href')===href)})}

/* ===== ROUTER ===== */
function route(){
  if(page==='collection.html')renderCollection();
  else if(page==='product.html')renderProduct();
  else if(page==='checkout.html')renderCheckout();
  else if(page==='about.html')renderAbout();
  else if(page==='club.html')renderClub();
  else if(page==='stores.html')renderStores();
  else if(page==='support.html')renderSupport();
  else renderHome();
  renderCartDrawer();
  window.scrollTo(0,0);
}

/* ===== EVENT HANDLERS ===== */
document.addEventListener('click',e=>{
  // Quick add from card
  const qa=e.target.closest('[data-add]');
  if(qa){e.preventDefault();e.stopPropagation();addToCart(qa.dataset.add);openCart();return}
  // Product card click -> detail
  const card=e.target.closest('.product-card');
  if(card&&!e.target.closest('.product-quick')){const s=card.dataset.slug;if(s)location.href='product.html?slug='+s;return}
  // PDP add to cart
  if(e.target.closest('#addToCartBtn')){addToCart(e.target.closest('#addToCartBtn').dataset.slug,qty,selectedSize);openCart();return}
  // PDP size
  const sz=e.target.closest('[data-sz]');
  if(sz){selectedSize=sz.dataset.sz;$$('[data-sz]').forEach(b=>b.classList.remove('active'));sz.classList.add('active');return}
  // PDP qty
  if(e.target.closest('#qtyPlus')){qty++;$('#qtyVal').textContent=qty;return}
  if(e.target.closest('#qtyMinus')){qty=Math.max(1,qty-1);$('#qtyVal').textContent=qty;return}
  // Cart qty
  const cq=e.target.closest('[data-cq]');
  if(cq){const[slug,size,d]=cq.dataset.cq.split(',');const it=cart.find(i=>i.slug===slug&&i.size===size);if(it){it.qty=Math.max(0,it.qty+Number(d));if(it.qty<=0)cart=cart.filter(x=>x!==it)}saveCart();renderCartDrawer();return}
  // Cart open/close
  if(e.target.closest('#cartBtn')){openCart();return}
  if(e.target.closest('#closeCart')||e.target===overlay){closeCart();return}
  // Mobile menu
  if(e.target.closest('#menuBtn')){mobileMenu.classList.add('open');overlay.classList.add('active');return}
  if(e.target.closest('#closeMenu')){mobileMenu.classList.remove('open');overlay.classList.remove('active');return}
  // Filter chips
  const fc=e.target.closest('[data-fc]');
  if(fc){location.href='collection.html?cat='+fc.dataset.fc;return}
});

/* ===== SLIDER ===== */
let slideIdx=0;
document.addEventListener('click',e=>{
  const arrow=e.target.closest('[data-dir]');
  if(arrow){const slides=$$('.hero-slide');const dots=$$('.hero-dot');if(!slides.length)return;slides[slideIdx].style.display='none';if(dots[slideIdx])dots[slideIdx].classList.remove('active');slideIdx=(slideIdx+Number(arrow.dataset.dir)+slides.length)%slides.length;slides[slideIdx].style.display='flex';if(dots[slideIdx])dots[slideIdx].classList.add('active');return}
  const dot=e.target.closest('[data-slide]');
  if(dot){const slides=$$('.hero-slide');const dots=$$('.hero-dot');slides[slideIdx].style.display='none';if(dots[slideIdx])dots[slideIdx].classList.remove('active');slideIdx=Number(dot.dataset.slide);slides[slideIdx].style.display='flex';if(dots[slideIdx])dots[slideIdx].classList.add('active');return}
  // Place order
  if(e.target.closest('#placeOrderBtn')){placeOrder();return}
});
function placeOrder(){
  const f=document.querySelector('.checkout-form');if(!f)return;
  const inputs=f.querySelectorAll('input,textarea,select');
  const name=inputs[1]?.value||'Khách';const phone=inputs[2]?.value||'';const email=inputs[3]?.value||'';const addr=inputs[4]?.value||'';
  const note=f.querySelector('textarea')?.value||'';
  if(!name||!phone){showToast('Vui lòng nhập họ tên và SĐT');return}
  const items=cart.map(i=>{const p=findP(i.slug);return{name:p?.name||i.slug,size:i.size,qty:i.qty,price:p?.price||0}});
  const total=items.reduce((s,i)=>s+i.price*i.qty,0);
  const order={id:Date.now().toString(36),name,phone,email,address:addr,note,items,total,status:'pending',date:new Date().toLocaleDateString('vi-VN')};
  saveOrder(order);cart=[];saveCart();renderCartDrawer();
  app.innerHTML='<div style="text-align:center;padding:80px 24px"><h1 style="font-size:48px;margin-bottom:16px">🎉</h1><h2>Đặt hàng thành công!</h2><p style="color:#636e72;margin:12px 0">Mã đơn: <strong>#'+order.id+'</strong></p><p style="color:#636e72">Cảm ơn bạn đã mua sắm tại GUNO!</p><a href="index.html" class="btn btn-primary" style="margin-top:24px">Tiếp tục mua sắm</a></div>';
}

/* Auto-slide */
setInterval(()=>{const slides=$$('.hero-slide');if(slides.length>1){const arrow=$('[data-dir="1"]');if(arrow)arrow.click()}},5000);

/* ===== CHAT WIDGET ===== */
function renderChatWidget(){
  const cfg=getChatConfig();
  if(!cfg.enabled)return;
  if(!cfg.messenger&&!cfg.zalo)return;
  const el=document.createElement('div');
  el.className='chat-float';
  el.innerHTML=`<div class="chat-btns" id="chatBtns" style="display:none">
    ${cfg.messenger?`<a href="${cfg.messenger}" target="_blank" class="chat-btn chat-mess" title="Chat Messenger"><svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.15 7.2V22l2.95-1.62c.83.23 1.71.35 2.63.35h.27c5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.05 13.06l-2.55-2.73L5.5 15.06l5.5-5.83 2.62 2.73 4.93-2.73-5.5 5.83z"/></svg></a>`:''}
    ${cfg.zalo?`<a href="${cfg.zalo}" target="_blank" class="chat-btn chat-zalo" title="Chat Zalo"><svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.57.05-1.01-.38-1.56-.74-.87-.57-1.36-.92-2.2-1.48-.97-.64-.34-1 .21-1.57.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.2-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.37.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .33z"/></svg></a>`:''}
  </div>
  <button class="chat-toggle" id="chatToggle" title="Chat với GUNO"><svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg></button>`;
  document.body.appendChild(el);
  document.getElementById('chatToggle').addEventListener('click',()=>{
    const btns=document.getElementById('chatBtns');
    btns.style.display=btns.style.display==='none'?'flex':'none';
  });
}

/* ===== INIT ===== */
renderDynamicNav();
route();
showPopups();
renderChatWidget();
