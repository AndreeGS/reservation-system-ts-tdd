import { Booking } from "../../domain/entities/booking";
import { CreateBookingDTO } from "../dtos/create_booking_dto";
import { BookingService } from "./booking_service";
import { FakeBookingRepository } from "../../infrastructure/repositories/fake_booking_repository";
import { PropertyService } from "./property_service";
import { UserService } from "./user_service";

jest.mock("./property_service");
jest.mock("./user_service");

describe("BookingService", () => {
    let bookingService: BookingService;
    let fakeBookingRepository: FakeBookingRepository;
    let mockPropertyService: jest.Mocked<PropertyService>;
    let mockedUserService: jest.Mocked<UserService>;

    beforeEach(() => {
        const mockePropertyRepository = {} as any;
        const mockedUserRepository = {} as any;

        mockPropertyService = new PropertyService(
            mockePropertyRepository
        ) as jest.Mocked<PropertyService>;

        mockedUserService = new UserService(
            mockedUserRepository
        ) as jest.Mocked<UserService>;

        fakeBookingRepository = new FakeBookingRepository();

        bookingService = new BookingService(
            fakeBookingRepository,
            mockPropertyService,
            mockedUserService
        );
    });

    it("deve criar uma reserva com sucesso usando o repositorio fake", async () => {
        const mockProperty = {
            getId: jest.fn().mockReturnValue("1"),
            isAvailable: jest.fn().mockReturnValue(true),
            validateGuestCount: jest.fn(),
            calculateTotalPrice: jest.fn().mockReturnValue(500),
            addBooking: jest.fn()
        } as any;

        const mockUser = {
            getId: jest.fn().mockReturnValue("1"),
        } as any;

        mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
        mockedUserService.findUserById.mockResolvedValue(mockUser);

        const bookingDTO: CreateBookingDTO = {
            propertyId: "1",
            guestId: "1",
            startDate: new Date("2024-12-20"),
            endDate: new Date("2024-12-25"),
            guestCount: 2
        };

        const result = await bookingService.createBooking(bookingDTO);

        expect(result).toBeInstanceOf(Booking);
        expect(result.getStatus()).toEqual("CONFIRMED");
        expect(result.getTotalPrice()).toEqual(500);

        const saveBooking = await fakeBookingRepository.findById(result.getId());
        expect(saveBooking).not.toBeNull();
        expect(saveBooking?.getId()).toEqual(result.getId());
    });
});
