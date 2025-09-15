import { PropertyService } from "./property_service";
import { FakePropertyRepository } from "../../infrastructure/repositories/fake_property_repository";
import { Property } from "../../domain/entities/property";

describe("PropertyService", () => {
    let propertyService: PropertyService;
    let fakePropertyRepository: FakePropertyRepository;

    beforeEach(() => {
        fakePropertyRepository = new FakePropertyRepository();
        propertyService = new PropertyService(fakePropertyRepository);
    });

    it("dever retornar null quando um ID inválido for passado", async () => {
        const property = await propertyService.findPropertyById("2354");
        expect(property).toBeNull();
    });

    it("dever retornar uma propriedade quando um ID válido for passado", async () => {
        const property = await propertyService.findPropertyById("1");

        expect(property).not.toBeNull();
        expect(property?.getId()).toBe("1");
        expect(property?.getName()).toBe("123 Main St");
    });

    it("deve salvar uma nova propriedade com sucesso usando repositorio fake e buscando novamente", async () => {
        const newPropertyData = new Property("3", "789 Pine St", "Cozy cottage in the woods", 3, 150);
        await fakePropertyRepository.save(newPropertyData);

        const property = await propertyService.findPropertyById("3");
        
        expect(property).not.toBeNull();
        expect(property?.getId()).toBe("3");
        expect(property?.getName()).toBe("789 Pine St");
    });
});