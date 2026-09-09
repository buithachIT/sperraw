# Bối cảnh sản phẩm

## Vấn đề

Công ty đang vận hành một nền tảng **Recognition & Rewards** nội bộ. Mục tiêu của nền tảng:

- Khuyến khích hành vi tích cực và thói quen tốt
- Tạo thói quen ghi nhận lẫn nhau giữa nhân viên
- Tăng engagement và xây môi trường làm việc tích cực

Nền tảng hiện **ổn định cho một tổ chức (single-tenant)**. Công ty muốn mở rộng thành **SaaS đa tenant**, để nhiều doanh nghiệp khác nhau đăng ký và sử dụng độc lập.

## Đề tài

**Xây dựng luồng onboarding** — cho phép doanh nghiệp mới đăng ký sử dụng nền tảng và tạo **workspace** tương ứng.

Workspace là ranh giới tenant: dữ liệu nhân viên, ghi nhận, và phần thưởng của mỗi doanh nghiệp nằm trong workspace của họ, không lẫn với tenant khác.

## Mục tiêu

1. Doanh nghiệp tự đăng ký, không cần team nội bộ tạo tenant thủ công.
2. Người đăng ký đầu tiên trở thành **workspace admin**.
3. Sau onboarding, doanh nghiệp có một workspace sẵn sàng để bắt đầu dùng Recognition & Rewards.

## Người dùng

| Vai trò | Mô tả |
| --- | --- |
| Workspace admin | Người đại diện doanh nghiệp, hoàn tất onboarding, quản lý workspace |
| Nhân viên | Người dùng sau khi được mời vào workspace — **ngoài scope** bài này |

## Trong scope

- Đăng ký tài khoản người đại diện (admin)
- Tạo workspace (tên + slug)
- Cấu hình email forwarding (mock)
- Mời thành viên (tuỳ chọn, có thể bỏ qua)
- Màn hình hoàn tất và homepage workspace (placeholder)

Chi tiết luồng: [onboarding-flow.md](./onboarding-flow.md).

## Ngoài scope

- Tính năng Recognition & Rewards (kudos, catalog, điểm thưởng)
- Thanh toán / billing
- SSO, SAML, Google/Microsoft login
- Xác thực email thật (SMTP) — UI có thể mô phỏng
- Dashboard vận hành sau onboarding (chỉ cần trang placeholder)
- Multi-workspace cho một user

## Giả định

Chưa có Figma hay API backend chính thức. Flow, copy, field và contract dưới đây là **spec frontend** để implement; có thể chỉnh khi có design hoặc API thật.
