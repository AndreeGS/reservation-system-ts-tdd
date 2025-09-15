import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/property_repository";

export class FakePropertyRepository implements PropertyRepository {
    private properties: Property[] = [
        new Property("1", "123 Main St", "Aoartanebti niderbi", 4, 100),
        new Property("2", "456 Oak St", "Apt in the city center", 6, 200)
    ];

    async findById(id: string): Promise<Property | null> {
        return this.properties.find(property => property.getId() === id) ?? null;
    }

    async save(property: Property): Promise<void> {
        this.properties.push(property);
    }
}