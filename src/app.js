import express from "express"
import cors from "cors"
import { db } from "./databases/database.connections.js"
import Joi from "joi"
import dayjs from "dayjs"
import bcrypt from "bcrypt"
import { v4 as uuid } from 'uuid'
import { nanoid } from 'nanoid';


const app = express()
app.use(cors())
app.use(express.json())

///sudo su -c "pg_dump shortly --inserts --no-owner" postgres > dump.sql




const createUser = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const loginUser = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

let token = "";

const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

// Middleware para adicionar o header "Authorization" com o token
const addAuthorizationHeader = (req, res, next) => {

    const token = uuid()

    // Adicione o token no header "Authorization" no formato "Bearer TOKEN"
    req.headers.authorization = `Bearer ${token}`;

    // Chame o próximo middleware ou rota
    next();
};



app.post('/signup', async (req, res) => {

    const { name, email, password, confirmPassword } = req.body



    const validation = createUser.validate({ name, email, password }, { abortEarly: "False" })
    if (validation.error) {
        console.log("erro 1")
        const errors = validation.error.details.map((detail) => detail.message)
        return res.status(422).send(errors);
    }

    if (password !== confirmPassword) {
        return res.status(422).send('A senha e a confirmaçao de senha devem ser iguais.')
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

app.post('/signin', async (req, res) => {

    const { email, password } = req.body


    const validation = loginUser.validate({ email, password }, { abortEarly: "False" })
    if (validation.error) {
        console.log("erro 1 - signin")
        const errors = validation.error.details.map((detail) => detail.message)
        return res.status(422).send(errors);
    }

    try {

        const userVerify = await db.query('SELECT * FROM USERS where email = $1', [email]);
        console.log(userVerify.rows)
        if (userVerify.rows.length > 0) {

            const decrypt = bcrypt.compareSync(password, userVerify.rows[0].password)

            if (decrypt === true) {
                console.log('Usuário logado!')
                token = uuid()
                console.log(token)
                return res.status(200).send(({ token: token }))
            } else {
                console.log('senha incorreta')
                return res.status(401).send('Senha incorreta!')
            }
        } else {
            console.log('email incorreto')
            return res.status(401).send('email incorreto!')
        }
    } catch (err) {
        return res.status(500).send(err.message)
    }



})


app.use(addAuthorizationHeader);


app.post('/urls/shorten', async (req, res) => {

    const { url } = req.body

    const shortId = nanoid(8);
    ///const shortUrl1 = url + shortId;


    if (!token) {
        return res.status(401).send('Precisa ter o token.')
    }



    if (!url) {
        return res.status(422).send('URL precisa ser preenchida!');
    }

    if (!url.includes('h')) {
        return res.status(422).send('URL precisa ter o formato HTTPS!');
    }

    if (!url.includes('t')) {
        return res.status(422).send('URL precisa ter o formato HTTPS!');
    }

    if (!url.includes('p')) {
        return res.status(422).send('URL precisa ter o formato HTTPS!');
    }

    if (!url.includes(':')) {
        return res.status(422).send('URL precisa ter o formato HTTPS!');
    }

    if (!url.includes('/')) {
        return res.status(422).send('URL precisa ter o formato HTTPS!');
    }

    try {
        const insertURL = await db.query('INSERT INTO urls (url, "createdat", "shortUrl" ) values ($1, $2, $3);', [url, createdAt, shortId])
        const selectURL = await db.query('SELECT * FROM urls where url = $1;', [url])
        const objectReturn = {
            id: selectURL.rows[0].id,
            shortUrl: selectURL.rows[0].shortUrl
        };

        return res.status(201).send(objectReturn)


    } catch (err) {
        return res.status(500).send(err.message)
    }



})

app.post('/teste', async (req, res) => {
    return res.status(200).send('Sucesso')
})





const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})