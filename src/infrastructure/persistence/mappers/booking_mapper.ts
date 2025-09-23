import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyMapper } from "./property_mapper";
import { UserMapper } from "./user_mapper";

export class BookingMapper {
    static toDomain(entity: BookingEntity, property?: Property): Booking {
        const guest = UserMapper.toDomain(entity.guest);
        const dateRange = new DateRange(new Date(entity.startDate), new Date(entity.endDate));

        const booking = new Booking(
            entity.id,
            property || PropertyMapper.toDomain(entity.property),
            guest,
            dateRange,
            entity.guestCount,
        );

        booking["totalPrice"] = Number(entity.totalPrice);
        booking["status"] = entity.status;

        return booking;
    }

    static toPersistence(booking: Booking): BookingEntity {
        const entity = new BookingEntity();
        entity.id = booking.getId();
        entity.property = PropertyMapper.toPersistence(booking.getProperty());
        entity.guest = UserMapper.toPersistence(booking.getGuest());
        entity.startDate = booking.getDateRange().getStartDate();
        entity.endDate = booking.getDateRange().getEndDate();
        entity.guestCount = booking.getGuestCount();
        entity.totalPrice = booking.getTotalPrice();
        entity.status = booking.getStatus();

        return entity;
    }
}
