export interface User {
  id: number;
  userName: string;
  email: string;
  roleId: number;
  expirationDate: string | null;
}

export interface UserWithRoleName extends User {
  role: string;
}

export interface UserWithRoleObject extends User {
  role: { roleId: number; role: string; };
}
