export interface RefundRule {
    calculateRefund(totalPrice: number): number;
}
