/* Admin Tabs - Dashboard, Products, Banners */
function renderDashboard(){
  const prods=DB.get('products',[]),orders=DB.get('orders',[]),vouchers=DB.get('vouchers',[]);
  const rev=orders.reduce((s,o)=>s+o.total,0);
  $('#content').innerHTML=`
  <div class="stats">
    <div class="stat-card"><div class="label">Sản phẩm</div><div class="value">${prods.length}</div></div>
    <div class="stat-card"><div class="label">Đơn hàng</div><div class="value">${orders.length}</div></div>
    <div class="stat-card"><div class="label">Doanh thu</div><div class="value">${fmt(rev)}</div></div>
    <div class="stat-card"><div class="label">Voucher</div><div class="value">${vouchers.filter(v=>v.active).length}</div></div>
  </div>
  <div class="card"><div class="card-head"><h3>Đơn hàng gần đây</h3></div><div class="card-body">
  ${orders.length?`<table><thead><tr><th>Mã</th><th>Khách</th><th>Tổng</th><th>Ngày</th><th>Trạng thái</th></tr></thead><tbody>
  ${orders.slice(-5).reverse().map(o=>`<tr><td>#${o.id}</td><td>${o.name}</td><td>${fmt(o.total)}</td><td>${o.date}</td><td><span class="tag tag-${o.status==='done'?'green':o.status==='cancel'?'red':'gold'}">${o.status==='done'?'Hoàn thành':o.status==='cancel'?'Hủy':'Chờ xử lý'}</span></td></tr>`).join('')}
  </tbody></table>`:'<div class="empty"><div class="icon">📦</div><p>Chưa có đơn hàng nào</p></div>'}
  </div></div>`;
}

function renderProducts(){
  const prods=DB.get('products',[]);
  $('#content').innerHTML=`
  <div class="card"><div class="card-head"><h3>Quản lý sản phẩm (${prods.length})</h3><div style="display:flex;gap:8px">
    <button class="btn btn-outline btn-sm" onclick="importProducts()">📥 Import</button>
    <button class="btn btn-outline btn-sm" onclick="exportProducts()">📤 Export</button>
    <button class="btn btn-blue btn-sm" onclick="editProduct()">+ Thêm SP</button>
  </div></div><div class="card-body"><div class="table-wrap"><table><thead><tr><th></th><th>Tên</th><th>Danh mục</th><th>Giá</th><th>Sizes</th><th></th></tr></thead><tbody>
  ${prods.map((p,i)=>`<tr>
    <td><img class="td-img" src="${p.img}" alt=""></td>
    <td><strong>${p.name}</strong><br><span style="color:var(--sub);font-size:11px">${p.slug}</span></td>
    <td>${p.cat.map(c=>`<span class="tag tag-blue">${c}</span> `).join('')}</td>
    <td>${fmt(p.price)}${p.oldPrice?`<br><s style="color:var(--sub);font-size:11px">${fmt(p.oldPrice)}</s>`:''}</td>
    <td>${p.sizes.join(', ')}</td>
    <td><button class="btn btn-outline btn-sm" onclick="editProduct(${i})">✏️</button> <button class="btn btn-red btn-sm" onclick="deleteProduct(${i})">🗑️</button></td>
  </tr>`).join('')}
  </tbody></table></div></div></div>`;
}

function editProduct(idx){
  const prods=DB.get('products',[]);
  const p=idx!=null?prods[idx]:{slug:'',name:'',cat:['nam'],price:0,oldPrice:0,img:'',colors:['#2d3436'],sizes:['S','M','L','XL'],desc:'',badge:'',discount:0,rating:4.5,reviews:0};
  const isNew=idx==null;
  openModal(isNew?'Thêm sản phẩm':'Sửa sản phẩm',`
    <div class="form-row"><div class="form-group"><label>Tên SP</label><input id="pName" value="${p.name}"></div><div class="form-group"><label>Slug</label><input id="pSlug" value="${p.slug}"></div></div>
    <div class="form-row"><div class="form-group"><label>Giá bán</label><input type="number" id="pPrice" value="${p.price}"></div><div class="form-group"><label>Giá gốc (0=không)</label><input type="number" id="pOld" value="${p.oldPrice||0}"></div></div>
    <div class="form-row"><div class="form-group"><label>Danh mục (cách dấu phẩy)</label><input id="pCat" value="${p.cat.join(',')}"></div><div class="form-group"><label>Badge</label><input id="pBadge" value="${p.badge||''}"></div></div>
    <div class="form-row"><div class="form-group"><label>Sizes (cách dấu phẩy)</label><input id="pSizes" value="${p.sizes.join(',')}"></div><div class="form-group"><label>Discount %</label><input type="number" id="pDiscount" value="${p.discount||0}"></div></div>
    <div class="form-group"><label>URL ảnh</label><input id="pImg" value="${p.img}"></div>
    <div class="form-group"><label>Màu sắc (hex, cách dấu phẩy)</label><input id="pColors" value="${p.colors.join(',')}"></div>
    <div class="form-group"><label>Mô tả</label><textarea id="pDesc" rows="3">${p.desc}</textarea></div>
    <div class="form-row"><div class="form-group"><label>Rating</label><input type="number" step="0.1" id="pRating" value="${p.rating}"></div><div class="form-group"><label>Số reviews</label><input type="number" id="pReviews" value="${p.reviews}"></div></div>
  `,`<button class="btn btn-outline" onclick="closeModal()">Hủy</button><button class="btn btn-blue" onclick="saveProduct(${idx!=null?idx:'null'})">Lưu</button>`);
}
function saveProduct(idx){
  const prods=DB.get('products',[]);
  const p={slug:$('#pSlug').value||$('#pName').value.toLowerCase().replace(/[^a-z0-9]+/g,'-'),name:$('#pName').value,cat:$('#pCat').value.split(',').map(s=>s.trim()),price:+$('#pPrice').value,img:$('#pImg').value,colors:$('#pColors').value.split(',').map(s=>s.trim()),sizes:$('#pSizes').value.split(',').map(s=>s.trim()),desc:$('#pDesc').value,badge:$('#pBadge').value,discount:+$('#pDiscount').value,rating:+$('#pRating').value,reviews:+$('#pReviews').value};
  if(+$('#pOld').value)p.oldPrice=+$('#pOld').value;
  if(idx!=null)prods[idx]=p;else prods.push(p);
  DB.set('products',prods);closeModal();renderProducts();toast('Đã lưu sản phẩm');
}
function deleteProduct(i){if(!confirm('Xóa sản phẩm này?'))return;const p=DB.get('products',[]);p.splice(i,1);DB.set('products',p);renderProducts();toast('Đã xóa')}
function exportProducts(){const d=JSON.stringify(DB.get('products',[]),null,2);const b=new Blob([d],{type:'application/json'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='guno-products.json';a.click();toast('Đã xuất file')}
function importProducts(){
  openModal('Import sản phẩm',`<div class="file-drop" id="fileDrop"><p>📥 Kéo thả file JSON vào đây hoặc click để chọn</p><input type="file" accept=".json,.csv" id="fileInput"><p style="margin-top:8px;font-size:12px">Hỗ trợ JSON (mảng sản phẩm)</p></div>`,
  `<button class="btn btn-outline" onclick="closeModal()">Hủy</button>`);
  const drop=$('#fileDrop'),inp=$('#fileInput');
  drop.onclick=()=>inp.click();
  inp.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(Array.isArray(d)){const prods=DB.get('products',[]);DB.set('products',prods.concat(d));closeModal();renderProducts();toast(`Đã import ${d.length} sản phẩm`)}else toast('File không hợp lệ')}catch(e){toast('Lỗi đọc file')}};r.readAsText(f)};
}

function renderBanners(){
  const banners=DB.get('banners',[]);
  $('#content').innerHTML=`
  <div class="card"><div class="card-head"><h3>Quản lý Banner Slider (${banners.length})</h3><button class="btn btn-blue btn-sm" onclick="editBanner()">+ Thêm banner</button></div><div class="card-body">
  ${banners.map((b,i)=>`<div class="list-item drag-item">
    <span class="drag-handle">⠿</span>
    <img src="${b.img}" style="width:120px;height:48px;object-fit:cover;border-radius:6px;background:var(--line)">
    <div class="list-item-content"><div class="list-item-title">${b.title}</div><div class="list-item-sub">${b.link}</div></div>
    <button class="toggle ${b.active?'on':''}" onclick="toggleBanner(${i})"></button>
    <div class="list-item-actions"><button class="btn btn-outline btn-sm" onclick="editBanner(${i})">✏️</button><button class="btn btn-red btn-sm" onclick="deleteBanner(${i})">🗑️</button></div>
  </div>`).join('')}
  </div></div>`;
}
function editBanner(idx){
  const bs=DB.get('banners',[]);const b=idx!=null?bs[idx]:{id:uid(),img:'',title:'',link:'',active:true};
  openModal(idx!=null?'Sửa banner':'Thêm banner',`
    <div class="form-group"><label>Tiêu đề</label><input id="bTitle" value="${b.title}"></div>
    <div class="form-group"><label>URL ảnh</label><input id="bImg" value="${b.img}"></div>
    <div class="form-group"><label>Link</label><input id="bLink" value="${b.link}"></div>
  `,`<button class="btn btn-outline" onclick="closeModal()">Hủy</button><button class="btn btn-blue" onclick="saveBanner(${idx!=null?idx:'null'})">Lưu</button>`);
}
function saveBanner(idx){const bs=DB.get('banners',[]);const b={id:uid(),img:$('#bImg').value,title:$('#bTitle').value,link:$('#bLink').value,active:true};if(idx!=null)bs[idx]={...bs[idx],...b};else bs.push(b);DB.set('banners',bs);closeModal();renderBanners();toast('Đã lưu')}
function toggleBanner(i){const bs=DB.get('banners',[]);bs[i].active=!bs[i].active;DB.set('banners',bs);renderBanners()}
function deleteBanner(i){if(!confirm('Xóa banner?'))return;const bs=DB.get('banners',[]);bs.splice(i,1);DB.set('banners',bs);renderBanners();toast('Đã xóa')}
