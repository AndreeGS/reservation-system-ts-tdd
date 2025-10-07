import { Request, Response, Router } from "express";
import { PropertyService } from "../../application/services/property_service";

export class PropertyController {
	constructor(private propertyService: PropertyService) {}

	async createProperty(req: Request, res: Response) {
		const { id, name, description, maxGuests, basePricePerNight } = req.body;
		try {
			const property = await this.propertyService.createProperty({
				id,
				name,
				description,
				maxGuests,
				basePricePerNight
			});
			res.status(201).json({ message: "Propriedade criada com sucesso", property });
		} catch (err: any) {
			if (err.message === "O nome da propriedade é obrigatório.") {
				res.status(400).json({ message: err.message });
			} else if (err.message === "A capacidade máxima deve ser maior que zero.") {
				res.status(400).json({ message: err.message });
			} else if (err.message === "O preço base por noite é obrigatório.") {
				res.status(400).json({ message: err.message });
			} else {
				res.status(500).json({ message: "Erro interno do servidor." });
			}
		}
	}

	async getPropertyById(req: Request, res: Response) {
		const { id } = req.params;
		const property = await this.propertyService.findPropertyById(id);
		if (!property) {
			res.status(404).json({ message: "Propriedade não encontrada" });
		} else {
			res.status(200).json({ property });
		}
	}
}
