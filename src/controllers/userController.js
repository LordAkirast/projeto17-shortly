// userController.js
import bcrypt from "bcrypt";
import { db } from "../databases/database.connections.js";
import createUser from "../schemas/createUser.schema.js";
import dayjs from "dayjs";

const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

const createUserfunc = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    try {
        // Validação do corpo da requisição usando o schema userSchema
        const validation = createUser.validate({ name, email, password }, { abortEarly: false });
        if (validation.error) {
            const errors = validation.error.details.map((detail) => detail.message);
            return res.status(422).json(errors);
        }

        if (password !== confirmPassword) {
            return res.status(422).send('A senha e a confirmação de senha devem ser iguais.');
        }

        // Encriptação da senha
        const passCrypt = bcrypt.hashSync(password, 10);

        const userVerify = await db.query('SELECT * FROM USERS where email = $1', [email]);
        if (userVerify.rows.length > 0) {
            return res.status(409).send('Email já cadastrado!');
        } else {
            const user = await db.query('INSERT INTO USERS (name, email, password, "createdat") values ($1, $2, $3, $4);', [name, email, passCrypt, createdAt]);
            return res.status(201).send('Usuário criado!');
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export { createUserfunc };
