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

    req.headers.authorization = `Bearer ${token}`;

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
                const creatorToken = await db.query('UPDATE users set token = $1 where email = $2;', [token, email])
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
        const creator = await db.query('SELECT * FROM users where token = $1;', [token])
        const insertURL = await db.query('INSERT INTO urls (url, "createdat", "shortUrl" ) values ($1, $2, $3);', [url, createdAt, shortId])
        const selectURL = await db.query('SELECT * FROM urls where url = $1;', [url])
        const insertCreator = await db.query('UPDATE urls SET creator = $1 where "shortUrl" = $2;', [creator.rows[0].email, shortId])
        const linkCount = await db.query('UPDATE users set linksCount = linksCount + 1 where token = $1;', [token])
        const objectReturn = {
            id: selectURL.rows[0].id,
            shortUrl: selectURL.rows[0].shortUrl
        };

        return res.status(201).send(objectReturn)


    } catch (err) {
        return res.status(500).send(err.message)
    }



})

app.get('/urls/:id', async (req, res) => {
    const { id } = req.params

    try {

        const urlId = await db.query('SELECT * FROM urls WHERE id = $1;', [id]);
        if (urlId.rows.length > 0) {
            const { id, shortUrl, url } = urlId.rows[0];
            const formattedurlId = { id, shortUrl, url };
            const visitCounter = await db.query('UPDATE urls SET visitcount = visitcount + 1 where id = $1;', [id]);
            const userVisitCounter = await db.query('UPDATE users SET visitcount = visitcount + 1 WHERE email IN (SELECT creator FROM urls WHERE id = $1);', [id]);
            console.log("url:",urlId.rows[0])
            return res.status(200).json(formattedurlId);
        } else {
            return res.status(404).send('Não existe este ID.');
        }


    } catch (err) {
        return res.status(500).send(err.message)

    }


})

app.get('/urls/open/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;


    try {
        const urlId = await db.query('SELECT * FROM urls WHERE "shortUrl" = $1;', [shortUrl]);
        if (urlId.rows.length > 0) {
            // Atualizar o contador
            await db.query('UPDATE urls SET visitcount = visitcount + 1 WHERE "shortUrl" = $1;', [shortUrl]);

            console.log(urlId.rows[0])
            return res.status(302).redirect(urlId.rows[0].shortUrl);
        } else {
            return res.status(404).send('Não existe esta URL.');
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
});



app.get('/users/me', async (req, res) => {

    if (!token) {
        return res.status(401).send('Precisa ter o token.');
    }

    try {
        // Obter o usuário com base no token
        const userResult = await db.query('SELECT * FROM users where token = $1;', [token]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).send('Usuário não encontrado.');
        }

        // Obter as URLs encurtadas criadas pelo usuário
        const urlsResult = await db.query('SELECT * FROM urls where creator = $1;', [user.email]);
        const urls = urlsResult.rows;

        // Calcular a soma de visitCount para o usuário e para cada URL encurtada
        const userVisitCount = urls.reduce((sum, url) => sum + (url.visitcount || 0), 0);
        const shortenedUrls = urls.map((url) => ({
            id: url.id,
            shortUrl: url.shortUrl,
            url: url.url,
            visitCount: url.visitcount || 0,
        }));


        // Montar o objeto de resposta final
        const responseObj = {
            id: user.id,
            name: user.name,
            visitCount: userVisitCount,
            shortenedUrls,
        };

        return res.status(200).json(responseObj);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});


app.delete('/urls/:id', async (req, res) => {
    const { id } = req.params

    if (!token) {
        return res.status(403).send('precisa ter o token')
    }

    try {


        ///VERIFICA SE A ID EXISTE
        const verifyId = await db.query('SELECT * FROM urls where id = $1;', [id])

        if (verifyId.rows.length > 0 ) {

        ///verificar se o cara pode deletar a coisa. se ele é criador.
        const verifyDelPermission = await db.query('SELECT urls.id, urls."shortUrl", urls.url, urls.visitcount FROM urls JOIN users ON urls.creator = users.email WHERE urls.id = $1 AND users.token = $2;', [id, token])

        if (verifyDelPermission.rows.length > 0) {
            console.log(verifyDelPermission.rows)

            const del = await db.query('delete from urls where id = $1;', [id])

            return res.status(204).send('Link deletado!')
        } else {
            return res.status(401).send('Não pode deletar o link de outro usuário')
        }
    } else {
        return res.status(404).send('ID NÃO ENCONTRADA!')
    }

    } catch (err) {
        return res.status(500).send(err.message)

    }
})

app.get('/ranking', async (req, res) => {

    try {
        const users = await db.query('SELECT id, name, linksCount as "linksCount", COALESCE(visitCount, 0) as "visitCount" FROM users ORDER BY visitCount DESC LIMIT 10;');
        return res.status(200).send(users.rows)
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