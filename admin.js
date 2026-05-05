/* Admin Router - combines all admin modules */
const TABS={dashboard:renderDashboard,products:renderProducts,banners:renderBanners,navigation:renderNavigation,pages:renderPages,vouchers:renderVouchers,popups:renderPopups,policies:renderPolicies,articles:renderArticles,chat:renderChatSettings,orders:renderOrders,settings:renderSettings};
const TITLES={dashboard:'Dashboard',products:'Sản phẩm',banners:'Banner Slider',navigation:'Navigation',pages:'Nội dung trang',vouchers:'Voucher & Mã giảm',popups:'Popup',policies:'Chính sách',articles:'Bài viết & Báo chí',chat:'Chat Widget',orders:'Đơn hàng',settings:'Cài đặt'};
let currentTab='dashboard';

function switchTab(tab){
  currentTab=tab;
  $$('.nav-item').forEach(a=>a.classList.toggle('active',a.dataset.tab===tab));
  $('#pageTitle').textContent=TITLES[tab]||tab;
  if(TABS[tab])TABS[tab]();
}

// Sidebar nav clicks
$$('.nav-item').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();switchTab(a.dataset.tab);if(window.innerWidth<769)$('#sidebar').classList.remove('open')}));
// Mobile menu
$('#menuToggle').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));

// Init
switchTab('dashboard');
