import { Property } from "./property";
import { User } from "./user";
import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";

describe("Booking Entity", () => {
    it("deve criar uma instância de Booking com todos os atributos", () => {
        const property = new Property("1", "Casa", "Descrição", 4, 100);

        const user = new User("1", "João silva");
        
        const dateRange = new DateRange(
            new Date("2024-12-20"), 
            new Date("2024-12-25")
        );

        const booking = new Booking("1", property, user, dateRange, 2);

        expect(booking.getId()).toBe("1");
        expect(booking.getProperty()).toBe(property);
        expect(booking.getUser()).toBe(user);
        expect(booking.getDateRange()).toBe(dateRange);
        expect(booking.getNumberOfGuests()).toBe(2);
    });

    it("deve lançar um erro se o número de hóspedes for zero ou negativo", () => {
        const property = new Property("1", "Casa", "Descrição", 5, 150);
        const user = new User("1", "João Silva");
        const dateRange = new DateRange(
            new Date("2024-12-10"),
            new Date("2024-12-15")
        );

        expect(() => {
            new Booking("1", property, user, dateRange, 0);
        }).toThrow("O número de hóspedes deve ser maior que zero");
    });

    it("deve lançar um erro ao tentar reservar com um número de hóspedes acima do máximo permitido", () => {
        const property = new Property("1", "Casa", "Descrição", 5, 150);
        const user = new User("1", "João Silva");
        const dateRange = new DateRange(
            new Date("2024-12-10"),
            new Date("2024-12-15")
        );

        expect(() => {
            new Booking("1", property, user, dateRange, 6);
        }).toThrow("Número máximo de hóspedes excedido. Máximo permitido: 5");
    });

    it("deve calcular o preço total com desconto", () => {
        //Arrange
        const property = new Property("1", "Casa", "Descrição", 4, 300);
        const user = new User("1", "João Silva");
        const dateRange = new DateRange(
            new Date("2024-12-01"),
            new Date("2024-12-10")
        );

        //Act
        const booking = new Booking("1", property, user, dateRange, 2);

        //Assert
        expect(booking.getTotalPrice()).toBe(300*9*0.9);
    });

    it("não deve realizar o agendamento, quando uma propriedade não estiver disponível", () => {
        //Arrange
        const property = new Property("1", "Casa", "Descrição", 4, 300);
        const user = new User("1", "João Silva");
        const dateRange = new DateRange(
            new Date("2024-12-01"),
            new Date("2024-12-10")
        );
        
        const booking = new Booking("1", property, user, dateRange, 2);

        //Act
        const dateRange2 = new DateRange(
            new Date("2024-12-02"),
            new Date("2024-12-09")
        );

        //Assert
        expect(() => {
            new Booking("2", property, user, dateRange2, 4);
        }).toThrow("A propriedade não está disponível para o período selecionado.");
    });

    it("deve cancelar uma reserva sem reembolso quando faltam menos de 1 dia pra o check-in", () => {
        const property = new Property("1", "Casa", "Descrição", 4, 300);
        const user = new User("1", "João Silva");
        const dateRange = new DateRange(
            new Date("2024-12-20"),
            new Date("2024-12-22")
        );

        const booking = new Booking("1", property, user, dateRange, 4);

        //Act
        const currentDate = new Date("2024-12-20");

        booking.cancel(currentDate);

        //Assert
        expect(booking.getStatus()).toBe("CANCELED");
        expect(booking.getTotalPrice()).toBe(600);
    });

    it("deve cancelar uma reserva com reembolso a data for superior a 7 dias antes do check-in", () => {
        const property = new Property("1", "Casa", "Descrição", 4, 300);
        const user = new User("1", "João Silva");
        const dateRange = new DateRange(
            new Date("2024-12-20"),
            new Date("2024-12-25")
        );

        const booking = new Booking("1", property, user, dateRange, 4);

        //Act
        const currentDate = new Date("2024-12-10");

        booking.cancel(currentDate);

        //Assert
        expect(booking.getStatus()).toBe("CANCELED");
        expect(booking.getTotalPrice()).toBe(0);
    });

    it("deve cancelar uma reserva com reembolso parcial quando a data estiver entre 1 e 7 dias antes do check-in", () => {
        const property = new Property("1", "Casa", "Descrição", 4, 300);
        const user = new User("1", "João Silva");
        const dateRange = new DateRange(
            new Date("2024-12-20"),
            new Date("2024-12-25")
        );

        const booking = new Booking("1", property, user, dateRange, 4);

        //Act
        const currentDate = new Date("2024-12-15");

        booking.cancel(currentDate);

        //Assert
        expect(booking.getStatus()).toBe("CANCELED");
        expect(booking.getTotalPrice()).toBe(300 * 5 * 0.5);
    });

    it("Não deve permitir cancelar a mesma reserva mais que uma vez", () => {
        const property = new Property("1", "Casa", "Descrição", 4, 300);
        const user = new User("1", "João Silva");
        const dateRange = new DateRange(
            new Date("2024-12-20"),
            new Date("2024-12-25")
        );

        const booking = new Booking("1", property, user, dateRange, 4);

        //Act
        const currentDate = new Date("2024-12-15");

        booking.cancel(currentDate);

        //Assert
        expect(() => {
            booking.cancel(currentDate);
        }).toThrow("Reserva já cancelada");
    });
});
