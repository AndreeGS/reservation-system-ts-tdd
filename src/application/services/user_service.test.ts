import { UserService } from "./user_service";
import { User } from "../../domain/entities/user";
import { FakeUserRepository } from "../../infrastructure/repositories/fake_user_repository";

describe("UserService", () => {
    let userService: UserService;
    let fakeUserRepository: FakeUserRepository;

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        userService = new UserService(fakeUserRepository);
    });

    it("dever retornar null quando um ID inválido for passado", async () => {
        const user = await userService.findUserById("23254");
        expect(user).toBeNull();
    });

    it("dever retornar um usuário quando um ID válido for passado", async () => {
        const user = await userService.findUserById("12");

        expect(user).toBeInstanceOf(User);
        expect(user?.getId()).toBe("12");
        expect(user?.getName()).toBe("John Doe");
        expect(user).not.toBeNull();
    });

    it("dever salvar um novo usuário com sucesso usando um repositorio fake e buscando novamente", async () => {
        const newUser = new User("1", "teste");
        await fakeUserRepository.save(newUser);

        const user = await userService.findUserById("1");

        expect(user?.getId()).toBe("1");
        expect(user?.getName()).toBe("teste");
        expect(user).not.toBeNull();
    });
});
