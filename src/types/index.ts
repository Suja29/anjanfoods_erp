export type UserRole =
  | 'admin'
  | 'salesman'
  | 'production_supervisor'
  | 'owner'
  | 'accountant';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  loading: boolean;
}
