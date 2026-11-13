# WORKST-10 — /ve-chung-toi

## Tóm tắt
Agent đã đánh giá ticket bằng `deepseek-flash` và ghi nhận trên nhánh `ticketforge/WORKST-10-ve-chung-toi`.

## Mức độ và phạm vi
- Mức độ: P1 (độ tin cậy 0.92)
- Lý do: Prompt chọn mục 1: CTA 'Đặt lịch thăm' trên route /ve-chung-toi trỏ tới /dich-vu thay vì mở form đặt lịch/tham quan, chặn hành động chuyển đổi chính đã được xác minh. Đây là lỗi luồng chính nhưng không phải sự cố toàn hệ thống.
- Trong phạm vi: có
- Lỗi mục 1 liên quan trực tiếp tới CTA 'Đặt lịch thăm' trên đúng route /ve-chung-toi. Chỉ nên sửa CTA/liên kết này và giữ nội dung, bước đi nhất quán; không mở rộng sang các mục 2-4 nếu prompt chỉ chọn mục 1.

## Nguyên nhân
Route: /ve-chung-toi; Prompt: 1; CTA: Đặt lịch thăm; href hiện tại: /dich-vu; Không mở form đặt lịch; Lỗi đã xác minh

## Thay đổi
- `frontend/src/config/socialLinks.js`
- `frontend/src/components/SocialIconLinks.jsx`
- `frontend/src/components/BookingCtaButton.jsx`
- `frontend/src/components/Footer.jsx`
- `frontend/src/pages/VeChungToi.jsx`

## Rủi ro
Bản vá cần lập trình viên đọc diff trước khi merge vào nhánh sản phẩm.

## Cách kiểm tra
Đối chiếu route và mô tả trong ticket, rồi chạy lại đúng thao tác gây lỗi.
