import { z } from "zod";
import type { NewPatient } from "./types/type.ts";
import { Gender } from "./types/type.ts";

const parseNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

export const EntrySchema = z.object({
  id: z.string(),
  desciption: z.string(),
  date: z.iso.date(),
  specialist: z.string(),
  type: z.enum(["Hospital", "HealthCheck", "OccupationalHealthcare"]),
});

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  gender: z.enum(Gender),
  ssn: z.string(),
  occupation: z.string(),
  entries: z.array(EntrySchema).optional(),
});

export const PatientIdSchema = z.object({
  id: z.string(),
});

export default parseNewPatient;
