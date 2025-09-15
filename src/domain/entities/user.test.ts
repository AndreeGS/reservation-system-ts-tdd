import { User } from "./user"

describe('User Entity', () => {
    it ("deve criar uma instância de User com Id e Nome", () => {
        const user = new User("1", "André Guilherme");

        expect(user.getId()).toBe("1");
        expect(user.getName()).toBe("André Guilherme")
    });

    it ("deve lançar um erro se o nome for vazio", () => {
        expect(() => new User("1", "")).toThrow("O nome é obrigatório");
    });

    it ("deve lançar um erro se o id for vazio", () => {
        expect(() => new User("", "André Guilherme")).toThrow("O id é obrigatório");
    }); 
});