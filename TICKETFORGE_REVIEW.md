# WORKST-9 — Sửa lớn vãi đái

## Tóm tắt
Agent đã đánh giá ticket bằng `deepseek-flash` và ghi nhận trên nhánh `ticketforge/WORKST-9-sua-lon-vai-ai`.

## Mức độ và phạm vi
- Mức độ: P2 (độ tin cậy 0.87)
- Lý do: Ticket xác nhận 3 lỗi nội dung liên hệ/địa chỉ/bản đồ trên trang chủ: hotline không nhất quán, địa chỉ mẫu TP.HCM lệch footer Quảng Ninh, bản đồ nhúng/URL chỉ đường sai khu vực. Ảnh hưởng trực tiếp đến liên hệ và chỉ đường nhưng không phải sự cố hạ tầng, bảo mật hay mất dữ liệu; có thể sửa cấu hình nội dung.
- Trong phạm vi: có
- Các lỗi đều thuộc phần liên hệ/địa chỉ/bản đồ trên route '/' và khớp trực tiếp với nội dung ticket; chỉ cần sửa cấu hình liên hệ, địa chỉ và bản đồ liên quan.

## Nguyên nhân
Hotline nội dung 0123 456 789 / tel:0123456789 khác footer 0961799588; Địa chỉ hiển thị 123 Đường ABC, Quận XYZ, TP.HCM khác footer Bãi Cháy, Quảng Ninh; Bản đồ nhúng thể hiện khu Chợ Bà Chiểu tại TP.HCM; URL chỉ đường dùng địa chỉ mẫu; Rủi ro khách gọi nhầm, mất lead và bị dẫn tới sai thành phố; Không có ảnh đính kèm để đối chiếu OCR/UI

## Thay đổi
- Chưa có patch mã nguồn.

## Rủi ro
Bản vá cần lập trình viên đọc diff trước khi merge vào nhánh sản phẩm.

## Cách kiểm tra
Đối chiếu route và mô tả trong ticket, rồi chạy lại đúng thao tác gây lỗi.
