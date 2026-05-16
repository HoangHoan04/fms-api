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
  MEMBER_STATUS: {
    ACTIVE: { code: 'ACTIVE', name: 'Đang hoạt động' },
    INACTIVE: { code: 'INACTIVE', name: 'Ngưng hoạt động' },
    SUSPENDED: { code: 'SUSPENDED', name: 'Bị tạm khóa' },
  },

  /** Trạng thái quỹ: draft | active | paused | closed */
  FUND_STATUS: {
    DRAFT: { code: 'DRAFT', name: 'Bản nháp', color: 'gray' },
    ACTIVE: { code: 'ACTIVE', name: 'Đang hoạt động', color: 'green' },
    PAUSED: { code: 'PAUSED', name: 'Tạm dừng', color: 'yellow' },
    CLOSED: { code: 'CLOSED', name: 'Đã đóng', color: 'red' },
  },

  /** Trạng thái thành viên trong quỹ: active | inactive | suspended */
  FUND_MEMBER_STATUS: {
    ACTIVE: { code: 'ACTIVE', name: 'Đang tham gia' },
    INACTIVE: { code: 'INACTIVE', name: 'Ngưng tham gia' },
    SUSPENDED: { code: 'SUSPENDED', name: 'Bị tạm khóa' },
  },

  /** Loại chu kỳ: monthly | quarterly | yearly | custom */
  CYCLE_TYPE: {
    MONTHLY: { code: 'MONTHLY', name: 'Hàng tháng' },
    QUARTERLY: { code: 'QUARTERLY', name: 'Hàng quý' },
    YEARLY: { code: 'YEARLY', name: 'Hàng năm' },
    CUSTOM: { code: 'CUSTOM', name: 'Tùy chỉnh' },
  },

  /** Trạng thái chu kỳ: open | collecting | closed | paid_out | cancelled */
  CYCLE_STATUS: {
    OPEN: { code: 'OPEN', name: 'Đang mở' },
    COLLECTING: { code: 'COLLECTING', name: 'Đang thu tiền' },
    CLOSED: { code: 'CLOSED', name: 'Đã đóng' },
    PAID_OUT: { code: 'PAID_OUT', name: 'Đã giải ngân' },
    CANCELLED: { code: 'CANCELLED', name: 'Đã hủy' },
  },

  /** Trạng thái đóng tiền: pending | paid | late | waived | overdue */
  ContributionStatus: {
    PENDING: { code: 'PENDING', name: 'Chưa đóng' },
    PAID: { code: 'PAID', name: 'Đã đóng' },
    LATE: { code: 'LATE', name: 'Đóng trễ' },
    WAIVED: { code: 'WAIVED', name: 'Được miễn' },
    OVERDUE: { code: 'OVERDUE', name: 'Quá hạn' },
  },

  /** Phương thức thanh toán: bank_transfer | cash | qr_code */
  PaymentMethodFund: {
    BANK_TRANSFER: { code: 'BANK_TRANSFER', name: 'Chuyển khoản ngân hàng' },
    CASH: { code: 'CASH', name: 'Tiền mặt' },
    QR_CODE: { code: 'QR_CODE', name: 'Mã QR' },
  },

  /** Trạng thái gửi nhắc nhở: pending | sent | failed */
  NOTIFY_STATUS: {
    PENDING: { code: 'PENDING', name: 'Chờ gửi' },
    SENT: { code: 'SENT', name: 'Đã gửi' },
    FAILED: { code: 'FAILED', name: 'Gửi thất bại' },
  },

  /** Trạng thái đơn đăng ký nhận tiền: pending | reviewing | approved | rejected | paid_out | cancelled */
  RECEIPT_STATUS: {
    PENDING: { code: 'PENDING', name: 'Chờ duyệt' },
    REVIEWING: { code: 'REVIEWING', name: 'Đang xét duyệt' },
    APPROVED: { code: 'APPROVED', name: 'Đã duyệt' },
    REJECTED: { code: 'REJECTED', name: 'Từ chối' },
    PAID_OUT: { code: 'PAID_OUT', name: 'Đã giải ngân' },
    CANCELLED: { code: 'CANCELLED', name: 'Đã hủy' },
  },

  /** Loại tài liệu đính kèm: medical | certificate | invoice | other */
  DOCUMENT_TYPE: {
    MEDICAL: { code: 'MEDICAL', name: 'Giấy tờ y tế' },
    CERTIFICATE: { code: 'CERTIFICATE', name: 'Giấy chứng nhận' },
    INVOICE: { code: 'INVOICE', name: 'Hóa đơn' },
    OTHER: { code: 'OTHER', name: 'Khác' },
  },

  /** Kiểu cấp quyền đặc biệt: Allow | Deny */
  GRANT_TYPE: {
    ALLOW: { code: 'Allow', name: 'Cho phép' },
    DENY: { code: 'Deny', name: 'Từ chối' },
  },

  /** Kênh thông báo: email | sms | push | all */
  NOTIFY_CHANNEL: {
    EMAIL: { code: 'EMAIL', name: 'Email' },
    SMS: { code: 'SMS', name: 'SMS' },
    PUSH: { code: 'PUSH', name: 'Push notification' },
    ALL: { code: 'ALL', name: 'Tất cả kênh' },
  },

  /** Loại giao dịch: contribution | disbursement | fee | adjustment | refund */
  TRANSACTION_TYPE: {
    CONTRIBUTION: { code: 'CONTRIBUTION', name: 'Thu đóng quỹ' },
    DISBURSEMENT: { code: 'DISBURSEMENT', name: 'Giải ngân' },
    FEE: { code: 'FEE', name: 'Phí' },
    ADJUSTMENT: { code: 'ADJUSTMENT', name: 'Điều chỉnh' },
    REFUND: { code: 'REFUND', name: 'Hoàn tiền' },
  },

  /** Chiều giao dịch: in (thu) | out (chi) */
  TRANSACTION_DIRECTION: {
    IN: { code: 'IN', name: 'Thu vào' },
    OUT: { code: 'OUT', name: 'Chi ra' },
  },

  /** Loại file: image | video | audio | pdf | docx | spreadsheet */
  FILE_TYPE: {
    IMAGE: { code: 'IMAGE', name: 'Hình ảnh' },
    VIDEO: { code: 'VIDEO', name: 'Video' },
    AUDIO: { code: 'AUDIO', name: 'Âm thanh' },
    PDF: { code: 'PDF', name: 'PDF' },
    DOCX: { code: 'DOCX', name: 'Word' },
    SPREADSHEET: { code: 'SPREADSHEET', name: 'Bảng tính' },
  },

  /** Loại đối tượng liên quan trong thông báo: FundReceipt | Contribution | FundCycle */
  NOTIFICATION_ENTITY_TYPE: {
    FUND_RECEIPT: { code: 'FUND_RECEIPT', name: 'Đơn đăng ký nhận tiền' },
    CONTRIBUTION: { code: 'CONTRIBUTION', name: 'Phiếu đóng tiền' },
    FUND_CYCLE: { code: 'FUND_CYCLE', name: 'Chu kỳ quỹ' },
  },

  /** Mã vai trò hệ thống: ADMIN | EMPLOYEE | MEMBER */
  ROLE_CODE: {
    ADMIN: { code: 'ADMIN', name: 'Quản trị' },
    EMPLOYEE: { code: 'EMPLOYEE', name: 'Nhân viên' },
    MEMBER: { code: 'MEMBER', name: 'Thành viên' },
  },

  /** Module hệ thống */
  SYSTEM_MODULE: {
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
