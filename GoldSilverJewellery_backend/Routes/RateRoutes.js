import express from "express";
import { getRates, updateRates } from "../Controller/RateController.js";

const rateRouter = express.Router();

rateRouter.get("/get", getRates);
rateRouter.post("/update", updateRates);

export default rateRouter;
