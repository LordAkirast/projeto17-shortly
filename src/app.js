import express from "express"
import cors from "cors"
//import { db } from "./databases/database.connection.js"
import Joi from "joi"
import dayjs from "dayjs"



const app = express()
app.use(cors())
app.use(express.json())

const createGame = Joi.object({
    stockTotal: Joi.number().required(),
    pricePerDay: Joi.number().required(),
});


const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`)
})