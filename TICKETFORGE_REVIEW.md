# WORKST-8 — Sửa lớn

## Tóm tắt
Agent đã đánh giá ticket bằng `deepseek-flash` và ghi nhận trên nhánh `ticketforge/WORKST-8-sua-lon`.

## Mức độ và phạm vi
- Mức độ: P2 (độ tin cậy 0.84)
- Lý do: Phản hồi thiết kế/nội dung trên trang chủ: CTA menu dẫn sai sang tài liệu hỗ trợ thay vì đặt lịch/tư vấn, ảnh hưởng luồng chuyển đổi nhưng không gây lỗi hệ thống hay mất dữ liệu.
- Trong phạm vi: có
- Chỉ sửa trực tiếp mục 1 trên route "/": nhãn/đích CTA menu và vị trí tài liệu hướng dẫn. Không sửa hero, số liệu, ISO hoặc schema nếu không được yêu cầu.

## Nguyên nhân
Route "/" là trang chủ.; Prompt "1" nhắm mục góp ý 1: menu CTA sai hành động.; Mô tả: hướng dẫn sử dụng là nút nổi bật; tài liệu dành cho người nhà/điều dưỡng.; Tác động: khách mới bị dẫn sang nội dung hỗ trợ thay vì tư vấn.; Chỉnh đề xuất: CTA menu thành "Đặt lịch tham quan"; chuyển tài liệu hướng dẫn vào mục Hỗ trợ.; Các mục 2-4 là góp ý trang chủ khác (hero, số liệu, ISO) nhưng không phải trọng tâm prompt "1".; Không có ảnh đính kèm để OCR/vision.

## Thay đổi
- `frontend/src/components/Footer.jsx`

## Rủi ro
Bản vá cần lập trình viên đọc diff trước khi merge vào nhánh sản phẩm.

## Cách kiểm tra
Đối chiếu route và mô tả trong ticket, rồi chạy lại đúng thao tác gây lỗi.
