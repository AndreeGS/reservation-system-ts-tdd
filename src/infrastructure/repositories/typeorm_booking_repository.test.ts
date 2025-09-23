import { DataSource, Repository } from "typeorm";
import { Property } from "../../domain/entities/property";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { TypeORMPropertyRepository } from "./typeorm_property_repository";
import { Booking } from "../../domain/entities/booking";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { TypeORMBookingRepository } from "./typeorm_booking_repository";
import { UserEntity } from "../persistence/entities/user_entity";
import { DateRange } from "../../domain/value_objects/date_range";
import { User } from "../../domain/entities/user";

describe('TypeORMBookingRepository', () => {

    let dataSource: DataSource;
    let bookingRepository: TypeORMBookingRepository;

    beforeAll(async () => {
       dataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: [PropertyEntity, UserEntity, BookingEntity],
            synchronize: true,
            logging: false,
       });
        
        await dataSource.initialize();
        bookingRepository = new TypeORMBookingRepository(
            dataSource.getRepository(BookingEntity)
        );
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    it("deve salvar uma reserva com sucesso", async () => {
        const propertyRepository = dataSource.getRepository(PropertyEntity);
        const userRepository = dataSource.getRepository(UserEntity);

        const propertyEntity = propertyRepository.create({
            id: "1",
            name: "Casa de Praia",
            description: "Uma linda casa de praia",
            maxGuests: 6,
            basePricePerNight: 200
        });

        await propertyRepository.save(propertyEntity);

        const property = new Property(
            "1", 
            "Casa de Praia", 
            "Uma linda casa de praia", 
            6, 
            200
        );

        const userEntity = userRepository.create({
            id: "1",
            name: "João",
        });

        await userRepository.save(userEntity);

        const user = new User("1", "João");
        const dateRange = new DateRange(
            new Date("2024-12-20"), 
            new Date("2024-12-25")
        );

        const booking = new Booking(
            "1",
            property,
            user,
            dateRange,
            4
        );

        await bookingRepository.save(booking);

        const savedBooking = await bookingRepository.findById("1");

        expect(savedBooking).not.toBeNull();
        expect(savedBooking?.getId()).toBe("1");
        expect(savedBooking?.getProperty().getId()).toBe("1");
        expect(savedBooking?.getGuest().getId()).toBe("1");
    });

    it("deve retornar null ao buscar uma reserva inexistente", async () => {
        const savedBooking = await bookingRepository.findById("20");
        
        expect(savedBooking).toBeNull();
    });

    it("deve salvar uma reserva com sucesso - fazendo um cancelamento posterior", async () => {
        const propertyRepository = dataSource.getRepository(PropertyEntity);
        const userRepository = dataSource.getRepository(UserEntity);

        const propertyEntity = propertyRepository.create({
            id: "1",
            name: "Casa de Praia",
            description: "Uma linda casa de praia",
            maxGuests: 6,
            basePricePerNight: 200
        });

        await propertyRepository.save(propertyEntity);

        const property = new Property(
            "1", 
            "Casa de Praia", 
            "Uma linda casa de praia", 
            6, 
            200
        );

        const userEntity = userRepository.create({
            id: "1",
            name: "João",
        });

        await userRepository.save(userEntity);

        const user = new User("1", "João");
        const dateRange = new DateRange(
            new Date("2024-12-20"), 
            new Date("2024-12-25")
        );

        const booking = new Booking(
            "1",
            property,
            user,
            dateRange,
            4
        );

        await bookingRepository.save(booking);

        booking.cancel(new Date("2024-12-15"));

        await bookingRepository.save(booking);

        const updatedBooking = await bookingRepository.findById("1");

        expect(updatedBooking).not.toBeNull();
        expect(updatedBooking?.getStatus()).toBe("CANCELED");
    });
});