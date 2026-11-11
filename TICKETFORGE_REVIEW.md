# WORKST-1 — Sửa UI

## Tóm tắt
Agent đã đánh giá ticket bằng `deepseek-flash` và ghi nhận trên nhánh `ticketforge/WORKST-1-sua-ui`.

## Mức độ và phạm vi
- Mức độ: P4 (độ tin cậy 0.95)
- Lý do: Đây là thay đổi text hiển thị đơn giản trên trang route '/', không ảnh hưởng đến chức năng, dữ liệu hay schema.
- Trong phạm vi: có
- Yêu cầu chỉ sửa nội dung text liên quan trực tiếp tới prompt và route '/', đúng phạm vi ticket.

## Nguyên nhân
route: /; prompt: 'Chăm Sóc Người Cao Tuổi Tại Hạ Long'; yêu cầu thay 'Hạ Long' bằng 'Hải Phòng'; không có ảnh đính kèm

## Thay đổi
- Chưa có patch mã nguồn.

## Rủi ro
Bản vá cần lập trình viên đọc diff trước khi merge vào nhánh sản phẩm.

## Cách kiểm tra
Đối chiếu route và mô tả trong ticket, rồi chạy lại đúng thao tác gây lỗi.
