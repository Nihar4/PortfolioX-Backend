import express from "express";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config({
    path: "./config/config.env",
});
const app = express();

// Using Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(
    express.urlencoded({
        limit: '50mb',
        extended: true,
    })
);
app.use(cookieParser({ limit: '50mb' }));
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

// // Importing & Using Routes
import stock from "./routes/stocksRoute.js";


app.use("/api/v1", stock);


export default app;

app.get("/", (req, res) =>
    res.send(
        `hello`
    )
);

app.use(ErrorMiddleware);
