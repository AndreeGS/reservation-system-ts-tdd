import { RefundRule } from "./refund_rule.interface";
import { FullRefund } from "./full_refund";
import { PartialRefund } from "./partial_refund";
import { NoRefund } from "./no_refund";


export class RefundRuleFactory {
    static getRefundRule(daysUntilCheckIn: number): RefundRule {
        if (daysUntilCheckIn > 7) {
            return new FullRefund();
        } else if (daysUntilCheckIn >= 1) {
            return new PartialRefund();
        } else {
            return new NoRefund();
        }
    }
}