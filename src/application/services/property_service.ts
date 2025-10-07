import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/property_repository";

export class PropertyService {
    constructor(private propertyRepository: PropertyRepository) {}

    async findPropertyById(id: string): Promise<Property | null> {
        return this.propertyRepository.findById(id);
    }

    async createProperty(data: {
        id: string;
        name: string;
        description: string;
        maxGuests: number;
        basePricePerNight: number;
    }): Promise<Property> {
        try {
            const property = new Property(
                data.id,
                data.name,
                data.description,
                data.maxGuests,
                data.basePricePerNight
            );
            await this.propertyRepository.save(property);
            return property;
        } catch (err: any) {
            throw err;
        }
    }
}