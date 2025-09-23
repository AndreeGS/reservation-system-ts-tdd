import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { PropertyEntity } from "./property_entity";
import { UserEntity } from "./user_entity";

@Entity("bookings")
export class BookingEntity {

    @ManyToOne(() => PropertyEntity, (property) => property.bookings, {
        nullable: false,
    })

    @JoinColumn({ name: "property_id" })
    property!: PropertyEntity;

    @ManyToOne(() => UserEntity, {nullable: false })

    @JoinColumn({ name: "guest_id" })
    guest!: UserEntity;

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "date", name: "start_date" })
    startDate!: Date;

    @Column({ type: "date", name: "end_date" })
    endDate!: Date;

    @Column({ name: "guests_count" })
    guestCount!: number;

    @Column({ name: "total_price", type: "decimal" })
    totalPrice!: number;

    @Column()
    status!: "CONFIRMED" | "CANCELED";
}