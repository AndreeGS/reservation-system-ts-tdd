import request from "supertest";
import express from "express";

import { DataSource } from "typeorm";
import { UserController } from "./user_controller";

import { UserService } from "../../application/services/user_service";

import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";
import { UserEntity } from "../persistence/entities/user_entity";


const app = express();
app.use(express.json());

let dataSource: DataSource;
let userRepository: TypeORMUserRepository
let userController: UserController;
let userService: UserService;

beforeAll(async () => {
    dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        synchronize: true,
        entities: [UserEntity],
    });

    await dataSource.initialize();

    userRepository = new TypeORMUserRepository(dataSource.getRepository(UserEntity));
    userService = new UserService(userRepository);
    userController = new UserController(userService);

    app.post("/users", (req, res, next) => {
        userController.createUser(req, res).catch((err) => next(err));
    });
});

afterAll(async () => {
    await dataSource.destroy();
});

describe("UserController End-to-End Tests", () => {
    test("deve criar um usuário com sucesso", async () => {
        const res = await request(app)
            .post("/users")
            .send({ userId: 1, name: "Fulano" })
        ;

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Usuário criado com sucesso");
        expect(res.body.user).toHaveProperty("id");
        expect(res.body.user).toHaveProperty("name", "Fulano");
    });

    test("deve retornar erro com código 400 e mensagem 'O campo nome é obrigatório.' ao enviar um nome vazio", async () => {
        const res = await request(app)
            .post("/users")
            .send({ userId: 2, name: "" })
        ;

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message", "O campo nome é obrigatório.");
    });
});
