import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/property_repository";

export class PropertyService {
    constructor(private propertyRepository: PropertyRepository) {}

    async findPropertyById(id: string): Promise<Property | null> {
        return this.propertyRepository.findById(id);
    }

    
}