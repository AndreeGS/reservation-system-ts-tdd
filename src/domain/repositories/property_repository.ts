import { Property } from "../entities/property";

export interface PropertyRepository {
    findById(id: string): Promise<Property | null>;
    save(property: Property): Promise<void>;
}