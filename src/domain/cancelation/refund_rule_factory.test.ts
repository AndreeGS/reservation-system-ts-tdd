import { RefundRuleFactory } from "./refund_rule_factory";
import { FullRefund } from "./full_refund";
import { PartialRefund } from "./partial_refund";
import { NoRefund } from "./no_refund";

describe("RefundRuleFactory", () => {
	it("deve retornar FullRefund quando a reserva for cancelada com mais de 7 dias de antecedência", () => {
		const rule = RefundRuleFactory.getRefundRule(8);
		expect(rule).toBeInstanceOf(FullRefund);
	});

	it("deve retornar PartialRefund quando a reserva for cancelada entre 1 e 7 dias de antecedência", () => {
		for (let days = 1; days <= 7; days++) {
			const rule = RefundRuleFactory.getRefundRule(days);
			expect(rule).toBeInstanceOf(PartialRefund);
		}
	});

	it("deve retornar NoRefund quando a reserva for cancelada com menos de 1 dia de antecedência", () => {
		const rule = RefundRuleFactory.getRefundRule(0);
		expect(rule).toBeInstanceOf(NoRefund);
		const ruleNegative = RefundRuleFactory.getRefundRule(-2);
		expect(ruleNegative).toBeInstanceOf(NoRefund);
	});
});
