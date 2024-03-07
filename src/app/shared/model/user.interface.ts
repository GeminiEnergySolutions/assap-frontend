export interface User {
  id: number;
  userName: string;
  email: string;
  roleId: number;
  role: { roleId: number; role: string; };
  expirationDate: string | null;
}
