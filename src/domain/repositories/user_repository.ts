import { User } from "../entities/user";

export interface UserRepository {
    save(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
}
