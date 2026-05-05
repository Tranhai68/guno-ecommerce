/* Admin Tabs - Nav, Vouchers, Popups, Policies, Orders, Settings, Pages */
function renderNavigation(){
  const items=DB.get('navItems',[]);
  $('#content').innerHTML=`<div class="card"><div class="card-head"><h3>Quản lý Navigation (${items.length})</h3><button class="btn btn-blue btn-sm" onclick="editNav()">+ Thêm mục</button></div><div class="card-body">
  ${items.map((n,i)=>`<div class="list-item"><span class="drag-handle">⠿</span><div class="list-item-content"><div class="list-item-title">${n.label}</div><div class="list-item-sub">${n.href} ${n.badge?'· badge: '+n.badge:''}</div></div><button class="toggle ${n.active?'on':''}" onclick="toggleNav(${i})"></button><div class="list-item-actions"><button class="btn btn-outline btn-sm" onclick="editNav(${i})">✏️</button><button class="btn btn-red btn-sm" onclick="deleteNav(${i})">🗑️</button></div></div>`).join('')}</div></div>`;
}
function editNav(idx){const ns=DB.get('navItems',[]);const n=idx!=null?ns[idx]:{id:uid(),label:'',href:'',badge:'',active:true};openModal(idx!=null?'Sửa mục':'Thêm mục nav',`<div class="form-group"><label>Label</label><input id="nLabel" value="${n.label}"></div><div class="form-group"><label>Link</label><input id="nHref" value="${n.href}"></div><div class="form-group"><label>Badge (new/sale/để trống)</label><input id="nBadge" value="${n.badge||''}"></div>`,`<button class="btn btn-outline" onclick="closeModal()">Hủy</button><button class="btn btn-blue" onclick="saveNav(${idx!=null?idx:'null'})">Lưu</button>`)}
function saveNav(idx){const ns=DB.get('navItems',[]);const n={id:uid(),label:$('#nLabel').value,href:$('#nHref').value,badge:$('#nBadge').value,active:true};if(idx!=null)ns[idx]={...ns[idx],...n};else ns.push(n);DB.set('navItems',ns);closeModal();renderNavigation();toast('Đã lưu')}
function toggleNav(i){const ns=DB.get('navItems',[]);ns[i].active=!ns[i].active;DB.set('navItems',ns);renderNavigation()}
function deleteNav(i){const ns=DB.get('navItems',[]);ns.splice(i,1);DB.set('navItems',ns);renderNavigation();toast('Đã xóa')}

function renderVouchers(){
  const vs=DB.get('vouchers',[]);
  $('#content').innerHTML=`<div class="card"><div class="card-head"><h3>Quản lý Voucher (${vs.length})</h3><button class="btn btn-blue btn-sm" onclick="editVoucher()">+ Thêm voucher</button></div><div class="card-body"><table><thead><tr><th>Mã</th><th>Mô tả</th><th>Giảm</th><th>Đơn tối thiểu</th><th>Trạng thái</th><th></th></tr></thead><tbody>
  ${vs.map((v,i)=>`<tr><td><strong>${v.code}</strong></td><td>${v.desc}</td><td>${v.freeShip?'Free ship':fmt(v.discount)}</td><td>${fmt(v.minOrder)}</td><td><button class="toggle ${v.active?'on':''}" onclick="toggleVoucher(${i})"></button></td><td><button class="btn btn-outline btn-sm" onclick="editVoucher(${i})">✏️</button> <button class="btn btn-red btn-sm" onclick="deleteVoucher(${i})">🗑️</button></td></tr>`).join('')}</tbody></table></div></div>`;
}
function editVoucher(idx){const vs=DB.get('vouchers',[]);const v=idx!=null?vs[idx]:{id:uid(),code:'',desc:'',discount:0,minOrder:0,freeShip:false,active:true};openModal(idx!=null?'Sửa voucher':'Thêm voucher',`<div class="form-row"><div class="form-group"><label>Mã voucher</label><input id="vCode" value="${v.code}"></div><div class="form-group"><label>Mô tả</label><input id="vDesc" value="${v.desc}"></div></div><div class="form-row"><div class="form-group"><label>Giảm (VNĐ)</label><input type="number" id="vDiscount" value="${v.discount}"></div><div class="form-group"><label>Đơn tối thiểu</label><input type="number" id="vMin" value="${v.minOrder}"></div></div>`,`<button class="btn btn-outline" onclick="closeModal()">Hủy</button><button class="btn btn-blue" onclick="saveVoucher(${idx!=null?idx:'null'})">Lưu</button>`)}
function saveVoucher(idx){const vs=DB.get('vouchers',[]);const v={id:uid(),code:$('#vCode').value,desc:$('#vDesc').value,discount:+$('#vDiscount').value,minOrder:+$('#vMin').value,active:true};if(idx!=null)vs[idx]={...vs[idx],...v};else vs.push(v);DB.set('vouchers',vs);closeModal();renderVouchers();toast('Đã lưu')}
function toggleVoucher(i){const vs=DB.get('vouchers',[]);vs[i].active=!vs[i].active;DB.set('vouchers',vs);renderVouchers()}
function deleteVoucher(i){const vs=DB.get('vouchers',[]);vs.splice(i,1);DB.set('vouchers',vs);renderVouchers();toast('Đã xóa')}

function renderPopups(){
  const ps=DB.get('popups',[]);
  $('#content').innerHTML=`<div class="card"><div class="card-head"><h3>Quản lý Popup (${ps.length})</h3><button class="btn btn-blue btn-sm" onclick="editPopup()">+ Thêm popup</button></div><div class="card-body">
  ${ps.map((p,i)=>`<div class="list-item"><div class="list-item-content"><div class="list-item-title">${p.title}</div><div class="list-item-sub">${p.content.slice(0,60)}...</div></div><button class="toggle ${p.active?'on':''}" onclick="togglePopup(${i})"></button><div class="list-item-actions"><button class="btn btn-outline btn-sm" onclick="editPopup(${i})">✏️</button><button class="btn btn-red btn-sm" onclick="deletePopup(${i})">🗑️</button></div></div>`).join('')}</div></div>`;
}
function editPopup(idx){const ps=DB.get('popups',[]);const p=idx!=null?ps[idx]:{id:uid(),title:'',content:'',btnText:'Mua ngay',btnLink:'',active:true};openModal(idx!=null?'Sửa popup':'Thêm popup',`<div class="form-group"><label>Tiêu đề</label><input id="ppTitle" value="${p.title}"></div><div class="form-group"><label>Nội dung</label><textarea id="ppContent" rows="3">${p.content}</textarea></div><div class="form-row"><div class="form-group"><label>Nút bấm</label><input id="ppBtn" value="${p.btnText}"></div><div class="form-group"><label>Link</label><input id="ppLink" value="${p.btnLink}"></div></div>`,`<button class="btn btn-outline" onclick="closeModal()">Hủy</button><button class="btn btn-blue" onclick="savePopup(${idx!=null?idx:'null'})">Lưu</button>`)}
function savePopup(idx){const ps=DB.get('popups',[]);const p={id:uid(),title:$('#ppTitle').value,content:$('#ppContent').value,btnText:$('#ppBtn').value,btnLink:$('#ppLink').value,active:true};if(idx!=null)ps[idx]={...ps[idx],...p};else ps.push(p);DB.set('popups',ps);closeModal();renderPopups();toast('Đã lưu')}
function togglePopup(i){const ps=DB.get('popups',[]);ps[i].active=!ps[i].active;DB.set('popups',ps);renderPopups()}
function deletePopup(i){const ps=DB.get('popups',[]);ps.splice(i,1);DB.set('popups',ps);renderPopups();toast('Đã xóa')}

function renderPolicies(){
  const ps=DB.get('policies',[]);
  $('#content').innerHTML=`<div class="card"><div class="card-head"><h3>Chính sách & Nội quy (${ps.length})</h3><button class="btn btn-blue btn-sm" onclick="editPolicy()">+ Thêm</button></div><div class="card-body">
  ${ps.map((p,i)=>`<div class="list-item"><div class="list-item-content"><div class="list-item-title">${p.title}</div><div class="list-item-sub">${p.content.slice(0,80)}...</div></div><div class="list-item-actions"><button class="btn btn-outline btn-sm" onclick="editPolicy(${i})">✏️</button><button class="btn btn-red btn-sm" onclick="deletePolicy(${i})">🗑️</button></div></div>`).join('')}</div></div>`;
}
function editPolicy(idx){const ps=DB.get('policies',[]);const p=idx!=null?ps[idx]:{id:uid(),title:'',content:''};openModal(idx!=null?'Sửa chính sách':'Thêm chính sách',`<div class="form-group"><label>Tiêu đề</label><input id="plTitle" value="${p.title}"></div><div class="form-group"><label>Nội dung</label><textarea id="plContent" rows="6">${p.content}</textarea></div>`,`<button class="btn btn-outline" onclick="closeModal()">Hủy</button><button class="btn btn-blue" onclick="savePolicy(${idx!=null?idx:'null'})">Lưu</button>`)}
function savePolicy(idx){const ps=DB.get('policies',[]);const p={id:uid(),title:$('#plTitle').value,content:$('#plContent').value};if(idx!=null)ps[idx]={...ps[idx],...p};else ps.push(p);DB.set('policies',ps);closeModal();renderPolicies();toast('Đã lưu')}
function deletePolicy(i){const ps=DB.get('policies',[]);ps.splice(i,1);DB.set('policies',ps);renderPolicies();toast('Đã xóa')}

function renderOrders(){
  const orders=DB.get('orders',[]);
  $('#content').innerHTML=`<div class="card"><div class="card-head"><h3>Đơn hàng (${orders.length})</h3></div><div class="card-body">
  ${orders.length?`<div class="table-wrap"><table><thead><tr><th>Mã</th><th>Khách</th><th>SĐT</th><th>Địa chỉ</th><th>SP</th><th>Tổng</th><th>Ngày</th><th>TT</th><th></th></tr></thead><tbody>
  ${orders.slice().reverse().map((o,i)=>`<tr><td><strong>#${o.id}</strong></td><td>${o.name}</td><td>${o.phone}</td><td>${o.address}</td><td>${o.items.length} SP</td><td><strong>${fmt(o.total)}</strong></td><td>${o.date}</td><td><select onchange="updateOrderStatus('${o.id}',this.value)" style="padding:4px 8px;border:1px solid var(--line);border-radius:6px;font-size:12px"><option value="pending" ${o.status==='pending'?'selected':''}>Chờ</option><option value="done" ${o.status==='done'?'selected':''}>Xong</option><option value="cancel" ${o.status==='cancel'?'selected':''}>Hủy</option></select></td><td><button class="btn btn-outline btn-sm" onclick="viewOrder('${o.id}')">👁️</button></td></tr>`).join('')}
  </tbody></table></div>`:'<div class="empty"><div class="icon">🛒</div><p>Chưa có đơn hàng. Đơn hàng sẽ xuất hiện khi khách đặt trên website.</p></div>'}</div></div>`;
}
function updateOrderStatus(id,s){const orders=DB.get('orders',[]);const o=orders.find(x=>x.id===id);if(o){o.status=s;DB.set('orders',orders);toast('Cập nhật trạng thái')};}
function viewOrder(id){const o=DB.get('orders',[]).find(x=>x.id===id);if(!o)return;openModal('Đơn hàng #'+o.id,`<p><strong>Khách:</strong> ${o.name}</p><p><strong>SĐT:</strong> ${o.phone}</p><p><strong>Email:</strong> ${o.email||'-'}</p><p><strong>Địa chỉ:</strong> ${o.address}</p><p><strong>Ghi chú:</strong> ${o.note||'-'}</p><hr style="margin:12px 0"><table><thead><tr><th>SP</th><th>Size</th><th>SL</th><th>Giá</th></tr></thead><tbody>${o.items.map(i=>`<tr><td>${i.name}</td><td>${i.size}</td><td>${i.qty}</td><td>${fmt(i.price*i.qty)}</td></tr>`).join('')}</tbody></table><hr style="margin:12px 0"><p style="font-size:18px;font-weight:800;text-align:right">Tổng: ${fmt(o.total)}</p>`,`<button class="btn btn-outline" onclick="closeModal()">Đóng</button>`)}

function renderSettings(){
  const s=DB.get('settings',{});
  $('#content').innerHTML=`<div class="card"><div class="card-head"><h3>Cài đặt chung</h3></div><div class="card-body">
  <div class="form-row"><div class="form-group"><label>Tên cửa hàng</label><input id="sName" value="${s.storeName||''}"></div><div class="form-group"><label>Hotline</label><input id="sHotline" value="${s.hotline||''}"></div></div>
  <div class="form-group"><label>Email</label><input id="sEmail" value="${s.email||''}"></div>
  <div class="form-group"><label>Promo bar text</label><textarea id="sPromo" rows="2">${s.promoText||''}</textarea></div>
  <div class="form-row"><div class="form-group"><label>Freeship tối thiểu (VNĐ)</label><input type="number" id="sFreeship" value="${s.freeShipMin||0}"></div><div class="form-group"><label>GunoCash %</label><input type="number" id="sCash" value="${s.gunocashPercent||0}"></div></div>
  <button class="btn btn-blue" onclick="saveSettings()">💾 Lưu cài đặt</button></div></div>`;
}
function saveSettings(){DB.set('settings',{storeName:$('#sName').value,hotline:$('#sHotline').value,email:$('#sEmail').value,promoText:$('#sPromo').value,freeShipMin:+$('#sFreeship').value,gunocashPercent:+$('#sCash').value});toast('Đã lưu cài đặt')}

function renderPages(){
  $('#content').innerHTML=`<div class="card"><div class="card-head"><h3>Nội dung các trang</h3></div><div class="card-body">
  <div class="list-item"><div class="list-item-content"><div class="list-item-title">Trang chủ - Hero</div><div class="list-item-sub">Tiêu đề, mô tả, CTA trên banner chính</div></div><button class="btn btn-outline btn-sm" onclick="editPageContent('hero')">✏️</button></div>
  <div class="list-item"><div class="list-item-content"><div class="list-item-title">Về GUNO</div><div class="list-item-sub">Câu chuyện thương hiệu, cam kết</div></div><button class="btn btn-outline btn-sm" onclick="editPageContent('about')">✏️</button></div>
  <div class="list-item"><div class="list-item-content"><div class="list-item-title">GunoClub</div><div class="list-item-sub">Quyền lợi thành viên</div></div><button class="btn btn-outline btn-sm" onclick="editPageContent('club')">✏️</button></div>
  <div class="list-item"><div class="list-item-content"><div class="list-item-title">Cửa hàng</div><div class="list-item-sub">Danh sách cửa hàng</div></div><button class="btn btn-outline btn-sm" onclick="editPageContent('stores')">✏️</button></div>
  <div class="list-item"><div class="list-item-content"><div class="list-item-title">Footer</div><div class="list-item-sub">Nội dung CTA, hotline, links</div></div><button class="btn btn-outline btn-sm" onclick="editPageContent('footer')">✏️</button></div>
  </div></div>`;
}
function editPageContent(pg){
  const d=DB.get('pageContent_'+pg,getDefaultPageContent(pg));
  openModal('Chỉnh sửa: '+pg,`<div class="form-group"><label>Tiêu đề</label><input id="pcTitle" value="${d.title||''}"></div><div class="form-group"><label>Nội dung (HTML)</label><textarea id="pcBody" rows="10">${d.body||''}</textarea></div>`,`<button class="btn btn-outline" onclick="closeModal()">Hủy</button><button class="btn btn-blue" onclick="savePageContent('${pg}')">Lưu</button>`);
}
function getDefaultPageContent(pg){
  const map={hero:{title:'Thời trang cho mọi ngày',body:'Đồ mặc hàng ngày, thể thao và phụ kiện tối giản.'},about:{title:'Về GUNO',body:'Thương hiệu thời trang Việt Nam với sứ mệnh mang đến trang phục thoải mái.'},club:{title:'GunoClub',body:'Hoàn tiền 7% GunoCash, voucher sinh nhật 20%.'},stores:{title:'Cửa hàng',body:'HN: 175 Nguyễn Thái Học. HCM: KCN Cát Lái.'},footer:{title:'GUNO lắng nghe bạn!',body:'Mọi ý kiến đóng góp đều quý giá.'}};
  return map[pg]||{title:'',body:''};
}
function savePageContent(pg){DB.set('pageContent_'+pg,{title:$('#pcTitle').value,body:$('#pcBody').value});closeModal();toast('Đã lưu nội dung')}

/* ===== ARTICLES ===== */
function renderArticles(){
  const arts=DB.get('articles',[]);
  const blog=arts.filter(a=>a.type==='blog');
  const press=arts.filter(a=>a.type==='press');
  $('#content').innerHTML=`
  <div class="card"><div class="card-head"><h3>Bài viết Blog (${blog.length})</h3><button class="btn btn-blue btn-sm" onclick="editArticle('blog')">+ Thêm bài viết</button></div><div class="card-body">
  ${blog.map((a,i)=>{const idx=arts.indexOf(a);return`<div class="list-item">
    <img src="${a.thumb||''}" style="width:80px;height:52px;object-fit:cover;border-radius:6px;background:var(--line)">
    <div class="list-item-content"><div class="list-item-title">${a.title}</div><div class="list-item-sub">${a.date||''} · ${a.excerpt?.slice(0,50)||''}...</div></div>
    <div class="list-item-actions"><button class="btn btn-outline btn-sm" onclick="editArticle('blog',${idx})">✏️</button><button class="btn btn-red btn-sm" onclick="deleteArticle(${idx})">🗑️</button></div>
  </div>`}).join('')}
  ${!blog.length?'<div class="empty"><p>Chưa có bài viết nào</p></div>':''}
  </div></div>
  <div class="card"><div class="card-head"><h3>Báo chí (${press.length})</h3><button class="btn btn-blue btn-sm" onclick="editArticle('press')">+ Thêm link báo</button></div><div class="card-body">
  ${press.map((a,i)=>{const idx=arts.indexOf(a);return`<div class="list-item">
    <div class="list-item-content"><div class="list-item-title">${a.title}</div><div class="list-item-sub">${a.source||'Nguồn'} · ${a.url}</div></div>
    <div class="list-item-actions"><button class="btn btn-outline btn-sm" onclick="editArticle('press',${idx})">✏️</button><button class="btn btn-red btn-sm" onclick="deleteArticle(${idx})">🗑️</button></div>
  </div>`}).join('')}
  ${!press.length?'<div class="empty"><p>Chưa có link báo chí nào</p></div>':''}
  </div></div>`;
}
function editArticle(type,idx){
  const arts=DB.get('articles',[]);
  const a=idx!=null?arts[idx]:{id:uid(),type,title:'',excerpt:'',url:'',thumb:'',date:new Date().toLocaleDateString('vi-VN'),source:''};
  const isBlog=type==='blog';
  openModal(idx!=null?'Sửa '+(isBlog?'bài viết':'link báo'):'Thêm '+(isBlog?'bài viết':'link báo'),`
    <div class="form-group"><label>Tiêu đề</label><input id="aTitle" value="${a.title}"></div>
    <div class="form-group"><label>Mô tả ngắn</label><textarea id="aExcerpt" rows="2">${a.excerpt||''}</textarea></div>
    <div class="form-group"><label>URL bài viết</label><input id="aUrl" value="${a.url}"></div>
    ${isBlog?`<div class="form-row"><div class="form-group"><label>URL ảnh thumbnail</label><input id="aThumb" value="${a.thumb||''}"></div><div class="form-group"><label>Ngày</label><input id="aDate" value="${a.date||''}"></div></div>`
    :`<div class="form-group"><label>Nguồn (VD: VnExpress, Forbes Vietnam)</label><input id="aSource" value="${a.source||''}"></div>`}
  `,`<button class="btn btn-outline" onclick="closeModal()">Hủy</button><button class="btn btn-blue" onclick="saveArticle('${type}',${idx!=null?idx:'null'})">Lưu</button>`);
}
function saveArticle(type,idx){
  const arts=DB.get('articles',[]);
  const isBlog=type==='blog';
  const a={id:uid(),type,title:$('#aTitle').value,excerpt:$('#aExcerpt').value,url:$('#aUrl').value};
  if(isBlog){a.thumb=$('#aThumb').value;a.date=$('#aDate').value}
  else{a.source=$('#aSource').value}
  if(idx!=null)arts[idx]={...arts[idx],...a};else arts.push(a);
  DB.set('articles',arts);closeModal();renderArticles();toast('Đã lưu');
}
function deleteArticle(i){const arts=DB.get('articles',[]);arts.splice(i,1);DB.set('articles',arts);renderArticles();toast('Đã xóa')}

/* ===== CHAT CONFIG ===== */
function renderChatSettings(){
  const c=DB.get('chatConfig',{messenger:'',zalo:'',enabled:true});
  $('#content').innerHTML=`<div class="card"><div class="card-head"><h3>Cài đặt Chat Widget</h3></div><div class="card-body">
  <div class="form-group"><label>Trạng thái</label><div style="display:flex;align-items:center;gap:12px"><button class="toggle ${c.enabled?'on':''}" id="chatEnable" onclick="this.classList.toggle('on')"></button><span style="font-size:13px;color:var(--sub)">${c.enabled?'Đang bật':'Đang tắt'}</span></div></div>
  <div class="form-group"><label>💬 Link Messenger</label><input id="cMess" value="${c.messenger||''}" placeholder="https://m.me/your-page"></div>
  <div class="form-group"><label>📱 Link Zalo</label><input id="cZalo" value="${c.zalo||''}" placeholder="https://zalo.me/your-oa"></div>
  <p style="font-size:12px;color:var(--sub);margin-bottom:16px">Để trống link nào sẽ ẩn nút chat đó. Widget hiển thị ở góc phải dưới trang.</p>
  <button class="btn btn-blue" onclick="saveChatConfig()">💾 Lưu cài đặt chat</button></div></div>`;
}
function saveChatConfig(){
  DB.set('chatConfig',{messenger:$('#cMess').value,zalo:$('#cZalo').value,enabled:$('#chatEnable').classList.contains('on')});
  toast('Đã lưu cài đặt chat');
}
