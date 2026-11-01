import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";

import patientService from "../services/patientService.ts";
import entryService from "../services/entryService.ts";
import { NewEntrySchema, NewPatientSchema, PatientIdSchema } from "../utils.ts";
import type {
  NewEntryWithoutId,
  NewPatient,
  NonSensitivePatient,
} from "../types/type.ts";
import { z } from "zod";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  const data = patientService.getPatientsWithoutSSN();
  res.send(data);
});

router.get("/:id", (req, res) => {
  try {
    const { id } = PatientIdSchema.parse(req.params);
    const patient = patientService.getPatient(id);
    res.json(patient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(500).send({ error: "Internal server error" });
    }
  }
});

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};
const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.post(
  "/",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
  },
);

router.post(
  "/:id/entries",
  newEntryParser,
  (req: Request<unknown, unknown, NewEntryWithoutId>, res: Response) => {
    const { id } = PatientIdSchema.parse(req.params);
    const patient = patientService.getPatient(id);

    const addedEntry = entryService.addEntry({ patient, entry: req.body });

    res.json(addedEntry);
  },
);

router.use(errorMiddleware);

export default router;
