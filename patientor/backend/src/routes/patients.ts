import express, { type Response } from "express";
import patientService from "../services/patientService.ts";
import type { NonSensitivePatient } from "../../types/type.ts";
const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  const data = patientService.getPatientsWithoutSSN();
  res.send(data);
});

router.post("/", (req, res) => {
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  const { name, ssn, dateOfBirth, gender, occupation } = req.body;
  const addedPatient = patientService.addPatient({
    name,
    ssn,
    dateOfBirth,
    gender,
    occupation,
  });

  res.json(addedPatient);
});

export default router;
