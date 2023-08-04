import express from "express"
import cors from "cors"
import { db } from "./databases/database.connections.js"
import Joi from "joi"
import dayjs from "dayjs"
import bcrypt from "bcrypt"

const app = express()
app.use(cors())
app.use(express.json())



const createUser = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');



app.post('/signup', async (req, res) => {

    const { name, email, password, confirmPassword } = req.body

    

    const validation = createUser.validate({ name, email, password }, { abortEarly: "False" })
    if (validation.error) {
        console.log("erro 1")
        const errors = validation.error.details.map((detail) => detail.message)
        return res.status(422).send(errors);
    }

    if (password !== confirmPassword) {
        return res.status(400).send('A senha e a confirmaçao de senha devem ser iguais.')
    }

    //encriptação
    const passCrypt = bcrypt.hashSync(password, 10)


    try {

        const userVerify = await db.query('SELECT * FROM USERS where email = $1', [email]);
        if (userVerify.rows.length > 0) {
            return res.status(409).send('Email já cadastrado!')
        } else {
            const user = await db.query('INSERT INTO USERS (name, email, password, "createdat") values ($1, $2, $3, $4);', [name, email, passCrypt, createdAt]);
            return res.status(201).send('Usuário criado!')
        }
    } catch (err) {
        return res.status(500).send(err.message)
    }



})

app.post('/teste', async (req,res) => {
    return res.status(200).send('Sucesso')
})





const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})