export interface CreateBookingDTO {
    propertyId: string;
    guestId: string;
    startDate: Date;
    endDate: Date;
    guestCount: number;
}
