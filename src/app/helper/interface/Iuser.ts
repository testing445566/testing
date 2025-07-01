export interface IUser {
  createdAt: string;
  department: string;
  email: string;
  id: string;
  name: string;
  phone: string;
  position: string;
  role: string;
  isActive: boolean;
  password:string;
  master?:boolean;
}
