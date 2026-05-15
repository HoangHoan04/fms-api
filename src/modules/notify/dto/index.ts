export interface NotifyCreate {
  lstMemberId?: string[];
  lstEmployeeId?: string[];
  lstUserId?: string[];
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  callbackUrl?: string;
  category: string;
  colorType?: string;
}

export interface NotifyCreateAdmin {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  callbackUrl?: string;
  category: string;
  colorType?: string;
  notifyPermissionType: string;
}
