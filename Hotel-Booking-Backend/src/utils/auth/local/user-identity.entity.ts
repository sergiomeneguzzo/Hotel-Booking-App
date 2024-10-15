import { User } from "../../../api/user/user.entity";

export interface UserIdentityModel {
    id: string;
    provider: 'local';
    credentials: {
        username: string;
        hashedPassword: string;
    };
    user: User
}