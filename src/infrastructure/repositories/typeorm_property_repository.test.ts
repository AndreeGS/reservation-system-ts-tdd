import { DataSource, Repository } from "typeorm";
import { Property } from "../../domain/entities/property";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { TypeORMPropertyRepository } from "./typeorm_property_repository";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { UserEntity } from "../persistence/entities/user_entity";

describe('TypeORMPropertyRepository', () => {
    
    let dataSource: DataSource;
    let propertyRepository: TypeORMPropertyRepository;
    let repository: Repository<PropertyEntity>;

    beforeAll(async () => {
       dataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: [PropertyEntity, BookingEntity, UserEntity],
            synchronize: true,
            logging: false,
       });
        
       await dataSource.initialize();
        repository = dataSource.getRepository(PropertyEntity);
        propertyRepository = new TypeORMPropertyRepository(repository);
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    it("deve salvar uma propriedade com sucesso", async () => {
        const property = new Property("1", "Casa de Praia", "Uma linda casa de praia", 6, 200);

        await propertyRepository.save(property);

        const savedProperty = await repository.findOne({ where: { id: "1" } });

        expect(savedProperty).not.toBeNull();
        expect(savedProperty?.id).toBe("1");
    });

    it("deve retornar uma propriedade com ID válido", async () => {
        const property = new Property("1", "Casa de Praia", "Uma linda casa de praia", 6, 200);

        await propertyRepository.save(property);

        const savedProperty = await propertyRepository.findById("1");

        expect(savedProperty).not.toBeNull();
        expect(savedProperty?.getId()).toBe("1");
        expect(savedProperty?.getName()).toBe("Casa de Praia");
    });

    it("deve retornar null ao buscar uma propriedade inexistente", async () => {
        const savedProperty = await propertyRepository.findById("20");

        expect(savedProperty).toBeNull();
    });
});