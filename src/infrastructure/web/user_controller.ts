import { CreateUserDTO } from "../../application/dtos/create_user_dto";
import { UserService } from "../../application/services/user_service";
import { Request, Response, Router } from "express";

const router = Router();

export class UserController {
    private userService: UserService;
    
    constructor(userService: UserService) {
        this.userService = userService;
    }

    async createUser(req: Request, res: Response) {    
        try {
            const { userId, name } = req.body;

            if (!name || name.trim() === "") {
                return res.status(400).json({ message: "O campo nome é obrigatório." });
            }

            const userDto: CreateUserDTO = { userId, name };

            const user = await this.userService.createUser(userDto);
            res.status(201).json({
                message: "Usuário criado com sucesso",
                user: {
                    id: user.getId(),
                    name: user.getName()
                }
            });
        } catch (err: any) {
            if (err.message === "O campo nome é obrigatório.") {
                res.status(400).json({ message: err.message });
            } else {
                res.status(500).json({ message: "Erro interno do servidor." });
            }
        }
    }
}

export default router;
