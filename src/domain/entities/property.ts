import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";

export class Property {
    private readonly id: string;
    private readonly name: string;
    private readonly description: string;
    private readonly maxGuest: number;
    private readonly basePricePerNight: number;
    private readonly bookings: Booking[] = [];

    constructor(
        id: string,
        name: string,
        description: string,
        maxGuest: number,
        basePricePerNight: number
    ) {
        if (!name) {
            throw new Error("O nome da propriedade é obrigatório.");
        }
        if (typeof maxGuest !== "number" || maxGuest <= 0) {
            throw new Error("A capacidade máxima deve ser maior que zero.");
        }
        if (typeof basePricePerNight !== "number" || basePricePerNight <= 0) {
            throw new Error("O preço base por noite é obrigatório.");
        }
        this.id = id;
        this.name = name;
        this.description = description;
        this.maxGuest = maxGuest;
        this.basePricePerNight = basePricePerNight;
    }

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getMaxGuest(): number {
        return this.maxGuest;
    }

    getBasePricePerNight(): number {
        return this.basePricePerNight;
    }

    validateGuestCount(guestCount: number): void {
        if (guestCount > this.maxGuest) {
            throw new Error(
                `Número máximo de hóspedes excedido. Máximo permitido: ${this.maxGuest}.`
            );
        }
    }

    calculateTotalPrice(dateRange: DateRange): number {
        const totalNights = dateRange.getTotalNights();

        let totalPrice = this.basePricePerNight * totalNights;

        if (totalNights >= 7) {
            totalPrice *= 0.9;
        }

        return totalPrice;
    }

    isAvailable(dateRange: DateRange): boolean {
        return !this.bookings.some(
            booking =>
                booking.getStatus() === "CONFIRMED" &&
                booking.getDateRange().overlaps(dateRange)
        );
    }

    addBooking(booking: Booking): void {
        this.bookings.push(booking);
    }

    getBookings(): Booking[] {
        return [...this.bookings];
    }
}
