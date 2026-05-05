# GUNO - E-commerce Platform

Nền tảng thương mại điện tử thời trang với Admin CMS đầy đủ tính năng.

## 🚀 Demo

Mở `index.html` trực tiếp trong trình duyệt hoặc deploy lên GitHub Pages.

## ✨ Tính năng

### Frontend (Storefront)
- Trang chủ với Banner Slider tự động
- Bộ sưu tập sản phẩm với bộ lọc
- Chi tiết sản phẩm (chọn size, màu, số lượng)
- Giỏ hàng Drawer
- Checkout & đặt hàng
- Chat widget (Messenger + Zalo)
- Responsive trên mọi thiết bị

### Admin CMS (`admin.html`)
- 📊 Dashboard thống kê
- 📦 Quản lý sản phẩm (CRUD, Import/Export JSON)
- 🖼️ Banner Slider
- 🧭 Navigation động
- 📄 Nội dung các trang
- 🏷️ Voucher & mã giảm giá
- 💬 Popup thông báo
- 📋 Chính sách cửa hàng
- 📰 Bài viết & Báo chí
- 💬 Chat Widget (Messenger/Zalo)
- 🛒 Quản lý đơn hàng
- ⚙️ Cài đặt chung

## 🛠️ Công nghệ

- HTML5 / CSS3 / Vanilla JavaScript
- SPA (Single Page Application) architecture
- localStorage làm database
- Không cần server / framework

## 📁 Cấu trúc

```
├── index.html          # Trang chủ
├── collection.html     # Bộ sưu tập
├── product.html        # Chi tiết sản phẩm
├── checkout.html       # Thanh toán
├── about.html          # Về GUNO
├── admin.html          # Admin CMS
├── style.css           # Frontend styles
├── admin.css           # Admin styles
├── app.js              # Frontend logic
├── data.js             # Dữ liệu sản phẩm
├── admin-core.js       # Admin core & init data
├── admin-tabs1.js      # Admin: Products & Banners
├── admin-tabs2.js      # Admin: Nav, Vouchers, Orders...
└── admin.js            # Admin router
```

## 📝 License

MIT
