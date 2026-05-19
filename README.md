# QLKTX

Website quản lý phòng ký túc xá dùng Next.js App Router, TypeScript, Tailwind CSS và Supabase cho database, auth, storage, realtime.

## Biến môi trường

Tạo `.env.local` theo `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CRON_SECRET=
```

`SUPABASE_SERVICE_ROLE_KEY` chỉ dùng server-side. Không import key này trong client component.

## Setup Supabase

1. Tạo project Supabase.
2. Chạy SQL trong `supabase/migrations/001_initial_schema.sql`.
3. Bật Realtime cho bảng `notifications`.
4. Bucket `duty-proofs` được migration tạo sẵn ở chế độ private, giới hạn 5MB và chỉ nhận JPG/PNG/WEBP. Ứng dụng tạo signed URL khi người cùng phòng xem minh chứng.
5. Tạo tài khoản admin đầu tiên trong Supabase Auth.
6. Thêm profile, room và room_members cho admin bằng SQL hoặc dùng `supabase/seed.sql` sau khi thay UUID thật.

Ví dụ tạo admin đầu tiên:

```sql
insert into public.rooms (name, code) values ('Phòng A101', 'A101') returning id;

insert into public.profiles (id, full_name, email, role)
values ('AUTH_USER_ID', 'Nguyễn Quản Trị', 'admin@example.com', 'admin');

insert into public.room_members (room_id, user_id, role)
values ('ROOM_ID', 'AUTH_USER_ID', 'admin');
```

## Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Deploy Vercel

1. Import repo lên Vercel.
2. Cấu hình 4 biến môi trường ở Production.
3. Deploy.
4. `vercel.json` đã khai báo cron gọi `/api/cleanup-proofs` lúc 18:00 UTC mỗi ngày, tương ứng 01:00 tại Việt Nam.
5. Vercel Cron sẽ tự gửi header sau nếu bạn cấu hình biến môi trường `CRON_SECRET` trong project:

```txt
Authorization: Bearer <CRON_SECRET>
```


## Luồng test chính

1. Admin đăng nhập, vào `Quản lý thành viên`, tạo tài khoản thành viên với mật khẩu tạm.
2. Admin vào `Lịch trực`, tạo lịch cố định theo thứ và chọn nhiều thành viên.
3. Thành viên đăng nhập, thấy ca trực hôm nay nếu đúng thứ.
4. Thành viên điểm danh. Nếu chọn `Vắng`, hệ thống bắt buộc nhập địa chỉ vắng.
5. Thành viên upload nhiều ảnh minh chứng rồi bấm hoàn thành.
6. Trưởng phòng/admin thấy trạng thái hoàn thành và nhận popup realtime từ bảng `notifications`.
7. Mọi người trong phòng xem ảnh tại `Nhật ký trực nhật`.
8. Gọi thử cleanup:

```bash
curl -H "Authorization: Bearer <CRON_SECRET>" https://your-domain.vercel.app/api/cleanup-proofs
```

Endpoint sẽ xóa ảnh trong Storage và metadata trong database khi `created_at` quá 7 ngày.

## Ghi chú hiệu năng và bảo mật

- Query có phân trang cho minh chứng, không tải toàn bộ ảnh.
- Realtime chỉ subscribe theo `room_id`.
- Các truy vấn dài có index theo `room_id`, `user_id`, `date`, `created_at`.
- RLS đảm bảo user chỉ xem dữ liệu thuộc phòng mình.
- Member chỉ được xóa minh chứng của chính mình, trong vòng 24 giờ.
- Cleanup chạy bằng service role và được bảo vệ bằng `CRON_SECRET`.
