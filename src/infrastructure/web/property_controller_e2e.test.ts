import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { PropertyController } from "./property_controller";
import { PropertyService } from "../../application/services/property_service";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { UserEntity } from "../persistence/entities/user_entity";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let propertyRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyController;

beforeAll(async () => {
    dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        synchronize: true,
        entities: [PropertyEntity, BookingEntity, UserEntity]
    });
    await dataSource.initialize();
    propertyRepository = new TypeORMPropertyRepository(dataSource.getRepository(PropertyEntity));
    propertyService = new PropertyService(propertyRepository);
    propertyController = new PropertyController(propertyService);

    app.post("/properties", (req, res, next) => {
        propertyController.createProperty(req, res).catch((err) => next(err));
    });
    app.get("/properties/:id", (req, res, next) => {
        propertyController.getPropertyById(req, res).catch((err) => next(err));
    });
});

afterAll(async () => {
    await dataSource.destroy();
});

describe("PropertyController End-to-End Tests", () => {
    beforeAll(async () => {
        const propertyRepo = dataSource.getRepository(PropertyEntity);
        await propertyRepo.clear();
        await propertyRepo.save({
            id: "1",
            name: "Propriedade de teste",
            description: "Descrição da propriedade de teste",
            maxGuests: 5,
            basePricePerNight: 100,
        });
    });

    it("deve criar uma propriedade com sucesso", async () => {
        const response = await request(app).post("/properties").send({
            id: "2",
            name: "Casa Nova",
            description: "Casa recém construída",
            maxGuests: 4,
            basePricePerNight: 200,
        });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Propriedade criada com sucesso");
        expect(response.body.property).toHaveProperty("id", "2");
        expect(response.body.property).toHaveProperty("name", "Casa Nova");
    });

    it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
        const response = await request(app).post("/properties").send({
            id: "3",
            name: "",
            description: "Sem nome",
            maxGuests: 2,
            basePricePerNight: 80,
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("O nome da propriedade é obrigatório.");
    });

    it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {
        const response = await request(app).post("/properties").send({
            id: "4",
            name: "Casa Teste",
            description: "Teste capacidade",
            maxGuests: 0,
            basePricePerNight: 100,
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("A capacidade máxima deve ser maior que zero.");

        const responseNeg = await request(app).post("/properties").send({
            id: "5",
            name: "Casa Teste",
            description: "Teste capacidade",
            maxGuests: -1,
            basePricePerNight: 100,
        });
        expect(responseNeg.status).toBe(400);
        expect(responseNeg.body.message).toBe("A capacidade máxima deve ser maior que zero.");
    });

    it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
        const response = await request(app).post("/properties").send({
            id: "6",
            name: "Casa Teste",
            description: "Teste preço",
            maxGuests: 2
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("O preço base por noite é obrigatório.");
    });

    it("deve buscar uma propriedade existente por ID", async () => {
        const response = await request(app).get("/properties/1");
        expect(response.status).toBe(200);
        expect(response.body.property).toHaveProperty("id", "1");
        expect(response.body.property).toHaveProperty("name", "Propriedade de teste");
    });

    it("deve retornar 404 ao buscar propriedade inexistente", async () => {
        const response = await request(app).get("/properties/999");
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Propriedade não encontrada");
    });
});
