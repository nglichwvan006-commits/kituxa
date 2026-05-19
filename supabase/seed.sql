-- Tạo user mẫu trong Supabase Auth trước, rồi thay các UUID dưới đây bằng id thật.
-- Sau đó chạy seed này để tạo phòng, profile, thành viên và lịch trực mẫu.

insert into public.rooms (id, name, code)
values ('11111111-1111-1111-1111-111111111111', 'Phòng A101', 'A101')
on conflict (id) do nothing;

-- Ví dụ:
-- insert into public.profiles (id, full_name, email, role)
-- values
--   ('uuid-admin', 'Nguyễn Quản Trị', 'admin@example.com', 'admin'),
--   ('uuid-leader', 'Trần Trưởng Phòng', 'leader@example.com', 'room_leader'),
--   ('uuid-member', 'Lê Thành Viên', 'member@example.com', 'member');
--
-- insert into public.room_members (room_id, user_id, role)
-- values
--   ('11111111-1111-1111-1111-111111111111', 'uuid-admin', 'admin'),
--   ('11111111-1111-1111-1111-111111111111', 'uuid-leader', 'room_leader'),
--   ('11111111-1111-1111-1111-111111111111', 'uuid-member', 'member');
