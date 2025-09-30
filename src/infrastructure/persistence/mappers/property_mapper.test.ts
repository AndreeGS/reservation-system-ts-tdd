import { PropertyMapper } from "./property_mapper";
import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";

describe("PropertyMapper", () => {
  it("deve converter PropertyEntity em Property corretamente", () => {
    const entity = new PropertyEntity();
    entity.id = "1";
    entity.name = "Casa de Praia";
    entity.description = "Linda casa na praia";
    entity.maxGuests = 8;
    entity.basePricePerNight = 500;

    const property = PropertyMapper.toDomain(entity);
    expect(property).toBeInstanceOf(Property);
    expect(property.getId()).toBe(entity.id);
    expect(property.getName()).toBe(entity.name);
    expect(property.getDescription()).toBe(entity.description);
    expect(property.getMaxGuest()).toBe(entity.maxGuests);
    expect(property.getBasePricePerNight()).toBe(entity.basePricePerNight);
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity", () => {
    const entity = new PropertyEntity();

    expect(() => PropertyMapper.toDomain(entity)).toThrow();
  });

  it("deve converter Property para PropertyEntity corretamente", () => {
    const property = new Property(
      "2",
      "Apartamento Central",
      "Apartamento no centro da cidade",
      4,
      300
    );

    const entity = PropertyMapper.toPersistence(property);
    expect(entity).toBeInstanceOf(PropertyEntity);
    expect(entity.id).toBe(property.getId());
    expect(entity.name).toBe(property.getName());
    expect(entity.description).toBe(property.getDescription());
    expect(entity.maxGuests).toBe(property.getMaxGuest());
    expect(entity.basePricePerNight).toBe(property.getBasePricePerNight());
  });
});
