import express, { type Response } from "express";
import patientService from "../services/patientService.ts";
import type { NonSensitivePatient } from "../../types/type.ts";
const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  const data = patientService.getPatientsWithoutSSN();
  res.send(data);
});

router.post("/", (_req, res) => {
  res.send("adding a patient");
});

export default router;
