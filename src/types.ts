export type Role = 'SA' | 'QLVT' | 'NHAN_VIEN';

export interface User {
  Email: string;
  HoTen: string;
  Role: Role;
}

export interface Permission {
  Role: Role;
  Trang: string;
  Quyen: string;
}

export interface Project {
  MaDuAn: string;
  TenDuAn: string;
  BQLXD: string;
  TrangThai: string;
}

export interface Material {
  MaVatTu: string;
  TenVatTu: string;
  NhomVatTu: string;
  DonVi: string;
  TG_ThongDung: string;
  TG_NhapKhau: string;
}

export interface Order {
  ID: string;
  DuAn: string;
  TenVatTu: string;
  MaVatTu: string;
  NhomVatTu: string;
  DonVi: string;
  SoLuong: number;
  NCC: string;
  NgayGuiPYC: string;
  NgayKyHD: string;
  NgayCanHang: string;
  ThoiGianChuan: string;
  NgayGiaoDuKien: string;
  NgayGiaoThucTe?: string;
  TrangThai: 'Hoan thanh' | 'Dang giao' | 'Cham' | 'Chuan bi';
  Moc_T: string;
  Moc_T2: string;
  Moc_T7: string;
  Moc_T9: string;
  Moc_T10: string;
  Moc_T14: string;
  RuiRo: 'Xanh' | 'Vang' | 'Do';
  GhiChu: string;
  IsKhanCap: boolean;
}

export interface OptimizationIssue {
  ID: string;
  DuAn: string;
  LoaiVuViec: string;
  PhuongAn: 'PA1' | 'PA2';
  TrangThai: string;
  Deadline: string;
  NguoiPhuTrach: string;
  GhiChu: string;
}

export interface DashboardData {
  kpis: {
    totalOrders: number;
    delayedOrders: number;
    ongoingIssues: number;
    urgentOrders: number;
  };
  topRisks: Order[];
  latestIssues: OptimizationIssue[];
}
