export const enumData = {
  DataType: {
    string: { code: 'string', name: 'Kiểu chuỗi', format: '' },
    int: { code: 'int', name: 'Kiểu sổ nguyên', format: '' },
    float: { code: 'float', name: 'Kiểu sổ thập phân', format: '' },
    date: { code: 'date', name: 'Kiểu ngày', format: 'dd/MM/yyyy' },
    dateTime: {
      code: 'dateTime',
      name: 'Kiểu ngày giờ',
      format: 'dd/MM/yyyy HH:mm:ss',
    },
    time: { code: 'time', name: 'Kiểu giờ', format: 'HH:mm:ss' },
    boolean: { code: 'boolean', name: 'Kiểu checkbox', format: '' },
  },

  TypeField: {
    TEXT: { code: 'TEXT', name: 'Kiểu chuỗi', format: '' },
    NUMBER: { code: 'NUMBER', name: 'Kiểu sổ nguyên', format: '' },
    BOOLEAN: { code: 'BOOLEAN', name: 'Kiểu checkbox', format: '' },
    DATE: { code: 'DATE', name: 'Kiểu ngày', format: 'dd/MM/yyyy' },
    DATETIME: {
      code: 'DATETIME',
      name: 'Kiểu ngày giờ',
      format: 'dd/MM/yyyy HH:mm:ss',
    },
    TIME: { code: 'TIME', name: 'Kiểu giờ', format: 'HH:mm:ss' },
    JSON: { code: 'JSON', name: 'Kiểu JSON', format: '' },
  },

  DayInWeek: {
    SUNDAY: { code: 'SUNDAY', name: 'Chủ nhật' },
    MONDAY: { code: 'MONDAY', name: 'Thứ hai' },
    TUESDAY: { code: 'TUESDAY', name: 'Thứ ba' },
    WEDNESDAY: { code: 'WEDNESDAY', name: 'Thứ tư' },
    THURSDAY: { code: 'THURSDAY', name: 'Thứ năm' },
    FRIDAY: { code: 'FRIDAY', name: 'Thứ sáu' },
    SATURDAY: { code: 'SATURDAY', name: 'Thứ bảy' },
  },

  Gender: {
    MALE: { code: 'Male', name: 'Nam' },
    FEMALE: { code: 'Female', name: 'Nữ' },
    OTHER: { code: 'Other', name: 'Khác' },
  },

  UserType: {
    Employee: {
      code: 'Employee',
      name: 'Giáo viên/Trợ giảng',
      description: '',
    },
    Admin: { code: 'Admin', name: 'Admin', description: '' },
  },

  ActionLogType: {
    CREATE: { code: 'CREATE', name: 'Thêm mới', type: 'ThemMoi' },
    DELETE: { code: 'DELETE', name: 'Xoá bỏ', type: 'XoaBo' },
    UPDATE: { code: 'UPDATE', name: 'Cập nhật', type: 'CapNhat' },
    SYNC: { code: 'SYNC', name: 'Đồng bộ', type: 'DongBo' },
    EDIT: { code: 'EDIT', name: 'Chỉnh sửa', type: 'ChinhSua' },
    APPROVE: { code: 'APPROVE', name: 'Duyệt', type: 'Duyet' },
    SEND_APPROVE: { code: 'SEND_APPROVE', name: 'Gửi Duyệt', type: 'GuiDuyet' },
    REJECT: { code: 'REJECT', name: 'Từ chối', type: 'TuChoi' },
    CANCEL: { code: 'CANCEL', name: 'Huỷ', type: 'Huy' },
    IMPORT_EXCEL: {
      code: 'IMPORT_EXCEL',
      name: 'Nhập excel',
      type: 'NhapExcel',
    },
    ACTIVATE: { code: 'ACTIVATE', name: 'Kích hoạt', type: 'KichHoat' },
    DEACTIVATE: {
      code: 'DEACTIVATE',
      name: 'Ngưng hoạt động',
      type: 'NgungHoatDong',
    },
    RESTORE: { code: 'RESTORE', name: 'Khôi phục', type: 'KhoiPhuc' },
  },

  OTPSendMethod: {
    EMAIL: 'EMAIL',
    SMS: 'SMS',
  },

  LoginProvider: {
    LOCAL: 'local',
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
  },

  NOTIFICATION_TYPE: {
    PAYMENT: { code: 'PAYMENT', name: 'Thanh toán' },
    PROMOTION: { code: 'PROMOTION', name: 'Khuyến mãi' },
    SYSTEM: { code: 'SYSTEM', name: 'Hệ thống' },
    RECOMMENDATION: { code: 'RECOMMENDATION', name: 'Gợi ý' },
  },

  NOTIFICATION_PRIORITY: {
    LOW: { code: 'LOW', name: 'Thấp' },
    MEDIUM: { code: 'MEDIUM', name: 'Trung bình' },
    HIGH: { code: 'HIGH', name: 'Cao' },
    URGENT: { code: 'URGENT', name: 'Khẩn cấp' },
  },

  NotifyColor: {
    BLUE: { code: 'BLUE', name: 'Blue' },
    GREEN: { code: 'GREEN', name: 'Green' },
    RED: { code: 'RED', name: 'Red' },
    YELLOW: { code: 'YELLOW', name: 'Yellow' },
    PURPLE: { code: 'PURPLE', name: 'Purple' },
    ORANGE: { code: 'ORANGE', name: 'Orange' },
    PINK: { code: 'PINK', name: 'Pink' },
    BROWN: { code: 'BROWN', name: 'Brown' },
    GRAY: { code: 'GRAY', name: 'Gray' },
    BLACK: { code: 'BLACK', name: 'Black' },
  },

  /** Trạng thái thành viên: active | inactive | suspended */
  MemberStatus: {
    ACTIVE: { code: 'active', name: 'Đang hoạt động' },
    INACTIVE: { code: 'inactive', name: 'Ngưng hoạt động' },
    SUSPENDED: { code: 'suspended', name: 'Bị tạm khóa' },
  },

  /** Trạng thái quỹ: draft | active | paused | closed */
  FundStatus: {
    DRAFT: { code: 'draft', name: 'Bản nháp' },
    ACTIVE: { code: 'active', name: 'Đang hoạt động' },
    PAUSED: { code: 'paused', name: 'Tạm dừng' },
    CLOSED: { code: 'closed', name: 'Đã đóng' },
  },

  /** Trạng thái thành viên trong quỹ: active | inactive | suspended */
  FundMemberStatus: {
    ACTIVE: { code: 'active', name: 'Đang tham gia' },
    INACTIVE: { code: 'inactive', name: 'Ngưng tham gia' },
    SUSPENDED: { code: 'suspended', name: 'Bị tạm khóa' },
  },

  /** Loại chu kỳ: monthly | quarterly | yearly | custom */
  CycleType: {
    MONTHLY: { code: 'monthly', name: 'Hàng tháng' },
    QUARTERLY: { code: 'quarterly', name: 'Hàng quý' },
    YEARLY: { code: 'yearly', name: 'Hàng năm' },
    CUSTOM: { code: 'custom', name: 'Tùy chỉnh' },
  },

  /** Trạng thái chu kỳ: open | collecting | closed | paid_out | cancelled */
  CycleStatus: {
    OPEN: { code: 'open', name: 'Đang mở' },
    COLLECTING: { code: 'collecting', name: 'Đang thu tiền' },
    CLOSED: { code: 'closed', name: 'Đã đóng' },
    PAID_OUT: { code: 'paid_out', name: 'Đã giải ngân' },
    CANCELLED: { code: 'cancelled', name: 'Đã hủy' },
  },

  /** Trạng thái đóng tiền: pending | paid | late | waived | overdue */
  ContributionStatus: {
    PENDING: { code: 'pending', name: 'Chưa đóng' },
    PAID: { code: 'paid', name: 'Đã đóng' },
    LATE: { code: 'late', name: 'Đóng trễ' },
    WAIVED: { code: 'waived', name: 'Được miễn' },
    OVERDUE: { code: 'overdue', name: 'Quá hạn' },
  },

  /** Phương thức thanh toán: bank_transfer | cash | qr_code */
  PaymentMethodFund: {
    BANK_TRANSFER: { code: 'bank_transfer', name: 'Chuyển khoản ngân hàng' },
    CASH: { code: 'cash', name: 'Tiền mặt' },
    QR_CODE: { code: 'qr_code', name: 'Mã QR' },
  },

  /** Kênh gửi thông báo: email | sms | push  */
  ReminderChannel: {
    EMAIL: { code: 'email', name: 'Email' },
    SMS: { code: 'sms', name: 'SMS' },
    PUSH: { code: 'push', name: 'Push notification' },
  },

  /** Trạng thái gửi nhắc nhở: pending | sent | failed */
  ReminderStatus: {
    PENDING: { code: 'pending', name: 'Chờ gửi' },
    SENT: { code: 'sent', name: 'Đã gửi' },
    FAILED: { code: 'failed', name: 'Gửi thất bại' },
  },

  /** Trạng thái đơn đăng ký nhận tiền: pending | reviewing | approved | rejected | paid_out | cancelled */
  ReceiptStatus: {
    PENDING: { code: 'pending', name: 'Chờ duyệt' },
    REVIEWING: { code: 'reviewing', name: 'Đang xét duyệt' },
    APPROVED: { code: 'approved', name: 'Đã duyệt' },
    REJECTED: { code: 'rejected', name: 'Từ chối' },
    PAID_OUT: { code: 'paid_out', name: 'Đã giải ngân' },
    CANCELLED: { code: 'cancelled', name: 'Đã hủy' },
  },

  /** Loại tài liệu đính kèm: medical | certificate | invoice | other */
  DocumentType: {
    MEDICAL: { code: 'medical', name: 'Giấy tờ y tế' },
    CERTIFICATE: { code: 'certificate', name: 'Giấy chứng nhận' },
    INVOICE: { code: 'invoice', name: 'Hóa đơn' },
    OTHER: { code: 'other', name: 'Khác' },
  },

  /** Kiểu cấp quyền đặc biệt: Allow | Deny */
  GrantType: {
    ALLOW: { code: 'Allow', name: 'Cho phép' },
    DENY: { code: 'Deny', name: 'Từ chối' },
  },

  /** Kênh thông báo: email | sms | push | all */
  NotifyChannel: {
    EMAIL: { code: 'email', name: 'Email' },
    SMS: { code: 'sms', name: 'SMS' },
    PUSH: { code: 'push', name: 'Push notification' },
    ALL: { code: 'all', name: 'Tất cả kênh' },
  },

  /** Loại giao dịch: contribution | disbursement | fee | adjustment | refund */
  TransactionType: {
    CONTRIBUTION: { code: 'contribution', name: 'Thu đóng quỹ' },
    DISBURSEMENT: { code: 'disbursement', name: 'Giải ngân' },
    FEE: { code: 'fee', name: 'Phí' },
    ADJUSTMENT: { code: 'adjustment', name: 'Điều chỉnh' },
    REFUND: { code: 'refund', name: 'Hoàn tiền' },
  },

  /** Chiều giao dịch: in (thu) | out (chi) */
  Direction: {
    IN: { code: 'in', name: 'Thu vào' },
    OUT: { code: 'out', name: 'Chi ra' },
  },

  /** Loại file: image | video | audio | pdf | docx | spreadsheet */
  FileType: {
    IMAGE: { code: 'image', name: 'Hình ảnh' },
    VIDEO: { code: 'video', name: 'Video' },
    AUDIO: { code: 'audio', name: 'Âm thanh' },
    PDF: { code: 'pdf', name: 'PDF' },
    DOCX: { code: 'docx', name: 'Word' },
    SPREADSHEET: { code: 'spreadsheet', name: 'Bảng tính' },
  },

  /** Nhà cung cấp lưu trữ: s3 | gcs | local | cloudinary */
  StorageProvider: {
    S3: { code: 's3', name: 'AWS S3' },
    GCS: { code: 'gcs', name: 'Google Cloud Storage' },
    LOCAL: { code: 'local', name: 'Máy chủ nội bộ' },
    CLOUDINARY: { code: 'cloudinary', name: 'Cloudinary' },
  },

  /** Trạng thái đăng nhập: success | failed | blocked */
  LoginStatus: {
    SUCCESS: { code: 'success', name: 'Thành công' },
    FAILED: { code: 'failed', name: 'Thất bại' },
    BLOCKED: { code: 'blocked', name: 'Bị chặn' },
  },

  /** Loại thiết bị: web | mobile | desktop */
  DeviceType: {
    WEB: { code: 'web', name: 'Web' },
    MOBILE: { code: 'mobile', name: 'Di động' },
    DESKTOP: { code: 'desktop', name: 'Máy tính' },
  },

  /** Loại tác nhân: employee | member | admin */
  ActorType: {
    EMPLOYEE: { code: 'employee', name: 'Nhân viên' },
    MEMBER: { code: 'member', name: 'Thành viên' },
    ADMIN: { code: 'admin', name: 'Quản trị' },
  },

  /** Kiểu dữ liệu cấu hình: string | number | boolean | json */
  SystemConfigDataType: {
    STRING: { code: 'string', name: 'Chuỗi' },
    NUMBER: { code: 'number', name: 'Số' },
    BOOLEAN: { code: 'boolean', name: 'Đúng/Sai' },
    JSON: { code: 'json', name: 'JSON' },
  },

  /** Loại đối tượng liên quan trong thông báo: FundReceipt | Contribution | FundCycle */
  NotificationEntityType: {
    FUND_RECEIPT: { code: 'FundReceipt', name: 'Đơn đăng ký nhận tiền' },
    CONTRIBUTION: { code: 'Contribution', name: 'Phiếu đóng tiền' },
    FUND_CYCLE: { code: 'FundCycle', name: 'Chu kỳ quỹ' },
  },

  /** Mã vai trò hệ thống: ADMIN | EMPLOYEE | MEMBER */
  RoleCode: {
    ADMIN: { code: 'ADMIN', name: 'Quản trị' },
    EMPLOYEE: { code: 'EMPLOYEE', name: 'Nhân viên' },
    MEMBER: { code: 'MEMBER', name: 'Thành viên' },
  },

  /** Module hệ thống */
  SystemModule: {
    FUND: { code: 'fund', name: 'Quỹ' },
    MEMBER: { code: 'member', name: 'Thành viên' },
    NOTIFICATION: { code: 'notification', name: 'Thông báo' },
    SECURITY: { code: 'security', name: 'Bảo mật' },
    PAYMENT: { code: 'payment', name: 'Thanh toán' },
    REPORT: { code: 'report', name: 'Báo cáo' },
  },
};

export const millisecondInDay = 86400000;
export const SUCCESS = 0;
export const ACCESS_TOKEN_INVALID = -216;
export const OA_ID_INVALID = -217;
export const REFRESH_TOKEN_EXPIRED = -14005;
export const INVALID_REFRESH_TOKEN = -14006;

export const SystemConfig = {};
