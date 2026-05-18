# HuiApp — Hệ thống quản lý hụi & sinh nhật nhóm bạn

> Được thiết kế riêng cho nhóm bạn thân của **Hoàn** — 20 người, mỗi tháng mỗi người góp 200.000đ, 1 người được nhận toàn bộ quỹ.

---

## 1. Tổng quan

HuiApp là ứng dụng web giúp nhóm bạn quản lý quỹ hụi hàng tháng một cách minh bạch, tự động và không còn phụ thuộc vào việc nhắn tin Zalo hay chuyển tiền thủ công thiếu kiểm soát.

### Tính năng sinh nhật

- Hệ thống tự động nhận diện sinh nhật các thành viên
- Gửi chúc mừng tự động vào lúc 00:00 ngày sinh nhật
- Nhắc nhở trước sinh nhật (cấu hình số ngày)

---

## 2. Vai trò & Phân quyền

### Hoàn — Admin (isAdmin: true)

Hoàn có toàn quyền trong hệ thống:

- Tất cả chức năng quản lý hụi
- Phân quyền người dùng (Roles, Permissions)
- Cấu hình hệ thống

### Thành viên — Member

Mỗi thành viên có tài khoản riêng để:

- Xem trạng thái đóng tiền của bản thân từng kỳ
- Đăng ký nhận hụi khi muốn
- Nộp tiền qua MoMo hoặc upload minh chứng chuyển khoản thủ công
- Xem lịch sử các kỳ đã nhận tiền
- Cập nhật thông tin QR code ngân hàng cá nhân
- Nhận thông báo qua Zalo hoặc email

### Hệ thống phân quyền linh động

- **Roles**: ADMIN, MEMBER
- **Permissions**: CYCLE_CREATE, CYCLE_VIEW, CONTRIBUTION_MANAGE, MEMBER_VIEW, ...
- **User-Roles**: N-N giữa Users và Roles
- **Role-Permissions**: N-N giữa Roles và Permissions
- **User-Permissions**: Cấp quyền đặc biệt cho user (Allow/Deny)

---

## 3. Luồng hụi theo tháng

### Bước 1 — Hoàn mở kỳ mới

Đầu mỗi tháng, Hoàn vào app bấm **"Mở kỳ tháng X"**. Hệ thống tự động:

- Tạo bản ghi Cycles mới với ngày bắt đầu, hạn đóng tiền
- Tạo Contributions cho tất cả 20 thành viên active
- Gửi thông báo đồng loạt

### Bước 2 — Thành viên đăng ký nhận

Trong khoảng thời gian đầu kỳ, bất kỳ thành viên nào muốn nhận tiền tháng này có thể vào app bấm **"Đăng ký nhận kỳ này"**.

Hoàn xem danh sách đăng ký và **chọn 1 người**.

### Bước 3 — Thu tiền

19 thành viên còn lại tiến hành đóng tiền qua 2 hình thức:

- **MoMo tự động**: Link thanh toán, callback tự động cập nhật
- **Chuyển khoản thủ công**: Upload minh chứng, Hoàn xác nhận

### Bước 4 — Hoàn chuyển tiền

Sau khi thu đủ tiền, Hoàn vào tab **"Chuyển tiền"**, thực hiện chuyển khoản và upload minh chứng.

Người nhận xác nhận đã nhận tiền → kỳ hụi kết thúc.

---

## 4. Schema Database

Xem chi tiết tại `src/database/schema.dbml`

### Bảng chính:

- **Users**: Tài khoản đăng nhập
- **Roles**: Vai trò (ADMIN, MEMBER)
- **Permissions**: Quyền hạn
- **UserRoles**: N-N Users-Roles
- **RolePermissions**: N-N Roles-Permissions
- **UserPermissions**: Quyền đặc biệt cho user
- **Members**: Hồ sơ thành viên (liên kết User)
- **Cycles**: Kỳ hụi
- **Contributions**: Phiếu đóng tiền
- **CycleRegistrations**: Đăng ký nhận hụi
- **Disbursements**: Phiếu giải ngân
- **FundTransactions**: Sổ thu chi
- **NotificationTemplates**: Mẫu thông báo
- **Notifications**: Thông báo thực tế

---

## 5. Cron Jobs tự động

| Job             | Lịch chạy               | Hành động           |
| --------------- | ----------------------- | ------------------- |
| `AutoOpenCycle` | 00:00 ngày 1 hàng tháng | Tự động mở kỳ mới   |
| `ReminderJob`   | 08:00 hàng ngày         | Nhắc nộp tiền D-3   |
| `OverdueJob`    | 00:01 hàng ngày         | Đánh dấu quá hạn    |
| `BirthdayJob`   | 00:00 hàng ngày         | Chúc mừng sinh nhật |

---

_Tài liệu này được tạo cho dự án HuiApp — hệ thống quản lý hụi nhóm bạn của Hoàn._
