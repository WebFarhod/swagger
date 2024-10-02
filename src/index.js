import express from "express";
import cors from "cors"
import morgan from "morgan"
import { JSONFile } from 'lowdb/node'
import { Low } from "lowdb";
import swaggerUI from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
import booksRouter from "./routes/books.js"

const PORT = process.env.PORT || 8080

const defaultData = { books: [] };
const adapter = new JSONFile('db.json');
const db = new Low(adapter, defaultData);

if (!fs.existsSync('db.json')) {
    await db.write();
} else {
    await db.read();
}


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Book API",
            version: "1.0.0",
            description: "Express Library API",
        },
        servers: [
            {
                url: "http://localhost:8080",
            },
        ],
    },
    apis: ["./src/routes/*.js"],
};


const specs = swaggerJSDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));


app.db = db;

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.use("/books", booksRouter)

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`))