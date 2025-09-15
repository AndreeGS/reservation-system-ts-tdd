import { Property } from "./property";
import { DateRange } from "../value_objects/date_range";
import { User } from "./user";
import { RefundRuleFactory } from "../cancelation/refund_rule_factory";

export class Booking {
    private id: string;
    private property: Property;
    private user: User;
    private dateRange: DateRange;
    private numberOfGuests: number;
    private status: "CONFIRMED" | "CANCELED" = "CONFIRMED";
    private totalPrice: number;

    constructor(
        id: string,
        property: Property,
        user: User,
        dateRange: DateRange,
        numberOfGuests: number
    ) {
        if (numberOfGuests <= 0) {
            throw new Error("O número de hóspedes deve ser maior que zero");
        }
        property.validateGuestCount(numberOfGuests);

        if (!property.isAvailable(dateRange)) {
            throw new Error("A propriedade não está disponível para o período selecionado.");
        }

        this.id = id;
        this.property = property;
        this.user = user;
        this.dateRange = dateRange;
        this.numberOfGuests = numberOfGuests;
        this.totalPrice = property.calculateTotalPrice(dateRange);
        this.status = "CONFIRMED";

        property.addBooking(this);
    }

    getId(): string {
        return this.id;
    }

    getProperty(): Property {
        return this.property;
    }

    getUser(): User {
        return this.user;
    }

    getDateRange(): DateRange {
        return this.dateRange;
    }

    getNumberOfGuests(): number {
        return this.numberOfGuests;
    }

    getStatus(): "CONFIRMED" | "CANCELED" {
        return this.status;
    }

    getTotalPrice(): number {
        return this.totalPrice;
    }

    cancel(currentDate: Date): void {
        if (this.status === "CANCELED") {
            throw new Error("Reserva já cancelada");
        }

        this.status = "CANCELED";

        const checkInDate = this.dateRange.getStartDate();
        const timeDiff = checkInDate.getTime() - currentDate.getTime();
        const daysUntilCheckIn = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        const refundRule = RefundRuleFactory.getRefundRule(daysUntilCheckIn);
        this.totalPrice = refundRule.calculateRefund(this.totalPrice);
    }
}
