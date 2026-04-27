# Hướng dẫn triển khai Hệ thống VinCons Material Management

Hệ thống được thiết kế theo kiến trúc Full-stack với:
- **Frontend**: React (Vite)
- **Backend**: Google Apps Script (GAS)
- **Database**: Google Sheets

## Bước 1: Thiết lập Google Sheets
1. Truy cập [Google Sheets](https://sheets.new).
2. Tạo một Spreadsheet mới.
3. Tạo 6 Sheet với tên chính xác:
   - `DonHangVatTu`
   - `DanhMucVatTu`
   - `DuAn`
   - `SuVuToiUu`
   - `NguoiDung`
   - `CauHinhQuyen`
4. Copy nội dung từ các file trong thư mục `/csv_samples` (mở bằng Notepad/Code Editor) và Paste vào dòng đầu tiên của các Sheet tương ứng.

## Bước 2: Triển khai Backend (Google Apps Script)
1. Trong Google Sheet, chọn **Extensions** > **Apps Script**.
2. Copy toàn bộ mã trong file `/backend/Code.gs` và dán vào trình biên tập GAS.
3. Nhấn **Save**.
4. Nhấn **Deploy** > **New Deployment**.
5. Chọn loại là **Web App**.
6. Cấu hình:
   - **Execute as**: Me
   - **Who has access**: Anyone
7. Copy **Web App URL** trả về (có dạng `https://script.google.com/macros/s/.../exec`).

## Bước 3: Cấu hình Frontend
1. Tạo file `.env` từ `.env.example`.
2. Dán URL nhận được ở Bước 2 vào biến `VITE_API_URL`.
   ```env
   VITE_API_URL="https://script.google.com/macros/s/.../exec"
   ```

## Bước 4: Deploy Frontend lên Vercel
1. Push mã nguồn lên GitHub.
2. Kết nối dự án GitHub với Vercel.
3. Thêm biến môi trường `VITE_API_URL` trong mục Settings của Vercel.
4. Cấu hình framework là **Vite**.
5. Nhấn **Deploy**.

## Checklist nghiệm thu
- [ ] Dashboard hiển thị KPI và biểu đồ (cần nhập dữ liệu mẫu vào Sheet trước).
- [ ] Truy cập được danh sách đơn hàng.
- [ ] Click vào 1 đơn hàng hiện Panel chi tiết bên phải.
- [ ] Trang Dự án và Danh mục hiển thị đúng list từ Sheet.
- [ ] Kiểm tra responsive trên mobile/tablet.
