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

    it("deve lançar um erro quando a propriedade não for encontrada", async () => {
        mockPropertyService.findPropertyById.mockResolvedValue(null);

        const bookingDTO: CreateBookingDTO = {
            propertyId: "1",
            guestId: "1",
            startDate: new Date("2024-12-20"),
            endDate: new Date("2024-12-25"),
            guestCount: 2
        };

        await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
            "Propriedade não encontrada."
        );
    });

    it("deve lançar um erro quando o usuário não for encontrado", async () => {
        const mockProperty = {
            getId: jest.fn().mockReturnValue("1"),
        } as any;

        mockedUserService.findUserById.mockResolvedValue(null);
        mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);

        const bookingDTO: CreateBookingDTO = {
            propertyId: "1",
            guestId: "1",
            startDate: new Date("2024-12-20"),
            endDate: new Date("2024-12-25"),
            guestCount: 2
        };

        await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
            "Usuário não encontrado."
        );
    });

    it("deve lançar um erro ao tentar criar reserva para um período já reservado", async () => {
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

        mockProperty.isAvailable.mockReturnValue(false);
        mockProperty.addBooking.mockImplementationOnce(() => {
            throw new Error("A propriedade não está disponível para o período selecionado.");
        });

        await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
            "A propriedade não está disponível para o período selecionado."
        );
    });

    it("deve cancelar uma reserva existente usando o repositório fake", async () => {
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

        const booking = await bookingService.createBooking(bookingDTO);

        const spyFindById = jest.spyOn(fakeBookingRepository, "findById");

        await bookingService.cancelBooking(booking.getId());

        const canceledBooking = await fakeBookingRepository.findById(
            booking.getId()
        );

        expect(canceledBooking?.getStatus()).toBe("CANCELED");
        expect(spyFindById).toHaveBeenCalledWith(booking.getId());
        expect(spyFindById).toHaveBeenCalledTimes(2);
        spyFindById.mockRestore();
    });
});
