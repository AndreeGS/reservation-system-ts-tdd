import { Request, Response } from "express";
import { BookingService } from "../../application/services/booking_service";
import { CreateBookingDTO } from "../../application/dtos/create_booking_dto";

export class BookingController {
    private bookingService: BookingService;

    constructor(bookingService: BookingService) {
        this.bookingService = bookingService;
    }

    async createBooking(req: Request, res: Response): Promise<Response> {
        try {
            const startDate = new Date(req.body.startDate);
            const endDate = new Date(req.body.endDate);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ message: "Datas de início ou fim inválidas" });
            }

            if (req.body.guestCount <= 0) {
                return res.status(400).json({ message: "Número de hóspedes deve ser maior que zero" });
            }

            const dto: CreateBookingDTO = {
                startDate: startDate,
                endDate: endDate,
                guestCount: req.body.guestCount,
                propertyId: req.body.propertyId,
                guestId: req.body.guestId,
            };

            const booking = await this.bookingService.createBooking(dto);

            return res.status(201).json(
                { 
                    message: "Reserva criada com sucesso", 
                    booking: {
                        id: booking.getId(),
                        totalPrice: booking.getTotalPrice(),
                        startDate: booking.getDateRange().getStartDate(),
                        endDate: booking.getDateRange().getEndDate(),
                        guestCount: booking.getGuestCount(),
                        propertyId: booking.getProperty().getId(),
                        guestId: booking.getGuest().getId(),
                        status: booking.getStatus()
                    }
                }
            );
        } catch (error: any) {
            return res.status(400).json({ error: error.message || "An unexpected error occurred" });
        }
    }

    async cancelBooking(req: Request, res: Response): Promise<Response> {
        try {
            const bookingId = req.params.id;
            await this.bookingService.cancelBooking(bookingId);

            return res.status(200).json({ message: "Reserva cancelada com sucesso" });
        } catch (error: any) {
            return res.status(400).json({ error: error.message || "An unexpected error occurred" });
        }
    }
}