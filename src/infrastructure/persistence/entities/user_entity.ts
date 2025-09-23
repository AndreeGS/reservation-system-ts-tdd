import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { BookingEntity } from "./booking_entity";

@Entity('users')
export class UserEntity {
    @PrimaryColumn("uuid")
    id!: string;

    @Column()
    name!: string;
}