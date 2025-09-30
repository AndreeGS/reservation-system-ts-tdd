import { BookingMapper } from "./booking_mapper";
import { Booking } from "../../../domain/entities/booking";
import { BookingEntity } from "../entities/booking_entity";
import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { User } from "../../../domain/entities/user";
import { DateRange } from "../../../domain/value_objects/date_range";

describe("BookingMapper", () => {
  function makePropertyEntity() {
    const entity = new PropertyEntity();
    entity.id = "prop-1";
    entity.name = "Casa de Praia";
    entity.description = "Linda casa na praia";
    entity.maxGuests = 8;
    entity.basePricePerNight = 500;
    return entity;
  }

  function makeUserEntity() {
    return { id: "user-1", name: "João", email: "joao@email.com" };
  }

  it("deve converter BookingEntity em Booking corretamente", () => {
    const entity = new BookingEntity();
    entity.id = "1";
    entity.property = makePropertyEntity();
    entity.guest = makeUserEntity();
    entity.startDate = new Date("2025-10-01");
    entity.endDate = new Date("2025-10-05");
    entity.guestCount = 2;
    entity.totalPrice = 2000;
    entity.status = "CONFIRMED";

    const booking = BookingMapper.toDomain(entity);

    expect(booking).toBeInstanceOf(Booking);
    expect(booking.getId()).toBe(entity.id);
    expect(booking.getProperty().getId()).toBe(entity.property.id);
    expect(booking.getGuest().getId()).toBe(entity.guest.id);
    expect(booking.getDateRange().getStartDate()).toEqual(entity.startDate);
    expect(booking.getDateRange().getEndDate()).toEqual(entity.endDate);
    expect(booking.getGuestCount()).toBe(entity.guestCount);
    expect(booking.getTotalPrice()).toBe(entity.totalPrice);
    expect(booking.getStatus()).toBe(entity.status);
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
    const entity = new BookingEntity();

    expect(() => BookingMapper.toDomain(entity)).toThrow();
  });

  it("deve converter Booking para BookingEntity corretamente", () => {
    const property = new Property(
      "2",
      "Apartamento Central",
      "Apartamento no centro da cidade",
      4,
      300
    );

    const guest = new User("3", "Maria");
    const dateRange = new DateRange(new Date("2025-11-01"), new Date("2025-11-10"));
    const booking = new Booking(
      "2",
      property,
      guest,
      dateRange,
      3
    );

    booking["totalPrice"] = 2700;
    booking["status"] = "CONFIRMED";

    const entity = BookingMapper.toPersistence(booking);
    expect(entity).toBeInstanceOf(BookingEntity);
    expect(entity.id).toBe(booking.getId());
    expect(entity.property.id).toBe(property.getId());
    expect(entity.guest.id).toBe(guest.getId());
    expect(entity.startDate).toEqual(dateRange.getStartDate());
    expect(entity.endDate).toEqual(dateRange.getEndDate());
    expect(entity.guestCount).toBe(booking.getGuestCount());
    expect(entity.totalPrice).toBe(booking.getTotalPrice());
    expect(entity.status).toBe(booking.getStatus());
  });
});
