import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user_repository";
import { CreateUserDTO } from "../dtos/create_user_dto";

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async findUserById(id: string): Promise<User | null> {
        return this.userRepository.findById(id);
    }

    async createUser(userDto: CreateUserDTO): Promise<User> {
        const user = new User(userDto.userId, userDto.name);

        await this.userRepository.save(user);

        return user;
    }
}