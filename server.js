import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import planTrip from "./routes/planTrip.js";

const app = express();
app.use(cors());
app.use(express.json());

// API endpoint
app.post("/api/plan-trip", planTrip);

// server port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI backend veikia ant porto ${PORT}`);
});
