# Hướng dẫn thiết lập Cloudflare R2 & Cloudinary

## Kiến trúc Upload

```
                           File Upload Request
                                  │
                                  ▼
                     ┌─────────────────────────┐
                     │   UploadFileService      │
                     │   detectFileCategory()   │
                     └─────────┬───────────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
         ┌──────────┐  ┌──────────┐  ┌──────────────┐
         │  Ảnh     │  │  Audio   │  │  Document    │
         │          │  │          │  │  + other     │
         │Cloudinary│  │  R2 ✅   │  │  R2 ✅       │
         │ ✅       │  │  free    │  │  free        │
         │ transform│  │  egress  │  │  egress      │
         └──────────┘  └──────────┘  └──────────────┘
```

- **Cloudinary**: Xử lý ảnh (JPEG, PNG, GIF, WebP, SVG, AVIF)
  - Lý do: Cloudinary có transform ảnh mạnh (resize, crop, optimization, CDN)
- **Cloudflare R2**: Xử lý audio + document + các file khác
  - Lý do: R2 không tính phí bandwidth egress, phù hợp file dung lượng lớn

---

## 1. Tạo Cloudflare R2 Bucket

### Bước 1: Đăng nhập Cloudflare Dashboard

- Truy cập https://dash.cloudflare.com/
- Chọn tài khoản của bạn

### Bước 2: Vào R2

- Click **R2** ở sidebar trái
- Nếu chưa kích hoạt, bạn cần thêm phương thức thanh toán

### Bước 3: Tạo Bucket

- Click **Create bucket**
- **Bucket name**: `fms` (hoặc tên bạn muốn)
- **Location**: Automatic
- Click **Create bucket**

### Bước 4: Tạo API Token

- Vào **R2** → **Manage R2 API Tokens**
- Click **Create API Token**
- **Permissions**: **Admin Read & Write**
- **TTL**: Chọn **Never** (hoặc thời gian phù hợp)
- Click **Create API Token**
- **Lưu lại** `Access Key ID` và `Secret Access Key` (chỉ hiện 1 lần)

### Bước 5: Lấy thông số

- **R2 Endpoint**: Vào bucket → **Properties** → **Bucket endpoint**
  - Dạng: `https://<accountid>.r2.cloudflarestorage.com`
- **R2 Public URL** (nếu muốn public):
  - Vào bucket → **Settings** → **Public Access**
  - Bật **Public access** và copy URL
  - Dạng: `https://pub-<hash>.r2.dev`

---

## 2. Cập nhật file `.env`

Thêm các biến môi trường sau vào file `.env`:

```env
# === Cloudinary (giữ nguyên, đã có) ===
CLOUDINARY_CLOUD_NAME=djyrtlm4t
CLOUDINARY_API_KEY=917163712376698
CLOUDINARY_API_SECRET=l5R4x4BXKX4aWoHGI4UNpJjmeEA

# === Cloudflare R2 (thêm mới) ===
R2_ENDPOINT=https://<your-account-id>.r2.cloudflarestorage.com
R2_BUCKET=fms
R2_ACCESS_KEY_ID=<your-access-key-id>
R2_SECRET_ACCESS_KEY=<your-secret-access-key>
R2_PUBLIC_URL=https://pub-<your-hash>.r2.dev
```

---

## 3. Danh sách API endpoints

### Upload tự động phân loại

| Method | Endpoint                            | Mô tả                         | Storage               |
| ------ | ----------------------------------- | ----------------------------- | --------------------- |
| POST   | `/upload/upload-file/upload-single` | Upload 1 file, tự detect loại | Cloudinary/R2 tự động |
| POST   | `/upload/upload-file/upload-multi`  | Upload nhiều file             | Cloudinary/R2 tự động |

### Upload ép loại

| Method | Endpoint                              | Mô tả              | Storage    |
| ------ | ------------------------------------- | ------------------ | ---------- |
| POST   | `/upload/upload-file/upload-image`    | Ép upload ảnh      | Cloudinary |
| POST   | `/upload/upload-file/upload-audio`    | Ép upload audio    | R2         |
| POST   | `/upload/upload-file/upload-document` | Ép upload document | R2         |

**Lưu ý**: Tất cả endpoints đều yêu cầu **JWT Bearer Token** (JwtAuthGuard).

---

## 4. Cấu trúc response

```json
// Cloudinary (ảnh)
{
  "fileName": "2025513-abc123.jpg",
  "fileUrl": "https://res.cloudinary.com/.../fms-images/2025513-abc123.jpg",
  "storage": "cloudinary"
}

// R2 (audio/document)
{
  "fileName": "2025513-def456.mp3",
  "fileUrl": "https://pub-xxx.r2.dev/audio/2025513-def456.mp3",
  "storage": "r2"
}
```

---

## 5. Phân loại file (MIME types)

| Loại     | MIME types                                                                                             | Storage       |
| -------- | ------------------------------------------------------------------------------------------------------ | ------------- |
| Ảnh      | `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml`, `image/avif`                    | Cloudinary    |
| Audio    | `audio/mpeg`, `audio/mp3`, `audio/wav`, `audio/ogg`, `audio/webm`, `audio/x-m4a`, `audio/aac`          | R2            |
| Document | `application/pdf`, `application/msword`, `application/vnd.openxmlformats...`, `text/plain`, `text/csv` | R2            |
| Other    | Các loại còn lại                                                                                       | R2 (mặc định) |

---

## 6. Kiểm tra hoạt động

### Upload ảnh (sẽ vào Cloudinary)

```bash
curl -X POST http://localhost:3000/upload/upload-file/upload-single \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/image.jpg"
```

### Upload audio (sẽ vào R2)

```bash
curl -X POST http://localhost:3000/upload/upload-file/upload-audio \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/audio.mp3"
```

---

## 7. Xử lý sự cố

### Lỗi "Upload R2 thất bại"

- Kiểm tra `R2_ACCESS_KEY_ID` và `R2_SECRET_ACCESS_KEY` trong `.env`
- Kiểm tra `R2_ENDPOINT` có đúng định dạng (`https://<accountid>.r2.cloudflarestorage.com`)
- Đảm bảo bucket đã được tạo và API token có quyền Admin Read & Write

### Lỗi "Upload Cloudinary thất bại"

- Kiểm tra `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Kiểm tra Cloudinary console để đảm bảo tài khoản còn hoạt động

### File không đúng loại

- Kiểm tra `Content-Type` (MIME type) của file gửi lên
- Nếu gửi từ frontend, đảm bảo `multipart/form-data` có đúng `Content-Type` cho từng file
