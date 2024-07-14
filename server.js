"use strict";

process.on("uncaughtException", (error) => { console.log("Error:", error); });

import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { bootstrap } from "./src/modules/index.routes.js";
import dotenv from "dotenv";

// Config For File dotenv
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
bootstrap(app);

// Database Connection Error Handle
process.on("unhandledRejection", (error) => { console.log("Error:", error); });

// Server running....
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
