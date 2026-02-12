import { Role } from '../entities/user.entity';

export interface CurrentUserData {
  id: number;
  email: string;
  role: Role;
}
