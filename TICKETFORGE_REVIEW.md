# WORKST-11 — /blog?tab=tuyen-dung

## Tóm tắt
Agent đã đánh giá ticket bằng `deepseek-flash` và ghi nhận trên nhánh `ticketforge/WORKST-11-blog-tab-tuyen-dung`.

## Mức độ và phạm vi
- Mức độ: P4 (độ tin cậy 0.96)
- Lý do: Ticket chỉ yêu cầu đổi nhãn tiêu đề tab từ 'Tin tuyển dụng' thành 'Tuyển dụng' trên route /blog?tab=tuyen-dung. Đây là thay đổi copy/UI tối giản, không ảnh hưởng logic, dữ liệu hay schema.
- Trong phạm vi: có
- Thay đổi nằm trực tiếp trong phạm vi ticket: chỉ sửa nhãn hiển thị của tab tuyển dụng trên route được nêu.

## Nguyên nhân
Chưa tách được tín hiệu cụ thể.

## Thay đổi
- `frontend/src/pages/Blog.jsx`

## Rủi ro
Bản vá cần lập trình viên đọc diff trước khi merge vào nhánh sản phẩm.

## Cách kiểm tra
Đối chiếu route và mô tả trong ticket, rồi chạy lại đúng thao tác gây lỗi.
