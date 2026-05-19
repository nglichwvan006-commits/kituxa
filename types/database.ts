import type { AttendanceStatus, DutyStatus, NotificationType, UserRole } from "./domain";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type RowWithTimestamps = {
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      rooms: {
        Row: RowWithTimestamps & {
          id: string;
          name: string;
          code: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["rooms"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: RowWithTimestamps & {
          id: string;
          full_name: string;
          email: string;
          role: UserRole;
          phone: string | null;
          is_active: boolean;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          role?: UserRole;
          phone?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      room_members: {
        Row: RowWithTimestamps & {
          id: string;
          room_id: string;
          user_id: string;
          role: UserRole;
          is_active: boolean;
          joined_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id: string;
          role?: UserRole;
          is_active?: boolean;
          joined_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["room_members"]["Insert"]>;
        Relationships: [];
      };
      duty_schedules: {
        Row: RowWithTimestamps & {
          id: string;
          room_id: string;
          day_of_week: number;
          title: string;
          note: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          room_id: string;
          day_of_week: number;
          title: string;
          note?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["duty_schedules"]["Insert"]>;
        Relationships: [];
      };
      duty_schedule_members: {
        Row: {
          id: string;
          schedule_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          schedule_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["duty_schedule_members"]["Insert"]>;
        Relationships: [];
      };
      duty_tasks: {
        Row: RowWithTimestamps & {
          id: string;
          room_id: string;
          schedule_id: string | null;
          duty_date: string;
          title: string;
          note: string | null;
          status: DutyStatus;
        };
        Insert: {
          id?: string;
          room_id: string;
          schedule_id?: string | null;
          duty_date: string;
          title: string;
          note?: string | null;
          status?: DutyStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["duty_tasks"]["Insert"]>;
        Relationships: [];
      };
      duty_task_members: {
        Row: RowWithTimestamps & {
          id: string;
          task_id: string;
          user_id: string;
          status: DutyStatus;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          task_id: string;
          user_id: string;
          status?: DutyStatus;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["duty_task_members"]["Insert"]>;
        Relationships: [];
      };
      duty_proofs: {
        Row: {
          id: string;
          room_id: string;
          duty_task_id: string;
          user_id: string;
          storage_path: string;
          public_url: string;
          mime_type: string;
          file_size: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          duty_task_id: string;
          user_id: string;
          storage_path: string;
          public_url: string;
          mime_type: string;
          file_size: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["duty_proofs"]["Insert"]>;
        Relationships: [];
      };
      attendance: {
        Row: RowWithTimestamps & {
          id: string;
          room_id: string;
          user_id: string;
          attendance_date: string;
          status: AttendanceStatus;
          absent_address: string | null;
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id: string;
          attendance_date: string;
          status: AttendanceStatus;
          absent_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["attendance"]["Insert"]>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          room_id: string;
          user_id: string | null;
          actor_id: string | null;
          type: NotificationType;
          title: string;
          message: string;
          href: string | null;
          metadata: Json;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id?: string | null;
          actor_id?: string | null;
          type: NotificationType;
          title: string;
          message: string;
          href?: string | null;
          metadata?: Json;
          read_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: UserRole;
      attendance_status: AttendanceStatus;
      duty_status: DutyStatus;
      notification_type: NotificationType;
    };
  };
};
