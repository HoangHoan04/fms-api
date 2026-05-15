import dayjs from 'dayjs';
import * as QRCode from 'qrcode';

class CoreHelper {
  findDuplicates(arr: any[], key: string): string[] {
    const seen: { [key: string]: boolean } = {};
    const duplicates: string[] = [];
    let array: any[] = [];
    array = arr;
    for (const prop of array) {
      if (seen[prop[key]]) {
        if (!duplicates.includes(prop[key])) {
          duplicates.push(prop[key]);
        }
      } else {
        seen[prop[key]] = true;
      }
    }
    return duplicates;
  }

  public convertObjToArray(obj: any) {
    const arr: any[] = [];
    for (const key in obj) {
      const value = obj[key];
      arr.push(value);
    }
    return arr;
  }

  public newDateTZ() {
    const d = new Date();
    const offset = 7;
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    const nd = new Date(utc + 3600000 * offset);
    return nd;
  }

  getEnumMultiLevelToArray(enumData: object) {
    const enumObj = {};
    for (const key in enumData) {
      if (Object.prototype.hasOwnProperty.call(enumData, key)) {
        const element = enumData[key];
        const children = element.children;

        for (const enumItem of children) {
          const objectKey = enumItem.code;
          const objectValue = enumItem;
          enumObj[objectKey] = objectValue;
        }
      }
    }

    return enumObj;
  }

  convertResModulePermissionToArray(listPermissionJSONRes: any) {
    const result = listPermissionJSONRes.map((item) => item[0]);
    return result;
  }

  selectDistinct(arr: any[], field: string) {
    if (!arr?.length) return [];
    const set = new Set<string>();
    for (const item of arr) if (item[field]) set.add(item[field]);
    return [...set];
  }

  getFirstDay(date: Date): Date {
    return dayjs(date).startOf('day').toDate();
  }

  getLastDay(date: Date): Date {
    return dayjs(date).endOf('day').toDate();
  }

  getLastDayOfMonth(date: Date) {
    return dayjs(date).endOf('month').toDate();
  }

  getFirstDayOfMonth(date: Date) {
    return dayjs(date).startOf('month').toDate();
  }

  toDict(arr: any[], key = 'id') {
    const dict = {};
    for (const item of arr) {
      dict[item[key]] = item;
    }
    return dict;
  }

  toDictArray(arr: any[], key = 'id') {
    const dict = {};
    for (const item of arr) {
      if (!dict[item[key]]) {
        dict[item[key]] = [];
      }
      dict[item[key]].push(item);
    }
    return dict;
  }

  groupBy<T>(items: T[], keyGetter: (item: T) => string): Record<string, T> {
    return items.reduce(
      (acc, item) => {
        const key = keyGetter(item);
        acc[key] = item;
        return acc;
      },
      {} as Record<string, T>,
    );
  }

  async genQRCodeBase64(data: any): Promise<string> {
    try {
      const base64 = await QRCode.toDataURL(JSON.stringify(data), {
        errorCorrectionLevel: 'L',
        type: 'image/png',
        margin: 2,
        scale: 2,
        width: 150,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      return base64;
    } catch (err) {
      console.error('QR Code generation error:', err);
      throw new Error('QR Code generation failed');
    }
  }

  filterUndefinedOrNull(obj: any): any {
    if (obj === null || obj === undefined) {
      return undefined;
    }

    if (Array.isArray(obj)) {
      return obj
        .map((item) => this.filterUndefinedOrNull(item))
        .filter((item) => item !== undefined);
    }

    if (typeof obj !== 'object' || obj instanceof Date) {
      return obj;
    }

    const filteredObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = this.filterUndefinedOrNull(obj[key]);
        if (value !== undefined) {
          filteredObj[key] = value;
        }
      }
    }

    return filteredObj;
  }

  formatDateToPassword(date: Date | string): string {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}${month}${year}`;
  }

  formatNumber(number: number): string {
    return number < 10 ? `0${number}` : `${number}`;
  }

  formatDateTime = (
    dateInput: string | Date,
    format: string = 'HH:mm DD/MM/YYYY',
  ): string => {
    let dateObj: dayjs.Dayjs;
    if (typeof dateInput === 'string') {
      dateObj = dayjs(dateInput);
    } else {
      dateObj = dayjs(dateInput);
    }
    return dateObj.format(format);
  };

  formatDate = (
    dateInput: string | Date | null | undefined,
    format: string = 'DD/MM/YYYY',
  ): string => {
    if (!dateInput) return '---';

    const dateObj = dayjs(dateInput);
    if (!dateObj.isValid()) return 'Ngày không hợp lệ';

    return dateObj.format(format);
  };

  normalizePhoneNumber(phone: string): string {
    // Nếu bắt đầu bằng +84 thì thay bằng 0
    if (phone.startsWith('+84')) {
      return '0' + phone.slice(3);
    }
    // Nếu bắt đầu bằng 84 thì thay bằng 0
    if (phone.startsWith('84') && phone.length > 2) {
      return '0' + phone.slice(2);
    }
    // Nếu đã có 0 ở đầu thì giữ nguyên
    if (phone.startsWith('0')) {
      return phone;
    }
    // Mặc định thêm 0 vào đầu
    return '0' + phone;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }
}

export const coreHelper = new CoreHelper();
