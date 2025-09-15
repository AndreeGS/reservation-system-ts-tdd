import { Booking } from '../entities/booking';

export interface BookingRepository {
  save(booking: Booking): Promise<void>;
  findById(id: string): Promise<Booking | null>;
}